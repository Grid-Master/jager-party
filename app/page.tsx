import { PlanScreens } from "@/app/plan-event";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip overflow-y-auto pt-[max(2.5rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_58%),radial-gradient(ellipse_at_bottom,var(--glow-2),transparent_52%)]"
      />

      <section className="relative mx-auto my-auto w-full min-w-0 max-w-md sm:rounded-4xl sm:border sm:border-card-border sm:bg-card sm:px-8 sm:py-10 sm:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.45)] sm:backdrop-blur-xl">
        <PlanScreens>
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

        </PlanScreens>
      </section>
    </main>
  );
}
