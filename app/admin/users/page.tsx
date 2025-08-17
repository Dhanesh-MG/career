"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"
import { AdminHeader } from "@/components/admin-header"
import { Search, Plus, Edit, Trash2, Shield, Mail, Calendar } from "lucide-react"
import { getRoleDisplayName } from "@/lib/auth"

// Add imports
import { db } from "@/lib/supabase"

// Mock users data - in production, this would come from a database
// const mockUsers: User[] = [
//   {
//   id: "1",
//   email: "admin@techcorp.com",
//   name: "Admin User",
//   role: "admin",
//   permissions: ["view_applications", "manage_applications", "manage_jobs", "manage_users", "send_emails"],
//   createdAt: "2024-01-01T00:00:00Z",
//   lastLogin: "2024-01-20T10:30:00Z",
//   },
//   {
//   id: "2",
//   email: "hr@techcorp.com",
//   name: "HR Manager",
//   role: "hr",
//   permissions: ["view_applications", "manage_applications", "send_emails"],
//   createdAt: "2024-01-01T00:00:00Z",
//   lastLogin: "2024-01-19T14:20:00Z",
//   },
//   {
//   id: "3",
//   email: "manager@techcorp.com",
//   name: "Hiring Manager",
//   role: "manager",
//   permissions: ["view_applications"],
//   createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//   id: "4",
//   email: "sarah.wilson@techcorp.com",
//   name: "Sarah Wilson",
//   role: "hr",
//   permissions: ["view_applications", "manage_applications", "send_emails"],
//   createdAt: "2024-01-15T00:00:00Z",
//   lastLogin: "2024-01-18T09:15:00Z",
//   },
// ]

// Update the component to be async:
export default async function UsersPage() {
  const users = await db.getAllUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "hr":
        return "bg-blue-100 text-blue-800"
      case "manager":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadge = (lastLogin?: string) => {
    if (!lastLogin) {
      return <Badge variant="secondary">Never logged in</Badge>
    }

    const daysSinceLogin = Math.floor((Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceLogin === 0) {
      return <Badge className="bg-green-100 text-green-800">Active today</Badge>
    } else if (daysSinceLogin <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800">Active this week</Badge>
    } else {
      return <Badge variant="secondary">Inactive</Badge>
    }
  }

  return (
    <AuthGuard requiredPermissions={["manage_users"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage admin users and their permissions</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>Manage admin panel users and their access levels</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrator</option>
                  <option value="hr">HR Manager</option>
                  <option value="manager">Hiring Manager</option>
                </select>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                          <Shield className="h-3 w-3" />
                          {getRoleDisplayName(user.role)}
                        </Badge>
                        {getStatusBadge(user.lastLogin)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-sm">Permissions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" disabled={user.role === "admin"}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
