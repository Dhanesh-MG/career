import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Clock, DollarSign } from "lucide-react"

const jobOpenings = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description:
      "We're looking for a senior frontend developer to join our engineering team and help build the next generation of our web applications.",
    requirements: ["5+ years of React experience", "TypeScript proficiency", "Modern CSS frameworks"],
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    description:
      "Join our backend team to design and implement scalable APIs and microservices that power our platform.",
    requirements: ["Node.js/Python experience", "Database design", "Cloud platforms (AWS/GCP)"],
    posted: "1 week ago",
  },
  {
    id: "3",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    description:
      "We're seeking a talented product designer to create intuitive and beautiful user experiences for our products.",
    requirements: ["Figma expertise", "User research experience", "Design systems knowledge"],
    posted: "3 days ago",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    description: "Help us build and maintain our infrastructure, CI/CD pipelines, and deployment processes.",
    requirements: ["Kubernetes experience", "Docker proficiency", "Infrastructure as Code"],
    posted: "5 days ago",
  },
  {
    id: "5",
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    description:
      "Analyze complex datasets and build machine learning models to drive business insights and product improvements.",
    requirements: ["Python/R proficiency", "Machine learning experience", "Statistical analysis"],
    posted: "1 week ago",
  },
  {
    id: "6",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$80,000 - $110,000",
    description: "Lead our marketing initiatives and help grow our brand presence across digital channels.",
    requirements: ["Digital marketing experience", "Content strategy", "Analytics tools"],
    posted: "4 days ago",
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechCorp</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/#about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/#services" className="text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link href="/careers" className="text-blue-600 font-medium">
                Careers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of a company that's shaping the future of technology. We offer competitive benefits, flexible work
            arrangements, and opportunities for growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-blue-100">Team Members</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-blue-100">Open Positions</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-blue-100">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-gray-600">
              Discover exciting opportunities to grow your career with us. We're always looking for talented individuals
              to join our team.
            </p>
          </div>

          <div className="grid gap-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.description}</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href={`/careers/${job.id}`}>Apply Now</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
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
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">Posted {job.posted}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating an environment where our team members can thrive both professionally and
              personally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Competitive Compensation",
                description: "Market-leading salaries with equity options and performance bonuses",
              },
              {
                title: "Health & Wellness",
                description: "Comprehensive health insurance, dental, vision, and wellness programs",
              },
              {
                title: "Flexible Work",
                description: "Remote work options, flexible hours, and work-life balance",
              },
              {
                title: "Learning & Development",
                description: "Professional development budget, conferences, and training opportunities",
              },
              {
                title: "Great Culture",
                description: "Collaborative environment with team events and social activities",
              },
              {
                title: "Career Growth",
                description: "Clear career paths with mentorship and advancement opportunities",
              },
            ].map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
