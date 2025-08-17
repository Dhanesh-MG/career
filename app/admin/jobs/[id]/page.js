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
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AdminHeader } from "@/components/admin-header";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ViewJobPage({ params }) {
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobData, applicationsData] = await Promise.all([
          db.getJob(params.id),
          db.getApplications({ job_id: params.id }),
        ]);

        if (jobData) {
          setJob(jobData);
          setApplications(applicationsData);
        } else {
          toast({
            title: "Job not found",
            description: "The job you're looking for doesn't exist.",
            variant: "destructive",
          });
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          title: "Error",
          description: "Failed to load job details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, toast, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const success = await db.deleteJob(params.id);
      if (success) {
        toast({
          title: "Job deleted",
          description: "The job has been successfully deleted.",
        });
        router.push("/admin");
      } else {
        throw new Error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusColor = (status) => {
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
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
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
                    {job.title}
                  </h1>
                  <p className="text-gray-600">Job Details and Applications</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/jobs/${job.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Job Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {job.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">
                          Requirements
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, index) => (
                            <Badge key={index} variant="secondary">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.responsibilities &&
                      job.responsibilities.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            Responsibilities
                          </h3>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-sm text-gray-500 pt-4 border-t">
                      <p>
                        Created: {new Date(job.created_at).toLocaleDateString()}
                      </p>
                      {job.updated_at && job.updated_at !== job.created_at && (
                        <p>
                          Last updated:{" "}
                          {new Date(job.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Applications Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Applications ({applications.length})</CardTitle>
                    <CardDescription>
                      Recent applications for this position
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No applications yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {applications.slice(0, 5).map((application) => (
                          <div
                            key={application.id}
                            className="border rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">
                                {application.first_name} {application.last_name}
                              </h4>
                              <Badge
                                className={getApplicationStatusColor(
                                  application.status
                                )}
                                variant="secondary"
                              >
                                {application.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {application.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              Applied:{" "}
                              {new Date(
                                application.created_at
                              ).toLocaleDateString()}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 bg-transparent"
                              asChild
                            >
                              <Link
                                href={`/admin/applications/${application.id}`}
                              >
                                View Details
                              </Link>
                            </Button>
                          </div>
                        ))}
                        {applications.length > 5 && (
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            asChild
                          >
                            <Link href={`/admin?job=${job.id}`}>
                              View All Applications
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Applications
                        </span>
                        <span className="font-medium">
                          {applications.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Pending Review
                        </span>
                        <span className="font-medium">
                          {
                            applications.filter(
                              (app) => app.status === "pending"
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Under Review
                        </span>
                        <span className="font-medium">
                          {
                            applications.filter(
                              (app) => app.status === "reviewing"
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accepted</span>
                        <span className="font-medium">
                          {
                            applications.filter(
                              (app) => app.status === "accepted"
                            ).length
                          }
                        </span>
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
