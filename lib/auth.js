"use server";

import { cookies } from "next/headers";

// Mock user database - in production, this would be in a real database
const mockUsers = [
  {
    id: "1",
    email: "admin@techcorp.com",
    name: "Admin User",
    role: "admin",
    permissions: [
      "view_applications",
      "manage_applications",
      "manage_jobs",
      "manage_users",
      "send_emails",
    ],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    email: "hr@techcorp.com",
    name: "HR Manager",
    role: "hr",
    permissions: ["view_applications", "manage_applications", "send_emails"],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-19T14:20:00Z",
  },
  {
    id: "3",
    email: "manager@techcorp.com",
    name: "Hiring Manager",
    role: "manager",
    permissions: ["view_applications"],
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export async function login() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simple password check - in production, use proper password hashing
  const validCredentials = [
    { email: "admin@techcorp.com", password: "admin123" },
    { email: "hr@techcorp.com", password: "hr123" },
    { email: "manager@techcorp.com", password: "manager123" },
  ];

  const credential = validCredentials.find(
    (cred) => cred.email === email && cred.password === password
  );

  if (!credential) {
    return { success: false, error: "Invalid email or password" };
  }

  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(
    "session",
    JSON.stringify({ userId: user.id, email: user.email }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );

  return { success: true, user };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    const user = mockUsers.find((u) => u.email === session.email);

    return user || null;
  } catch (error) {
    return null;
  }
}

export async function hasPermission(permission) {
  const user = await getCurrentUser();
  return user?.permissions.includes(permission) || false;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requirePermission(permission) {
  const user = await requireAuth();
  if (!user.permissions.includes(permission)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}
