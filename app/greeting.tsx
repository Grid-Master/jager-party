"use client";

import { useSyncExternalStore } from "react";

type TelegramUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
};

function telegramName() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) return "";

  const username = user.username?.replace(/^@/, "").trim();
  if (username) return `@${username}`;

  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
}

function subscribe() {
  return () => {};
}

export function Greeting() {
  const name = useSyncExternalStore(subscribe, telegramName, () => "");

  return (
    <h1 className="mt-6 max-w-full text-center font-display text-3xl leading-[1.05] font-medium tracking-tight break-words sm:text-5xl">
      Привет{name ? "," : ""}
      {name ? (
        <>
          <br />
          {name}
        </>
      ) : null}
    </h1>
  );
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
