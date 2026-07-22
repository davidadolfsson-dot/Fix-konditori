import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { useState, useRef, useEffect, type FormEvent } from "react";

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "Fix-Konditori";
  } catch {
    return "Fix-Konditori";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

/* ─── Chat Widget ─────────────────────────────────────────── */

type ChatMessage = {
  from: "user" | "cafe";
  text: string;
};

function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "cafe",
      text: "Hej! Vad kan jag hjälpa dig med idag? Du kan beställa takeaway eller boka bord här.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "cafe",
          text: "Tack för ditt meddelande! Vi återkommer så snart vi kan. Under tiden är du välkommen att ringa oss på 0121-123 45.",
        },
      ]);
    }, 800);
  }

  return (
    <section
      id="bestall"
      className="mx-auto max-w-2xl scroll-mt-6 rounded-2xl border border-toast bg-white p-5 shadow-md sm:p-8"
    >
      <h2 className="mb-1 text-2xl font-bold text-coffee sm:text-3xl">
        Beställ eller boka bord
      </h2>
      <p className="mb-5 text-sm text-coffee-light">
        Skriv vad du vill beställa eller hur många ni är så hjälper vi dig.
      </p>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto rounded-xl bg-cream p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.from === "user"
                  ? "bg-coffee text-white"
                  : "bg-toast text-coffee"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv ditt meddelande..."
          className="flex-1 rounded-xl border border-toast bg-cream px-4 py-3 text-sm text-coffee placeholder-coffee-light/50 outline-none focus:border-amber-warm focus:ring-2 focus:ring-amber-warm/30"
        />
        <button
          type="submit"
          className="rounded-xl bg-amber-warm px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-light active:scale-95"
        >
          Skicka
        </button>
      </form>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <div className="min-h-dvh bg-cream">
      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative flex min-h-[85dvh] items-center justify-center overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop&q=80)",
          }}
        />
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-coffee/70 via-coffee/50 to-coffee/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
            Fika, smörgås &amp; hembakat – mitt i Söderköping
          </h1>
          <p className="mb-8 text-lg text-white/80 sm:text-xl">
            Välkommen till {businessName} vid Fixpunkten
          </p>
          <a
            href="#bestall"
            className="inline-block rounded-full bg-amber-warm px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-amber-light active:scale-95"
          >
            Beställ nu
          </a>
        </div>
      </section>

      {/* ══════════ 2. MENU HIGHLIGHTS ══════════ */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-coffee sm:text-4xl">
          Våra favoriter
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Card: Räksmörgås */}
          <div className="overflow-hidden rounded-2xl border border-toast bg-white shadow-sm transition hover:shadow-md">
            <div className="h-48 bg-toast/50 sm:h-56">
              <img
                src="/raksmorgas.jpg"
                alt="Räksmörgås"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-coffee">Räksmörgås</h3>
              <p className="mt-1 text-sm leading-relaxed text-coffee-light">
                Klassisk handskalad räksmörgås på danskt rågbröd
              </p>
              <p className="mt-3 text-lg font-bold text-amber-warm">95 kr</p>
            </div>
          </div>

          {/* Card: Kaffe Latte */}
          <div className="overflow-hidden rounded-2xl border border-toast bg-white shadow-sm transition hover:shadow-md">
            <div className="h-48 bg-toast/50 sm:h-56">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=80"
                alt="Kaffe Latte"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-coffee">Kaffe Latte</h3>
              <p className="mt-1 text-sm leading-relaxed text-coffee-light">
                Dubbel espresso med krämig mjölk, serveras med vår nybakade
                kanelbulle
              </p>
              <p className="mt-3 text-lg font-bold text-amber-warm">58 kr</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm italic text-coffee-light">
          Se hela menyn i konditoriet
        </p>
      </section>

      {/* ══════════ 3. REVIEWS ══════════ */}
      <section className="bg-milk py-16 sm:py-20">
        <div className="mx-auto max-w-lg px-5 text-center">
          <div className="inline-flex items-center gap-1 text-4xl text-amber-warm">
            {"★".repeat(4)}
            <span className="text-coffee-light">★</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-coffee">
            4.5 — 213 recensioner
          </p>

          <div className="mt-8 space-y-5">
            <blockquote className="rounded-xl border border-toast bg-white p-5 text-left shadow-sm">
              <p className="text-sm leading-relaxed text-coffee-light">
                ”Mysigaste fiket i stan! Deras kanelbullar är helt magiska och
                personalen är alltid så trevlig. Hit går jag varje lördag.”
              </p>
              <footer className="mt-3 text-xs font-medium text-coffee">
                — Anna, Söderköping
              </footer>
            </blockquote>

            <blockquote className="rounded-xl border border-toast bg-white p-5 text-left shadow-sm">
              <p className="text-sm leading-relaxed text-coffee-light">
                ”Räksmörgåsen är den bästa jag ätit. Fräsch, rejäl och precis
                som den ska vara. Perfekt lunchställe!”
              </p>
              <footer className="mt-3 text-xs font-medium text-coffee">
                — Lars, Söderköping
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ══════════ 4. INFO ══════════ */}
      <section className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Address */}
          <div>
            <h3 className="mb-2 text-lg font-bold text-coffee">Hitta hit</h3>
            <address className="not-italic text-sm leading-relaxed text-coffee-light">
              Ringvägen 44
              <br />
              Fixpunkten Köpcentrum
              <br />
              614 30 Söderköping
            </address>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-2 text-lg font-bold text-coffee">Öppettider</h3>
            <table className="w-full text-sm text-coffee-light">
              <tbody>
                <tr>
                  <td className="pr-4 font-medium text-coffee">Mån–Fre</td>
                  <td>07:00–18:00</td>
                </tr>
                <tr>
                  <td className="pr-4 font-medium text-coffee">Lör</td>
                  <td>08:00–17:00</td>
                </tr>
                <tr>
                  <td className="pr-4 font-medium text-coffee">Sön</td>
                  <td>09:00–16:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Click-to-call */}
        <div className="mt-8 text-center">
          <a
            href="tel:+4612112345"
            className="inline-flex items-center gap-2 rounded-full border-2 border-coffee px-8 py-3 text-lg font-semibold text-coffee transition hover:bg-coffee hover:text-cream"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Ring oss
          </a>
          <p className="mt-2 text-sm text-coffee-light">0121-123 45</p>
        </div>
      </section>

      {/* ══════════ 5. AI CHAT ══════════ */}
      <section className="bg-cream-dark px-5 py-16 sm:py-20">
        <ChatWidget />
      </section>

      {/* ══════════ 6. FOOTER ══════════ */}
      <footer className="border-t border-toast bg-coffee px-5 py-8 text-center text-sm text-cream/70">
        <p>
          © 2026 {businessName}. Ringvägen 44, Fixpunkten Köpcentrum,
          Söderköping.
        </p>
      </footer>
    </div>
  );
}
