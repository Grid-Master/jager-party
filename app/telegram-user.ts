"use client";

import { useSyncExternalStore } from "react";

type TelegramUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
};

export function telegramName() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) return "";

  const username = user.username?.replace(/^@/, "").trim();
  if (username) return `@${username}`;

  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
}

function subscribe() {
  return () => {};
}

export function useTelegramName() {
  return useSyncExternalStore(subscribe, telegramName, () => "");
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: TelegramUser;
        };
      };
    };
  }
}
