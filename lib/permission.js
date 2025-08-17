// NOTE: This file does NOT have "use server" at the top.

export const rolePermissions = {
  admin: [
    "view_applications",
    "manage_applications",
    "manage_jobs",
    "manage_users",
    "send_emails",
  ],
  hr: ["view_applications", "manage_applications", "send_emails"],
  manager: ["view_applications"],
};

export function getRoleDisplayName(role) {
  switch (role) {
    case "admin":
      return "Administrator";
    case "hr":
      return "HR Manager";
    case "manager":
      return "Hiring Manager";
    default:
      return "User";
  }
}
