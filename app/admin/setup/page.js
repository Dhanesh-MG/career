"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, User, Shield, CheckCircle } from "lucide-react"
import { signUp } from "@/lib/auth-supabase"
import { useToast } from "@/hooks/use-toast"

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [createdUsers, setCreatedUsers] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@techcorp.com",
    password: "admin123",
  })

  const [hrData, setHrData] = useState({
    name: "HR Manager",
    email: "hr@techcorp.com",
    password: "hr123",
  })

  const [managerData, setManagerData] = useState({
    name: "Hiring Manager",
    email: "manager@techcorp.com",
    password: "manager123",
  })

  const handleCreateUser = async (userData, role) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signUp(userData.email, userData.password, userData.name, role)

      if (result.success) {
        setCreatedUsers((prev) => [...prev, `${userData.name} (${role})`])
        toast({
          title: "User Created",
          description: `${userData.name} has been created successfully`,
        })
        return true
      } else {
        setError(result.error || "Failed to create user")
        return false
      }
    } catch (error) {
      setError("An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAllUsers = async () => {
    const users = [
      { data: adminData, role: "admin" },
      { data: hrData, role: "hr" },
      { data: managerData, role: "manager" },
    ]

    for (const { data, role } of users) {
      const success = await handleCreateUser(data, role)
      if (!success) break
    }

    if (createdUsers.length === 3) {
      setStep(2)
    }
  }

  const handleInputChange = (e, setter) => {
    setter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>Your admin users have been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Created Users:</h3>
              <ul className="space-y-1 text-sm">
                {createdUsers.map((user, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {user}
                  </li>
                ))}
              </ul>
            </div>

            <Alert>
              <AlertDescription>
                You can now log in to the admin panel using any of the created accounts. The database has also been
                seeded with sample job postings.
              </AlertDescription>
            </Alert>

            <Button onClick={() => router.push("/admin/login")} className="w-full">
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TechCorp Setup</h1>
          <p className="text-gray-600">Create your admin users to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Create Admin Users
            </CardTitle>
            <CardDescription>
              Set up the initial admin users for your career portal. You can modify these details before creating the
              accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Administrator */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Administrator</h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Full Access</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="admin-name">Name</Label>
                  <Input
                    id="admin-name"
                    name="name"
                    value={adminData.name}
                    onChange={(e) => handleInputChange(e, setAdminData)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    value={adminData.email}
                    onChange={(e) => handleInputChange(e, setAdminData)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    value={adminData.password}
                    onChange={(e) => handleInputChange(e, setAdminData)}
                  />
                </div>
              </div>
            </div>

            {/* HR Manager */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">HR Manager</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Application Management</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hr-name">Name</Label>
                  <Input
                    id="hr-name"
                    name="name"
                    value={hrData.name}
                    onChange={(e) => handleInputChange(e, setHrData)}
                  />
                </div>
                <div>
                  <Label htmlFor="hr-email">Email</Label>
                  <Input
                    id="hr-email"
                    name="email"
                    type="email"
                    value={hrData.email}
                    onChange={(e) => handleInputChange(e, setHrData)}
                  />
                </div>
                <div>
                  <Label htmlFor="hr-password">Password</Label>
                  <Input
                    id="hr-password"
                    name="password"
                    type="password"
                    value={hrData.password}
                    onChange={(e) => handleInputChange(e, setHrData)}
                  />
                </div>
              </div>
            </div>

            {/* Hiring Manager */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Hiring Manager</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">View Only</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="manager-name">Name</Label>
                  <Input
                    id="manager-name"
                    name="name"
                    value={managerData.name}
                    onChange={(e) => handleInputChange(e, setManagerData)}
                  />
                </div>
                <div>
                  <Label htmlFor="manager-email">Email</Label>
                  <Input
                    id="manager-email"
                    name="email"
                    type="email"
                    value={managerData.email}
                    onChange={(e) => handleInputChange(e, setManagerData)}
                  />
                </div>
                <div>
                  <Label htmlFor="manager-password">Password</Label>
                  <Input
                    id="manager-password"
                    name="password"
                    type="password"
                    value={managerData.password}
                    onChange={(e) => handleInputChange(e, setManagerData)}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleCreateAllUsers} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Creating Users..." : "Create All Users"}
            </Button>

            {createdUsers.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Created Users:</h4>
                <ul className="space-y-1 text-sm">
                  {createdUsers.map((user, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {user}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
