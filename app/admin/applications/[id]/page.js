"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  FileText,
  Calendar,
  Send,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AdminHeader } from "@/components/admin-header";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ViewApplicationPage({ params }) {
  const [application, setApplication] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [applicationData, emailLogsData] = await Promise.all([
          db.getApplication(params.id),
          db.getEmailLogs(params.id),
        ]);

        if (applicationData) {
          setApplication(applicationData);
          setEmailLogs(emailLogsData);
        } else {
          toast({
            title: "Application not found",
            description: "The application you're looking for doesn't exist.",
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

    fetchData();
  }, [params.id, toast, router]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedApplication = await db.updateApplication(params.id, {
        status: newStatus,
      });
      if (updatedApplication) {
        setApplication({ ...application, status: newStatus });
        toast({
          title: "Status updated",
          description: `Application status changed to ${newStatus}.`,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <AuthGuard requiredPermissions={["view_applications"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {application.first_name} {application.last_name}
                  </h1>
                  <p className="text-gray-600">
                    Application for{" "}
                    {application.job?.title || "Unknown Position"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </Badge>
                  <Button asChild>
                    <Link href={`/admin/applications/${application.id}/email`}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="details" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="details">
                      Application Details
                    </TabsTrigger>
                    <TabsTrigger value="emails">
                      Email History ({emailLogs.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{application.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">{application.phone}</p>
                            </div>
                          </div>
                          {application.linkedin_url && (
                            <div className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-600">
                                  LinkedIn
                                </p>
                                <a
                                  href={application.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Applied</p>
                              <p className="font-medium">
                                {new Date(
                                  application.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Experience
                          </p>
                          <p className="font-medium">
                            {application.experience}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Availability
                          </p>
                          <p className="font-medium">
                            {application.availability}
                          </p>
                        </div>
                        {application.resume_file_name && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Resume</p>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">
                                {application.resume_file_name}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Cover Letter */}
                    {application.cover_letter && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Cover Letter</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap text-gray-700">
                              {application.cover_letter}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Job Details */}
                    {application.job && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Position Applied For</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">
                              {application.job.title}
                            </h3>
                            <p className="text-gray-600">
                              {application.job.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline">
                                {application.job.department}
                              </Badge>
                              <Badge variant="outline">
                                {application.job.location}
                              </Badge>
                              <Badge variant="outline">
                                {application.job.type}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="emails" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Communication History</CardTitle>
                        <CardDescription>
                          All emails sent to this applicant
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {emailLogs.length === 0 ? (
                          <div className="text-center py-8">
                            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No emails sent yet</p>
                            <Button className="mt-4" asChild>
                              <Link
                                href={`/admin/applications/${application.id}/email`}
                              >
                                Send First Email
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {emailLogs.map((email) => (
                              <div
                                key={email.id}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">
                                    {email.subject}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      email.sent_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  To: {email.recipient_email} • From:{" "}
                                  {email.sender_email}
                                </div>
                                <div className="prose max-w-none text-sm">
                                  <p className="whitespace-pre-wrap">
                                    {email.body}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status Management</CardTitle>
                    <CardDescription>
                      Update the application status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant={
                          application.status === "pending"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleStatusUpdate("pending")}
                      >
                        Pending Review
                      </Button>
                      <Button
                        variant={
                          application.status === "reviewing"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleStatusUpdate("reviewing")}
                      >
                        Under Review
                      </Button>
                      <Button
                        variant={
                          application.status === "accepted"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleStatusUpdate("accepted")}
                      >
                        Accepted
                      </Button>
                      <Button
                        variant={
                          application.status === "rejected"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleStatusUpdate("rejected")}
                      >
                        Rejected
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        asChild
                      >
                        <Link
                          href={`/admin/applications/${application.id}/email`}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">
                            Application Submitted
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              application.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {application.updated_at &&
                        application.updated_at !== application.created_at && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">
                                Status Updated
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  application.updated_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      {emailLogs.length > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">
                              Last Email Sent
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                emailLogs[0].sent_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
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
