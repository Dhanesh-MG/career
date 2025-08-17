"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { AdminHeader } from "@/components/admin-header"

// Add imports
import { db } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-supabase"

export default function NewJobPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    status: "draft" as "active" | "inactive" | "draft",
  })

  const [requirements, setRequirements] = useState<string[]>([""])
  const [responsibilities, setResponsibilities] = useState<string[]>([""])
  const [benefits, setBenefits] = useState<string[]>([""])
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    })
  }

  const addListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList([...list, ""])
  }

  const updateListItem = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const removeListItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index)
      setList(newList)
    }
  }

  // Update the handleSubmit function:
  const handleSubmit = async (e: React.FormEvent, status: "draft" | "active") => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const currentUser = await getCurrentUser()

      const filteredRequirements = requirements.filter((req) => req.trim() !== "")
      const filteredResponsibilities = responsibilities.filter((resp) => resp.trim() !== "")
      const filteredBenefits = benefits.filter((benefit) => benefit.trim() !== "")

      const newJob = await db.createJob({
        title: jobData.title,
        department: jobData.department,
        location: jobData.location,
        type: jobData.type as any,
        salary: jobData.salary || undefined,
        description: jobData.description,
        requirements: filteredRequirements,
        responsibilities: filteredResponsibilities,
        benefits: filteredBenefits,
        status,
        created_by: currentUser?.id,
      })

      if (newJob) {
        toast({
          title: status === "active" ? "Job Published" : "Job Saved as Draft",
          description: `${jobData.title} has been ${status === "active" ? "published" : "saved as draft"}`,
        })
        router.push("/admin")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthGuard requiredPermissions={["manage_jobs"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="container mx-auto px-4 py-4">
          <Link href="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Fill in the information for the new job posting</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={jobData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Senior Frontend Developer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        name="department"
                        value={jobData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Engineering"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={jobData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., San Francisco, CA"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Employment Type *</Label>
                      <select
                        id="type"
                        name="type"
                        value={jobData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        name="salary"
                        value={jobData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g., $120,000 - $160,000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the role, what the candidate will be doing, and what makes this opportunity exciting..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <Label>Requirements *</Label>
                    <div className="space-y-2 mt-2">
                      {requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={req}
                            onChange={(e) => updateListItem(index, e.target.value, requirements, setRequirements)}
                            placeholder="e.g., 5+ years of React experience"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem(index, requirements, setRequirements)}
                            disabled={requirements.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addListItem(requirements, setRequirements)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Requirement
                      </Button>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <Label>Responsibilities</Label>
                    <div className="space-y-2 mt-2">
                      {responsibilities.map((resp, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={resp}
                            onChange={(e) =>
                              updateListItem(index, e.target.value, responsibilities, setResponsibilities)
                            }
                            placeholder="e.g., Develop and maintain React applications"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem(index, responsibilities, setResponsibilities)}
                            disabled={responsibilities.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addListItem(responsibilities, setResponsibilities)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Responsibility
                      </Button>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <Label>Benefits</Label>
                    <div className="space-y-2 mt-2">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={benefit}
                            onChange={(e) => updateListItem(index, e.target.value, benefits, setBenefits)}
                            placeholder="e.g., Health insurance"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem(index, benefits, setBenefits)}
                            disabled={benefits.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addListItem(benefits, setBenefits)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Benefit
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "draft")}
                      disabled={isSaving}
                      variant="outline"
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save as Draft"}
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "active")}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isSaving ? "Publishing..." : "Publish Job"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
