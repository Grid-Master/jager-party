import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ChatMember = {
  id: number;
  name: string;
};

type MemberStore = Record<string, Record<string, ChatMember>>;

const filePath = path.join(process.cwd(), "data", "members.json");

let memory: MemberStore | null = null;

type TelegramUser = {
  id?: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
};

function displayName(user: TelegramUser) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return name || (user.username ? `@${user.username}` : "участник");
}

function asUser(value: unknown): TelegramUser | null {
  if (!value || typeof value !== "object") return null;
  const user = value as TelegramUser;
  if (typeof user.id !== "number" || user.is_bot) return null;
  return user;
}

async function loadStore() {
  if (memory) return memory;

  try {
    memory = JSON.parse(await readFile(filePath, "utf8")) as MemberStore;
  } catch {
    memory = {};
  }

  return memory;
}

async function saveStore(store: MemberStore) {
  memory = store;

  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error("Failed to save chat members:", error);
  }
}

function chatBucket(store: MemberStore, chatId: string) {
  store[chatId] ??= {};
  return store[chatId];
}

export async function rememberMember(chatId: string | number, user: unknown) {
  const member = asUser(user);
  if (!member?.id) return;

  const store = await loadStore();
  const bucket = chatBucket(store, String(chatId));
  bucket[String(member.id)] = { id: member.id, name: displayName(member) };
  await saveStore(store);
}

export async function forgetMember(chatId: string | number, user: unknown) {
  const member = asUser(user);
  if (!member?.id) return;

  const store = await loadStore();
  const bucket = store[String(chatId)];
  if (!bucket) return;

  delete bucket[String(member.id)];
  await saveStore(store);
}

export async function listRememberedMembers(chatId: string) {
  const store = await loadStore();
  return Object.values(store[chatId] ?? {});
}

function chatIdOf(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const chat = (value as { chat?: { id?: number | string } }).chat;
  if (!chat || (typeof chat.id !== "number" && typeof chat.id !== "string")) {
    return null;
  }
  return String(chat.id);
}

export async function rememberUpdateMembers(update: unknown) {
  if (!update || typeof update !== "object") return;

  const record = update as Record<string, unknown>;
  const message =
    (record.message as Record<string, unknown> | undefined) ??
    (record.edited_message as Record<string, unknown> | undefined);

  if (message) {
    const chatId = chatIdOf(message);

    if (chatId) {
      await rememberMember(chatId, message.from);

      if (Array.isArray(message.new_chat_members)) {
        for (const user of message.new_chat_members) {
          await rememberMember(chatId, user);
        }
      }

      if (message.left_chat_member) {
        await forgetMember(chatId, message.left_chat_member);
      }
    }
  }

  const membership =
    (record.chat_member as Record<string, unknown> | undefined) ??
    (record.my_chat_member as Record<string, unknown> | undefined);

  if (!membership) return;

  const chatId = chatIdOf(membership);
  const next = membership.new_chat_member as
    | { status?: string; user?: unknown }
    | undefined;
  if (!chatId || !next?.user) return;

  if (next.status === "left" || next.status === "kicked") {
    await forgetMember(chatId, next.user);
    return;
  }

  await rememberMember(chatId, next.user);
}
