"use client";

import { useTelegramName } from "@/app/telegram-user";

export function Greeting() {
  const name = useTelegramName();

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
