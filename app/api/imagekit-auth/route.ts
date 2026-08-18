import { NextResponse } from "next/server"
import crypto from "crypto"

// ImageKit Private Key - should be set as environment variable IMAGEKIT_PRIVATE_KEY
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "private_4FsQZjjuYP+kssHxDqrMbbU5iPs="

export async function GET() {
  try {
    console.log("[v0] Generating ImageKit auth parameters...")

    const token = crypto.randomBytes(16).toString("hex")
    const expire = Math.floor(Date.now() / 1000) + 600 // 10 minutes from now
    const signature = crypto
      .createHmac("sha1", IMAGEKIT_PRIVATE_KEY)
      .update(token + expire)
      .digest("hex")

    console.log("[v0] Auth parameters generated successfully")

    return NextResponse.json({
      token,
      expire,
      signature,
    })
  } catch (error) {
    console.error("[v0] ImageKit auth error:", error)
    return NextResponse.json({ error: "Failed to generate authentication" }, { status: 500 })
  }
}
