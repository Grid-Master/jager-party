import { NextRequest, NextResponse } from "next/server";
import {
  chisinauDay,
  chisinauHour,
  markMorningSent,
  morningCaption,
  wasMorningSent,
} from "@/lib/morning";
import { sendMorningGreeting } from "@/lib/telegram";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (process.env.NODE_ENV === "production" && !secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const now = new Date();
  const day = chisinauDay(now);

  if (chisinauHour(now) !== 8) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (await wasMorningSent(day)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await sendMorningGreeting(morningCaption(now));
    await markMorningSent(day);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Morning greeting error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
