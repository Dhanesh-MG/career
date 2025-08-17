"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Mail } from "lucide-react"
import { mockApplications } from "@/lib/data"
import { sendEmail, emailTemplates } from "@/lib/email"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { AdminHeader } from "@/components/admin-header"

export default function SendEmailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  const { toast } = useToast()

  const application = mockApplications.find((app) => app.id === applicationId)

  const [emailData, setEmailData] = useState({
    to: application?.email || "",
    subject: "",
    message: "",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isSending, setIsSending] = useState(false)

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplate(templateType)

    let template
    switch (templateType) {
      case "received":
        template = emailTemplates.applicationReceived(application.applicantName, application.jobTitle)
        break
      case "accepted":
        template = emailTemplates.applicationAccepted(application.applicantName, application.jobTitle)
        break
      case "rejected":
        template = emailTemplates.applicationRejected(application.applicantName, application.jobTitle)
        break
      default:
        return
    }

    setEmailData({
      ...emailData,
      subject: template.subject,
      message: template.html
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    })
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      await sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.message.replace(/\n/g, "<br>"),
      })

      toast({
        title: "Email Sent Successfully",
        description: `Email sent to ${application.applicantName}`,
      })

      router.push(`/admin/applications/${applicationId}`)
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AuthGuard requiredPermissions={["send_emails"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/admin/applications/${applicationId}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Application
          </Link>
        </div>

        {/* Rest of the existing content remains the same */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Email Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Compose Email
                    </CardTitle>
                    <CardDescription>
                      Send an email to {application.applicantName} regarding their application for{" "}
                      {application.jobTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendEmail} className="space-y-4">
                      <div>
                        <Label htmlFor="to">To</Label>
                        <Input
                          id="to"
                          type="email"
                          value={emailData.to}
                          onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={emailData.subject}
                          onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                          placeholder="Enter email subject"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={emailData.message}
                          onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                          placeholder="Enter your message"
                          rows={12}
                          required
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" disabled={isSending} className="flex-1">
                          <Send className="h-4 w-4 mr-2" />
                          {isSending ? "Sending..." : "Send Email"}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                          <Link href={`/admin/applications/${applicationId}`}>Cancel</Link>
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
                    <CardDescription>Choose from pre-written templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant={selectedTemplate === "received" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTemplateSelect("received")}
                    >
                      Application Received
                    </Button>
                    <Button
                      variant={selectedTemplate === "accepted" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTemplateSelect("accepted")}
                    >
                      Application Accepted
                    </Button>
                    <Button
                      variant={selectedTemplate === "rejected" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTemplateSelect("rejected")}
                    >
                      Application Rejected
                    </Button>
                  </CardContent>
                </Card>

                {/* Applicant Info */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Applicant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {application.applicantName}
                    </div>
                    <div>
                      <strong>Email:</strong> {application.email}
                    </div>
                    <div>
                      <strong>Position:</strong> {application.jobTitle}
                    </div>
                    <div>
                      <strong>Status:</strong> {application.status}
                    </div>
                    <div>
                      <strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
