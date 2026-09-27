import { PlanEvent } from "@/app/plan-event";
import { SendTestButton } from "@/app/send-test-button";

const plans = [
  {
    title: "Прогулки",
    text: "Город и парки",
    icon: (
      <>
        <circle cx="6.5" cy="6.5" r="1.7" />
        <circle cx="17.5" cy="17.5" r="1.7" />
        <path
          d="M8.2 7.4c2.4.2 3.4 2.6 4.8 5s2.6 4.2 4.6 4.2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    title: "Кино",
    text: "Сеансы вместе",
    icon: (
      <>
        <path d="M4 8.2 7.4 5h3.6L7.6 8.2" strokeLinejoin="round" />
        <path d="M9.4 8.2 12.8 5H17l-3.4 3.2" strokeLinejoin="round" />
        <path d="M4 8.2h16V19H4V8.2Z" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Походы",
    text: "Выходные на природе",
    icon: (
      <path
        d="M3 18.5 9.2 7.2a.8.8 0 0 1 1.4 0L14 13.2l1.7-2.6a.8.8 0 0 1 1.35 0L21 18.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Ещё",
    text: "Всё, что придумаем",
    icon: (
      <path
        d="M12 3.5 13.4 8l4.6.4-3.5 3 1.1 4.6L12 13.6 8.4 16l1.1-4.6-3.5-3L10.6 8 12 3.5Z"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip overflow-y-auto pt-[max(2.5rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_58%),radial-gradient(ellipse_at_bottom,var(--glow-2),transparent_52%)]"
      />

      <section className="relative mx-auto my-auto w-full min-w-0 max-w-md sm:rounded-4xl sm:border sm:border-card-border sm:bg-card sm:px-8 sm:py-10 sm:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.45)] sm:backdrop-blur-xl">
        <p className="text-center text-[0.7rem] font-semibold tracking-[0.32em] text-muted uppercase">
          Jager Party
        </p>

        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-3 py-1 text-xs font-medium text-foreground">
            <span className="status-dot size-1.5 rounded-full bg-accent" />
            Скоро
          </span>
        </div>

        <h1 className="mt-5 max-w-full text-center font-display text-3xl leading-[0.95] font-medium tracking-tight sm:text-5xl">
          В
          <br />
          разработке
        </h1>

        <p className="mx-auto mt-4 max-w-[18rem] text-center text-base leading-7 text-muted sm:max-w-xs sm:text-lg sm:leading-8">
          Здесь будут наши прогулки, кино, походы и другие мероприятия.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-3">
          {plans.map((plan) => (
            <li
              key={plan.title}
              className="min-w-0 rounded-2xl border border-card-border bg-card px-3.5 py-3.5 sm:px-4 sm:py-4"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-5 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                {plan.icon}
              </svg>
              <p className="mt-3 text-sm font-semibold tracking-tight">
                {plan.title}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted">{plan.text}</p>
            </li>
          ))}
        </ul>

        <PlanEvent />
        <SendTestButton />
      </section>
    </main>
  );
}
