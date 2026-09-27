import { NextRequest, NextResponse } from "next/server";
import { rememberUpdateMembers } from "@/lib/members";
import { isTestCommand, sendTelegramMessage, testMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    console.log("Telegram update:", JSON.stringify(update, null, 2));
    await rememberUpdateMembers(update);

    if (isTestCommand(update?.message?.text)) {
      await sendTelegramMessage(testMessage(), { mentions: false });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
