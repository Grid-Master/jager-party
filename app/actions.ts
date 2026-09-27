"use server";

import { sendEventAnnouncement, sendTelegramMessage } from "@/lib/telegram";

export async function sendChatMessage(
  _prev: string | null,
  formData: FormData,
) {
  const text = String(formData.get("text") ?? "").trim();

  if (!text) return "Напиши сообщение";
  if (text.length > 1000) return "Слишком длинное сообщение";

  try {
    await sendTelegramMessage(text, { mentions: false });
    return "Отправлено в чат";
  } catch (error) {
    console.error("Telegram send error:", error);
    return error instanceof Error ? error.message : "Не удалось отправить";
  }
}

const eventKinds = ["Прогулка", "Кино", "Поход", "Другое"] as const;

export type PlanEventState = {
  ok: boolean;
  message: string;
};

export async function planEvent(
  _prev: PlanEventState | null,
  formData: FormData,
): Promise<PlanEventState> {
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "").trim();
  const when = String(formData.get("when") ?? "").trim();
  const place = String(formData.get("place") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const mentions = formData.get("mentionAll") === "1";

  if (!eventKinds.includes(kind as (typeof eventKinds)[number])) {
    return { ok: false, message: "Выбери тип мероприятия" };
  }

  if (!title || !when) {
    return { ok: false, message: "Укажи название и время" };
  }

  const whenDate = new Date(when);
  const whenLabel = Number.isNaN(whenDate.getTime())
    ? when
    : new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(whenDate);

  try {
    await sendEventAnnouncement({
      kind: kind as (typeof eventKinds)[number],
      title,
      whenLabel,
      place,
      note,
      mentions,
    });
    return { ok: true, message: "Мероприятие отправлено в чат" };
  } catch (error) {
    console.error("Telegram plan error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Не удалось отправить",
    };
  }
}
