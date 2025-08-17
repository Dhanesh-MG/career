import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database functions
export const db = {
  // Users
  async getUser(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;
    return data;
  },

  async createUser(user) {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data;
  },

  // Jobs
  async getJobs(status) {
    let query = supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    console.log("Status:", status);
    console.log("Data:", data);
    console.log("Error:", error);

    if (error) return [];
    return data;
  },

  async getJob(id) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },

  async createJob(job) {
    const { data, error } = await supabase
      .from("jobs")
      .insert(job)
      .select()
      .single();
    console.log(data, error);

    if (error) return null;
    return data;
  },

  async updateJob(id, updates) {
    const { data, error } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  async deleteJob(id) {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    return !error;
  },

  // Job Applications
  async getApplications(filters = {}) {
    let query = supabase
      .from("job_applications")
      .select(
        `
        *,
        job:jobs(title, department)
      `
      )
      .order("created_at", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.job_id) {
      query = query.eq("job_id", filters.job_id);
    }

    const { data, error } = await query;
    if (error) return [];
    return data;
  },

  async getApplication(id) {
    const { data, error } = await supabase
      .from("job_applications")
      .select(
        `
        *,
        job:jobs(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },

  async createApplication(application) {
    const { data, error } = await supabase
      .from("job_applications")
      .insert(application)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  async updateApplication(id, updates) {
    const { data, error } = await supabase
      .from("job_applications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Email Logs
  async createEmailLog(log) {
    const { data, error } = await supabase
      .from("email_logs")
      .insert(log)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  async getEmailLogs(applicationId) {
    let query = supabase
      .from("email_logs")
      .select("*")
      .order("sent_at", { ascending: false });

    if (applicationId) {
      query = query.eq("application_id", applicationId);
    }

    const { data, error } = await query;
    if (error) return [];
    return data;
  },

  // Statistics
  async getStats() {
    const [
      { count: totalApplications },
      { count: pendingApplications },
      { count: activeJobs },
      { count: totalUsers },
    ] = await Promise.all([
      supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    return {
      totalApplications: totalApplications || 0,
      pendingApplications: pendingApplications || 0,
      activeJobs: activeJobs || 0,
      totalUsers: totalUsers || 0,
    };
  },
};
