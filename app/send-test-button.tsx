"use client";

import { useActionState } from "react";
import { sendChatMessage } from "@/app/actions";

export function SendTestButton() {
  const [message, action, pending] = useActionState(sendChatMessage, null);

  return (
    <form action={action} className="mt-3">
      <label className="block text-sm font-medium" htmlFor="chat-message">
        Сообщение в чат
      </label>
      <textarea
        id="chat-message"
        name="text"
        required
        rows={3}
        maxLength={1000}
        placeholder="Напиши текст"
        className="mt-2 w-full resize-none rounded-xl border border-card-border bg-card px-3 py-2.5 text-base outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-card-border bg-card text-sm font-semibold transition-opacity disabled:opacity-50"
      >
        {pending ? "Отправляю…" : "Отправить"}
      </button>
      {message ? (
        <p className="mt-3 text-center text-sm text-muted">{message}</p>
      ) : null}
    </form>
  );
}
