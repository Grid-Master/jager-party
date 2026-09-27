"use client";

import { useActionState, useState, type ReactNode } from "react";
import { planEvent, type PlanEventState } from "@/app/actions";
import { SendTestButton } from "@/app/send-test-button";

const kinds = ["Прогулка", "Кино", "Поход", "Другое"] as const;

export function PlanScreens({ children }: { children: ReactNode }) {
  const [planning, setPlanning] = useState(false);
  const [state, action, pending] = useActionState<PlanEventState | null, FormData>(
    async (prev, formData) => {
      const result = await planEvent(prev, formData);
      if (result.ok) setPlanning(false);
      return result;
    },
    null,
  );

  if (planning) {
    return (
      <PlanForm
        action={action}
        pending={pending}
        error={state && !state.ok ? state.message : null}
        onBack={() => setPlanning(false)}
      />
    );
  }

  return (
    <>
      {children}
      <button
        type="button"
        onClick={() => setPlanning(true)}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
      >
        Запланировать мероприятие
      </button>
      {state?.ok ? (
        <p className="mt-3 text-center text-sm text-muted">{state.message}</p>
      ) : null}
      <SendTestButton />
    </>
  );
}

function PlanForm({
  action,
  pending,
  error,
  onBack,
}: {
  action: (payload: FormData) => void;
  pending: boolean;
  error: string | null;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-muted"
      >
        ← Назад
      </button>
      <h2 className="mt-4 max-w-full font-display text-[1.7rem] leading-[0.95] font-medium">
        Новое
        <br />
        мероприятие
      </h2>

      <form action={action} className="mt-6">
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

        <label className="mt-4 flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            name="mentionAll"
            value="1"
            className="size-5 shrink-0 accent-accent"
          />
          Отметить всех
        </label>

        {error ? (
          <p className="mt-3 text-sm text-accent" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background disabled:opacity-50"
        >
          {pending ? "Отправляю…" : "Запланировать"}
        </button>
      </form>
    </div>
  );
}
