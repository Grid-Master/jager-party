import { NextRequest, NextResponse } from "next/server";
import { markNoonSent, noonFact, wasNoonSent } from "@/lib/facts";
import {
  chisinauDay,
  chisinauHour,
  markMorningSent,
  morningCaption,
  wasMorningSent,
} from "@/lib/morning";
import { sendMorningGreeting, sendTelegramMessage } from "@/lib/telegram";

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
  const hour = chisinauHour(now);

  try {
    if (hour === 8) {
      if (await wasMorningSent(day)) {
        return NextResponse.json({ ok: true, skipped: true });
      }

      await sendMorningGreeting(morningCaption(now));
      await markMorningSent(day);
      return NextResponse.json({ ok: true, sent: "morning" });
    }

    if (hour === 13) {
      if (await wasNoonSent(day)) {
        return NextResponse.json({ ok: true, skipped: true });
      }

      await sendTelegramMessage(noonFact(now), {
        html: true,
        mentions: false,
      });
      await markNoonSent(day);
      return NextResponse.json({ ok: true, sent: "noon" });
    }

    return NextResponse.json({ ok: true, skipped: true });
  } catch (error) {
    console.error("Daily cron error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
