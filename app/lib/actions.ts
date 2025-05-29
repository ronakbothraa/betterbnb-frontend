"use server";

import { cookies } from "next/headers";

export async function handleLogin(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  cookieStore.set("session_userid", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });


  cookieStore.set("session_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, 
  });

  cookieStore.set("session_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, 
  });
}

export async function resetAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete("session_userid");
  cookieStore.delete("session_access_token");
  cookieStore.delete("session_refresh_token");
}

// get data
export async function getAuthCookies() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_userid")?.value || null;
  return userId ? userId : null; 
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("session_access_token")?.value || null;
  return accessToken ? accessToken : null; 
}
