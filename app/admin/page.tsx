// app/admin/page.tsx
import { AdminDashboardClient } from "@/components/admin/adminDash";
import { db } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  const [applicationsData, jobsData, stats] = await Promise.all([
    db.getApplications(),
    db.getJobs(),
    db.getStats(),
  ]);
  console.log(applicationsData, "applicationsData");

  return (
    <AdminDashboardClient
      applicationsData={applicationsData}
      jobsData={jobsData}
      stats={stats}
    />
  );
}
