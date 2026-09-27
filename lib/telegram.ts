import { groupMentions } from "@/lib/participants";

const TEST_TEXT = "скоро узнаешь";
const MENTION_LIMIT = 30;
const STICKER_SETS = ["UtyaDuck", "HotCherry"];

export function testMessage() {
  return TEST_TEXT;
}

type Sticker = {
  file_id: string;
  emoji?: string;
};

const eventStyles = {
  Прогулка: { emoji: "🚶", lead: "Выходим гулять", sticker: "👋" },
  Кино: { emoji: "🎬", lead: "Сеанс объявлен", sticker: "😎" },
  Поход: { emoji: "⛰", lead: "Собираем рюкзаки", sticker: "🔥" },
  Другое: { emoji: "✨", lead: "Намечается движ", sticker: "🎉" },
} as const;

let stickerPack: Sticker[] | null | undefined;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function telegramApi<T>(
  token: string,
  method: string,
  body: Record<string, unknown>,
) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as {
    ok: boolean;
    result?: T;
    description?: string;
  };

  if (!response.ok || !data.ok) {
    throw new Error(data.description ?? "Telegram не принял запрос");
  }

  return data.result as T;
}

async function loadStickers(token: string) {
  if (stickerPack !== undefined) return stickerPack;

  for (const name of STICKER_SETS) {
    try {
      const result = await telegramApi<{ stickers: Sticker[] }>(
        token,
        "getStickerSet",
        { name },
      );
      if (result.stickers.length > 0) {
        stickerPack = result.stickers;
        return stickerPack;
      }
    } catch (error) {
      console.error(`Sticker set ${name}:`, error);
    }
  }

  stickerPack = null;
  return stickerPack;
}

async function sendMoodSticker(token: string, chatId: string, emoji: string) {
  const pack = await loadStickers(token);
  if (!pack?.length) return;

  const matched = pack.filter((sticker) => sticker.emoji?.includes(emoji));
  const index = (emoji.codePointAt(0) ?? 0) % pack.length;
  const sticker = matched[0] ?? pack[index];

  try {
    await telegramApi(token, "sendSticker", {
      chat_id: chatId,
      sticker: sticker.file_id,
    });
  } catch (error) {
    console.error("Failed to send sticker:", error);
  }
}

async function postMessage(token: string, chatId: string, text: string) {
  await telegramApi(token, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
  });
}

export async function sendTelegramMessage(
  text: string,
  options?: { html?: boolean; stickerEmoji?: string; mentions?: boolean },
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
  }

  if (options?.stickerEmoji) {
    await sendMoodSticker(token, chatId, options.stickerEmoji);
  }

  const mentions = options?.mentions === false ? [] : groupMentions();
  const body = options?.html ? text : escapeHtml(text);
  const firstBatch = mentions.slice(0, MENTION_LIMIT);
  const message = [body, firstBatch.join(" ")].filter(Boolean).join("\n\n");

  await postMessage(token, chatId, message);

  for (let index = MENTION_LIMIT; index < mentions.length; index += MENTION_LIMIT) {
    await postMessage(
      token,
      chatId,
      mentions.slice(index, index + MENTION_LIMIT).join(" "),
    );
  }
}

export async function sendEventAnnouncement(event: {
  kind: keyof typeof eventStyles;
  title: string;
  whenLabel: string;
  place: string;
  note: string;
  mentions: boolean;
}) {
  const style = eventStyles[event.kind];
  const lines = [
    `${style.emoji} <b>${escapeHtml(style.lead)}</b>`,
    "",
    `<b>${escapeHtml(event.title)}</b>`,
    `<i>${escapeHtml(event.kind)}</i>`,
    "",
    `📅 <u>${escapeHtml(event.whenLabel)}</u>`,
  ];

  if (event.place) lines.push(`📍 ${escapeHtml(event.place)}`);
  if (event.note) {
    lines.push("", `<blockquote>${escapeHtml(event.note)}</blockquote>`);
  }

  if (event.mentions && groupMentions().length > 0) {
    lines.push("", "👇 <b>Зовём всех</b>");
  }

  await sendTelegramMessage(lines.join("\n"), {
    html: true,
    stickerEmoji: style.sticker,
    mentions: event.mentions,
  });
}

export function isTestCommand(text: unknown) {
  if (typeof text !== "string") return false;

  const [command] = text.trim().split(/\s+/);
  return command?.split("@")[0] === "/test";
}
