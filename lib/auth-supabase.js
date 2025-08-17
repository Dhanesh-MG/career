"use server";

import { cookies } from "next/headers";
import { supabase, db } from "./supabase";

export async function signUp(email, password, name, role = "manager") {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Failed to create account",
    };
  }

  // Create user profile
  const permissions = getPermissionsForRole(role);
  const user = await db.createUser({
    id: authData.user.id,
    email,
    name,
    role,
    permissions,
  });

  if (!user) {
    return { success: false, error: "Failed to create user profile" };
  }

  return { success: true, user };
}

export async function signIn(email, password) {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Invalid credentials",
    };
  }

  // Get user profile
  const user = await db.getUser(authData.user.id);
  if (!user) {
    return { success: false, error: "User profile not found" };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(
    "session",
    JSON.stringify({
      userId: user.id,
      email: user.email,
      accessToken: authData.session.access_token,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );

  return { success: true, user };
}

export async function signOut() {
  await supabase.auth.signOut();
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

    // Verify the session with Supabase
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser(session.accessToken);

    if (error || !authUser) {
      return null;
    }

    // Get user profile
    const user = await db.getUser(authUser.id);
    return user;
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

async function getPermissionsForRole(role) {
  switch (role) {
    case "admin":
      return [
        "view_applications",
        "manage_applications",
        "manage_jobs",
        "manage_users",
        "send_emails",
      ];
    case "hr":
      return ["view_applications", "manage_applications", "send_emails"];
    case "manager":
      return ["view_applications"];
    default:
      return [];
  }
}

// Legacy exports for compatibility
export const login = signIn;
export const logout = signOut;
