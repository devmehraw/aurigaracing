"use server"

import { createServerClient } from "@/lib/supabase/server"

const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
const OTP_LENGTH = 6

function generateOtp(): string {
  return Math.floor(Math.random() * 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0")
}

// Demo mode: no real SMS provider is connected yet, so the OTP is generated,
// stored server-side with an expiry, and also returned to the caller so the UI
// can display it directly (clearly labeled as a demo code). Swap this out for
// a real SMS provider (e.g. Twilio) by sending `code` instead of returning it.
export async function sendPhoneOtp(phone: string) {
  const cleanPhone = phone.trim()
  if (!cleanPhone) {
    return { error: "Phone number is required" }
  }

  const code = generateOtp()
  const supabase = await createServerClient()

  const { error } = await supabase.from("otp_codes").insert({
    phone: cleanPhone,
    code,
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    verified: false,
  })

  if (error) {
    console.error("[v0] Failed to store OTP:", error)
    return { error: "Failed to send verification code" }
  }

  return { success: true, demoCode: code, expiresInSeconds: OTP_TTL_MS / 1000 }
}

export async function verifyPhoneOtp(phone: string, code: string) {
  const cleanPhone = phone.trim()
  if (!cleanPhone || !code) {
    return { error: "Phone number and code are required" }
  }

  const supabase = await createServerClient()

  const { data: record } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("phone", cleanPhone)
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!record) {
    return { error: "Invalid verification code" }
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    return { error: "Verification code has expired. Please request a new one." }
  }

  await supabase.from("otp_codes").update({ verified: true }).eq("id", record.id)

  return { success: true }
}
