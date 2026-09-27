"use client";

import { useActionState } from "react";
import { sendTestToChat } from "@/app/actions";

export function SendTestButton() {
  const [message, action, pending] = useActionState(sendTestToChat, null);

  return (
    <form action={action} className="mt-3">
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-full border border-card-border bg-card text-sm font-semibold transition-opacity disabled:opacity-50"
      >
        {pending ? "Отправляю…" : "Написать в чат"}
      </button>
      {message ? (
        <p className="mt-3 text-center text-sm text-muted">{message}</p>
      ) : null}
    </form>
  );
}
