"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Phone, Calendar, Download, Send, CheckCircle, XCircle, Clock } from "lucide-react"
import type { JobApplication } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { AdminHeader } from "@/components/admin-header"

// Add imports
import { db } from "@/lib/supabase"
import { notFound } from "next/navigation"

// Update the component:
export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const [notes, setNotes] = useState("")
  const [application, setApplication] = useState<JobApplication | null>(null)

  const applicationId = params.id as string

  if (!application) {
    try {
      const initialApplication = await db.getApplication(applicationId)
      if (initialApplication) {
        setApplication(initialApplication as JobApplication)
      } else {
        notFound()
        return null
      }
    } catch (error) {
      notFound()
      return null
    }
  }

  // Update the updateApplicationStatus function:
  const updateApplicationStatus = async (newStatus: "pending" | "reviewing" | "accepted" | "rejected") => {
    setIsUpdating(true)

    try {
      const updatedApplication = await db.updateApplication(applicationId, { status: newStatus })

      if (updatedApplication) {
        setApplication(updatedApplication as JobApplication)
        toast({
          title: "Status Updated",
          description: `Application status changed to ${newStatus}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewing":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewing":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <AuthGuard requiredPermissions={["view_applications"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        {/* Replace the existing header section with a simple breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Rest of the existing content remains the same */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{application?.applicantName}</CardTitle>
                      <CardDescription className="text-lg">{application?.jobTitle}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(application?.status || "")} flex items-center gap-1`}>
                      {getStatusIcon(application?.status || "")}
                      {application?.status?.charAt(0).toUpperCase() + application?.status?.slice(1) || ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{application?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{application?.phone}</span>
                    </div>
                    {application?.linkedIn && (
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">LinkedIn:</span>
                        <a
                          href={application?.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Available: {application?.availability}</span>
                    </div>
                  </div>

                  <div>
                    <strong>Experience:</strong> {application?.experience}
                  </div>

                  <div>
                    <strong>Resume:</strong>
                    <Button variant="outline" size="sm" className="ml-2 bg-transparent">
                      <Download className="h-4 w-4 mr-1" />
                      {application?.resumeFileName}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              {application?.coverLetter && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {application?.coverLetter}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Application Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Application Submitted</div>
                        <div className="text-sm text-gray-500">
                          {new Date(application?.appliedAt || "").toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="font-medium">Last Updated</div>
                        <div className="text-sm text-gray-500">
                          {new Date(application?.lastUpdated || "").toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                  <CardDescription>Change the application status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => updateApplicationStatus("reviewing")}
                    disabled={isUpdating || application?.status === "reviewing"}
                    className="w-full"
                    variant={application?.status === "reviewing" ? "default" : "outline"}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark as Reviewing
                  </Button>
                  <Button
                    onClick={() => updateApplicationStatus("accepted")}
                    disabled={isUpdating || application?.status === "accepted"}
                    className="w-full bg-green-600 hover:bg-green-700"
                    variant={application?.status === "accepted" ? "default" : "outline"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Application
                  </Button>
                  <Button
                    onClick={() => updateApplicationStatus("rejected")}
                    disabled={isUpdating || application?.status === "rejected"}
                    className="w-full"
                    variant={application?.status === "rejected" ? "destructive" : "outline"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                  <CardDescription>Add notes about this application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/admin/applications/${application?.id}/email`}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
