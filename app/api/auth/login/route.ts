import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserLog } from "@/lib/models/UserLog";
import { EXTERNAL_API_BASE, EXTERNAL_PATHS } from "@/lib/external-api";
import { extractLoginToken } from "@/lib/extract-login-token";
import type { ExternalLoginBody, LoginRequestBody } from "@/types/shaarei";

export async function POST(req: NextRequest) {
  let body: LoginRequestBody;
  try {
    body = (await req.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 400 },
    );
  }

  const payload: ExternalLoginBody = {
    username,
    password,
    rememberMe: false,
    deviceType: "browser",
    deviceVersion: "1.4.1-0",
  };

  async function logAttempt(status: "success" | "failed") {
    try {
      await connectDB();
      await UserLog.create({
        username,
        timestamp: new Date(),
        status,
      });
    } catch {
      /* MongoDB unavailable — login flow still proceeds */
    }
  }

  try {
    const url = `${EXTERNAL_API_BASE}${EXTERNAL_PATHS.login}`;
    const { data, status } = await axios.post(url, payload, {
      validateStatus: () => true,
    });

    if (status >= 200 && status < 300) {
      const token = extractLoginToken(data);
      if (!token) {
        await logAttempt("failed");
        return NextResponse.json(
          { error: "Login succeeded but token was not found in response" },
          { status: 502 },
        );
      }
      await logAttempt("success");
      return NextResponse.json({ token });
    }

    await logAttempt("failed");
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  } catch (e) {
    await logAttempt("failed");
    const message = e instanceof Error ? e.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
