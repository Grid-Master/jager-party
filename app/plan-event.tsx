"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { planEvent, type PlanEventState } from "@/app/actions";

const kinds = ["Прогулка", "Кино", "Поход", "Другое"] as const;

export function PlanEvent() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<PlanEventState | null, FormData>(
    planEvent,
    null,
  );
  const titleId = useId();

  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
      >
        Запланировать
      </button>
      {state?.ok ? (
        <p className="mt-3 text-center text-sm text-muted">{state.message}</p>
      ) : null}
      {open
        ? createPortal(
            <PlanEventDialog
              titleId={titleId}
              action={action}
              pending={pending}
              error={state && !state.ok ? state.message : null}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
    </>
  );
}

function PlanEventDialog({
  titleId,
  action,
  pending,
  error,
  onClose,
}: {
  titleId: string;
  action: (payload: FormData) => void;
  pending: boolean;
  error: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-dvh w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-background shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)] sm:max-h-[min(100dvh,42rem)] sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <h2 id={titleId} className="font-display text-2xl leading-none font-medium">
            Новое мероприятие
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-card-border text-lg leading-none text-muted"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form action={action} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5">
          <label className="block text-sm font-medium" htmlFor="event-title">
            Название
          </label>
          <input
            id="event-title"
            name="title"
            required
            autoFocus
            maxLength={120}
            placeholder="Вечерний сеанс"
            className="mt-2 h-11 w-full rounded-xl border border-card-border bg-card px-3 text-base outline-none focus:border-accent"
          />

          <fieldset className="mt-4">
            <legend className="text-sm font-medium">Тип</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {kinds.map((kind) => (
                <label
                  key={kind}
                  className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-card-border bg-card text-sm has-checked:border-accent has-checked:text-accent"
                >
                  <input
                    type="radio"
                    name="kind"
                    value={kind}
                    defaultChecked={kind === "Прогулка"}
                    className="sr-only"
                  />
                  {kind}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-medium" htmlFor="event-when">
            Когда
          </label>
          <input
            id="event-when"
            name="when"
            type="datetime-local"
            required
            className="mt-2 h-11 w-full rounded-xl border border-card-border bg-card px-3 text-base outline-none focus:border-accent"
          />

          <label className="mt-4 block text-sm font-medium" htmlFor="event-place">
            Где
          </label>
          <input
            id="event-place"
            name="place"
            maxLength={160}
            placeholder="Парк, кинотеатр, старт маршрута"
            className="mt-2 h-11 w-full rounded-xl border border-card-border bg-card px-3 text-base outline-none focus:border-accent"
          />

          <label className="mt-4 block text-sm font-medium" htmlFor="event-note">
            Комментарий
          </label>
          <textarea
            id="event-note"
            name="note"
            rows={3}
            maxLength={500}
            placeholder="Во сколько сбор и что взять с собой"
            className="mt-2 w-full resize-none rounded-xl border border-card-border bg-card px-3 py-2.5 text-base outline-none focus:border-accent"
          />

          {error ? (
            <p className="mt-3 text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}
          </div>

          <div className="shrink-0 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              type="submit"
              disabled={pending}
              className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background disabled:opacity-50"
            >
              {pending ? "Отправляю…" : "Запланировать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
