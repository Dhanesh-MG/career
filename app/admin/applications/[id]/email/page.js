"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AdminHeader } from "@/components/admin-header";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/supabase";
import { sendEmail } from "@/lib/email-supabase";

export default function SendEmailPage({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
  });

  const emailTemplates = {
    acknowledgment: {
      subject: "Thank you for your application",
      body: `Dear {firstName},

Thank you for your interest in the {jobTitle} position at TechCorp. We have received your application and are currently reviewing it.

We will be in touch within the next 5-7 business days to update you on the status of your application.

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
The TechCorp Hiring Team`,
    },
    interview: {
      subject: "Interview Invitation - {jobTitle}",
      body: `Dear {firstName},

We are pleased to inform you that we would like to invite you for an interview for the {jobTitle} position.

Please reply to this email with your availability for the coming week, and we will schedule a time that works for both parties.

The interview will be conducted via video call and should take approximately 45 minutes.

We look forward to speaking with you soon.

Best regards,
The TechCorp Hiring Team`,
    },
    rejection: {
      subject: "Update on your application - {jobTitle}",
      body: `Dear {firstName},

Thank you for your interest in the {jobTitle} position at TechCorp and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We appreciate the time you invested in the application process and encourage you to apply for future opportunities that match your skills and interests.

Best regards,
The TechCorp Hiring Team`,
    },
    offer: {
      subject: "Job Offer - {jobTitle}",
      body: `Dear {firstName},

We are excited to extend an offer for the {jobTitle} position at TechCorp!

We were impressed by your qualifications and believe you would be a great addition to our team.

Please find the detailed offer letter attached. We would like to schedule a call to discuss the details and answer any questions you may have.

Please let us know your availability for a call this week.

Congratulations and we look forward to hearing from you!

Best regards,
The TechCorp Hiring Team`,
    },
  };

  useEffect(() => {
    async function fetchApplication() {
      try {
        const applicationData = await db.getApplication(params.id);
        if (applicationData) {
          setApplication(applicationData);
        } else {
          toast({
            title: "Application not found",
            description:
              "The application you're trying to email doesn't exist.",
            variant: "destructive",
          });
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast({
          title: "Error",
          description: "Failed to load application details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [params.id, toast, router]);

  const handleInputChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const applyTemplate = (templateKey) => {
    const template = emailTemplates[templateKey];
    if (template && application) {
      const subject = template.subject
        .replace("{firstName}", application.first_name)
        .replace("{jobTitle}", application.job?.title || "the position");

      const body = template.body
        .replace(/{firstName}/g, application.first_name)
        .replace(/{jobTitle}/g, application.job?.title || "the position");

      setEmailData({
        subject,
        body,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Send the email
      const emailResult = await sendEmail({
        to: application.email,
        subject: emailData.subject,
        body: emailData.body,
      });

      if (emailResult.success) {
        // Log the email in the database
        await db.createEmailLog({
          application_id: application.id,
          recipient_email: application.email,
          sender_email: "hr@techcorp.com", // This should come from the authenticated user
          subject: emailData.subject,
          body: emailData.body,
          sent_at: new Date().toISOString(),
        });

        toast({
          title: "Email sent successfully!",
          description: "The email has been sent to the applicant.",
        });

        router.push(`/admin/applications/${application.id}`);
      } else {
        throw new Error(emailResult.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Not Found
          </h1>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredPermissions={["send_emails"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/applications/${application.id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Application
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Send Email</h1>
              <p className="text-gray-600">
                Send an email to {application.first_name}{" "}
                {application.last_name} ({application.email})
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Email Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                    <CardDescription>
                      Write your email message below
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={emailData.subject}
                          onChange={handleInputChange}
                          placeholder="Enter email subject..."
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="body">Message *</Label>
                        <Textarea
                          id="body"
                          name="body"
                          value={emailData.body}
                          onChange={handleInputChange}
                          placeholder="Enter your message..."
                          rows={12}
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                          <Link href={`/admin/applications/${application.id}`}>
                            Cancel
                          </Link>
                        </Button>
                        <Button type="submit" disabled={isSending}>
                          <Send className="h-4 w-4 mr-2" />
                          {isSending ? "Sending..." : "Send Email"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Email Templates */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>
                      Use pre-written templates to save time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => applyTemplate("acknowledgment")}
                      >
                        Application Acknowledgment
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => applyTemplate("interview")}
                      >
                        Interview Invitation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => applyTemplate("offer")}
                      >
                        Job Offer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => applyTemplate("rejection")}
                      >
                        Application Rejection
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Applicant Info */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Applicant Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">
                          {application.first_name} {application.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-medium">
                          {application.job?.title || "Unknown Position"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium capitalize">
                          {application.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
