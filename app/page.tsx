"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QUIZ_STEPS, TOTAL_QUESTIONS } from "@/lib/quiz-data";
import type { QuizStep } from "@/lib/quiz-data";

type Answers = Record<number | string, string[]>;

function getProgress(step: QuizStep): number {
  if (step.type === "intro") return 0;
  if (step.type === "offer") return 100;
  if (step.type === "email" || step.type === "loading") return 98;
  if (step.type === "question") return Math.round((step.number / TOTAL_QUESTIONS) * 95);
  return 0;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="Learnive" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
      <span className="font-bold text-lg" style={{ color: "#7C3AED" }}>Learnive</span>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: QuizStep }) {
  const pct = getProgress(step);
  if (step.type === "intro" || step.type === "offer") return null;
  const questionStep = step.type === "question" ? step.number : null;
  return (
    <div className="w-full px-4 py-3">
      {questionStep && (
        <div className="text-right text-xs font-semibold mb-1" style={{ color: "#7C3AED" }}>
          {questionStep} / {TOTAL_QUESTIONS}
        </div>
      )}
      <div className="w-full h-2 rounded-full" style={{ background: "#E5E7EB" }}>
        <div className="h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7C3AED, #5B21B6)" }} />
      </div>
    </div>
  );
}

// ─── Intro ────────────────────────────────────────────────────────────────────
function IntroScreen({ onAnswer }: { onAnswer: (id: string) => void }) {
  return (
    <div className="step-enter flex flex-col items-center text-center px-4 py-8 gap-8">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          style={{ background: "#EDE9FE", color: "#7C3AED" }}>
          🚀 AI CHALLENGE · 28 DAYS
        </div>
        <h1 className="text-3xl font-black leading-tight mb-3" style={{ color: "#111827" }}>
          How prepared are you<br />for the AI era?
        </h1>
        <p className="text-base" style={{ color: "#6B7280" }}>
          In 2 minutes you'll discover your real level<br />and receive your personalized 28-day plan
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button className="option-card flex-col items-start gap-2 p-5" onClick={() => onAnswer("empresa")}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <div>
              <div className="font-bold text-base" style={{ color: "#111827" }}>I work for a company</div>
              <div className="text-sm" style={{ color: "#6B7280" }}>I want to grow professionally with AI</div>
            </div>
          </div>
        </button>
        <button className="option-card flex-col items-start gap-2 p-5" onClick={() => onAnswer("cuenta-propia")}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <div className="font-bold text-base" style={{ color: "#111827" }}>I work for myself</div>
              <div className="text-sm" style={{ color: "#6B7280" }}>I want to scale my business with AI</div>
            </div>
          </div>
        </button>
      </div>
      <p className="text-xs" style={{ color: "#9CA3AF" }}>
        By continuing you accept our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>
      </p>
    </div>
  );
}

// ─── Interstitial ─────────────────────────────────────────────────────────────
function InterstitialScreen({ step, onNext }: { step: Extract<QuizStep, { type: "interstitial" }>; onNext: () => void }) {
  return (
    <div className="step-enter flex flex-col items-center text-center px-6 py-10 gap-6">
      <div className="text-6xl">{step.emoji}</div>
      {step.stat && <div className="text-4xl font-black" style={{ color: "#7C3AED" }}>{step.stat}</div>}
      <h2 className="text-2xl font-black leading-snug" style={{ color: "#111827" }}>{step.title}</h2>
      <p className="text-base leading-relaxed max-w-sm whitespace-pre-line" style={{ color: "#4B5563" }}>{step.body}</p>
      <div className="w-full max-w-sm">
        <button className="btn-primary" onClick={onNext}>CONTINUE →</button>
      </div>
    </div>
  );
}

// ─── Question ─────────────────────────────────────────────────────────────────
function QuestionScreen({ step, selected, onSelect, onNext }: {
  step: Extract<QuizStep, { type: "question" }>;
  selected: string[];
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="step-enter flex flex-col px-4 py-6 gap-5">
      <div>
        <h2 className="text-xl font-black leading-snug mb-2" style={{ color: "#111827" }}>{step.question}</h2>
        {step.subtitle && <p className="text-sm" style={{ color: "#6B7280" }}>{step.subtitle}</p>}
      </div>
      <div className="flex flex-col gap-3">
        {step.options.map(opt => {
          const isSelected = selected.includes(opt.id);
          return (
            <button key={opt.id} className={`option-card ${isSelected ? "selected" : ""}`} onClick={() => onSelect(opt.id)}>
              {opt.emoji && <span className="text-2xl flex-shrink-0">{opt.emoji}</span>}
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-sm" style={{ color: "#111827" }}>{opt.label}</span>
                {opt.sublabel && <span className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{opt.sublabel}</span>}
              </div>
              {isSelected && <span className="flex-shrink-0 text-lg font-black" style={{ color: "#7C3AED" }}>✓</span>}
            </button>
          );
        })}
      </div>
      {step.multiple && (
        <button className="btn-primary" disabled={selected.length === 0} onClick={onNext}>
          {step.nextText || "NEXT"} →
        </button>
      )}
    </div>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    "Analyzing your profile...",
    "Calibrating your AI level...",
    "Identifying your strengths...",
    "Designing your 28-day plan...",
    "Preparing your exclusive offer...",
    "Your plan is ready! 🎉",
  ];

  useEffect(() => {
    const msgTimer = setInterval(() => setMsgIdx(i => Math.min(i + 1, messages.length - 1)), 900);
    const pctTimer = setInterval(() => {
      setPct(p => {
        if (p >= 100) { clearInterval(pctTimer); clearInterval(msgTimer); setTimeout(onDone, 500); return 100; }
        return Math.min(p + Math.random() * 4 + 1.5, 100);
      });
    }, 160);
    return () => { clearInterval(msgTimer); clearInterval(pctTimer); };
  }, []);

  const reviews = [
    { name: "Maria G.", text: "In 28 days I learned more than in years. Incredible." },
    { name: "Carlos R.", text: "My productivity doubled. 100% recommended." },
    { name: "Ana P.", text: "Learnive's method is unique. Real results." },
  ];

  return (
    <div className="step-enter flex flex-col items-center px-6 py-8 gap-8">
      <div className="text-center">
        <div className="text-5xl mb-4">🧠</div>
        <h2 className="text-xl font-black mb-2" style={{ color: "#111827" }}>Building Your Personal AI Plan</h2>
        <p className="text-sm" style={{ color: "#6B7280" }}>{messages[msgIdx]}</p>
      </div>
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs font-bold mb-2" style={{ color: "#7C3AED" }}>
          <span>Processing</span><span>{Math.round(pct)}%</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: "#E5E7EB" }}>
          <div className="h-3 rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7C3AED, #5B21B6)" }} />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <p className="text-xs font-bold text-center uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
          What our users say
        </p>
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: "#F9F5FF", border: "1px solid #EDE9FE" }}>
            <div className="flex gap-0.5 mb-1">{"⭐".repeat(5)}</div>
            <p className="text-sm italic mb-1" style={{ color: "#374151" }}>"{r.text}"</p>
            <p className="text-xs font-bold" style={{ color: "#7C3AED" }}>{r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Email ────────────────────────────────────────────────────────────────────
function EmailScreen({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address"); return; }
    onSubmit(email);
  };

  return (
    <div className="step-enter flex flex-col items-center text-center px-5 py-8 gap-6">
      <div className="text-5xl">🎁</div>
      <div>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#111827" }}>Your Personalized Plan<br />is Ready</h2>
        <p className="text-base" style={{ color: "#4B5563" }}>
          Enter your email to receive your 28-day plan + <strong style={{ color: "#7C3AED" }}>3 exclusive bonuses</strong>
        </p>
      </div>
      <div className="w-full max-w-sm flex flex-col gap-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="youremail@example.com"
          className="w-full px-4 py-4 rounded-2xl text-base outline-none"
          style={{ border: `2px solid ${error ? "#EF4444" : email ? "#7C3AED" : "#E5E7EB"}`, background: "#fff", color: "#111827", fontSize: 16 }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        {error && <p className="text-xs text-red-500 text-left pl-1">{error}</p>}
        <button className="btn-primary" onClick={handleSubmit}>SEE MY FREE PLAN →</button>
        <div className="flex items-center gap-2 text-xs justify-center" style={{ color: "#9CA3AF" }}>
          <span>🔒</span><span>Your privacy is protected. No spam, ever.</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {[
          "✅ Your personalized 28-day roadmap",
          "🎁 Guide with 100 prompts for your work",
          "🎁 Private Learnive community",
          "🎁 Ready-to-use AI templates",
        ].map((item, i) => (
          <div key={i} className="text-sm text-left" style={{ color: "#374151" }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Offer: Intro ─────────────────────────────────────────────────────────────
const DAY_APPS = [
  { day: 1, icon: "🤖", name: "ChatGPT" },
  { day: 2, icon: "🎨", name: "Claude" },
  { day: 3, icon: "🖼️", name: "Canva AI" },
  { day: 4, icon: "✍️", name: "Copilot" },
  { day: 5, icon: "🎬", name: "Gemini" },
  { day: 6, icon: "📊", name: "Notion AI" },
  { day: 7, icon: "📝", name: "Copy.ai" },
  { day: 8, icon: "🎵", name: "Suno" },
  { day: 9, icon: "🔍", name: "Perplexity" },
  { day: 10, icon: "⚡", name: "Make AI" },
];

function OfferIntro({ answers, onSpin }: { answers: Answers; onSpin: () => void }) {
  const [ticker, setTicker] = useState(0);
  const purchases = [
    "david.le*** — 4-Week Plan",
    "emily.yo*** — 1-Week Plan",
    "john.ki*** — 4-Week Plan",
    "sarah.da*** — 1-Week Plan",
    "david.ma*** — 4-Week Plan",
    "carlos.r*** — 4-Week Plan",
    "maria.g*** — 1-Week Plan",
  ];

  useEffect(() => {
    const t = setInterval(() => setTicker(i => (i + 1) % purchases.length), 2500);
    return () => clearInterval(t);
  }, []);

  const goal = answers[2]?.[0];
  const goalLabel: Record<string, string> = {
    "dominar-ia":              "Master AI",
    "habilidades-financieras": "Increase income",
    "crecimiento-profesional": "Grow professionally",
    "jubilacion":              "Plan my future",
    "desarrollo-personal":     "Personal development",
  };
  const celebration = answers[20]?.[0];
  const celebLabel: Record<string, string> = {
    "cuentas":    "Pay off debts",
    "jubilacion": "Retirement fund",
    "emergencia": "Emergency fund",
    "vacaciones": "Dream vacation",
    "otro":       "My personal dream",
  };

  return (
    <div className="step-enter flex flex-col" style={{ background: "#fff" }}>
      {/* Discount badge */}
      <div className="mx-4 mt-6 mb-2 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
          style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
          🔥 Special discount: <span className="px-2 py-0.5 rounded-full font-black text-white ml-1" style={{ background: "#DC2626" }}>50%</span>
        </div>
      </div>

      <div className="text-center px-5 pb-4">
        <h1 className="text-xl font-black leading-tight mb-1" style={{ color: "#111827" }}>
          Your personalized 28-Day<br />AI Challenge is ready!
        </h1>
        <p className="text-sm font-semibold" style={{ color: "#7C3AED" }}>Become the AI Master in 2026</p>
      </div>

      {/* Profile summary */}
      <div className="mx-4 mb-5 rounded-2xl p-4" style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>📊 Your goal</p>
            <p className="text-sm font-black" style={{ color: "#111827" }}>{goalLabel[goal ?? ""] ?? "Grow with AI"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>🎯 Your target</p>
            <p className="text-sm font-black" style={{ color: "#111827" }}>{celebLabel[celebration ?? ""] ?? "Reach my goals"}</p>
          </div>
        </div>
      </div>

      {/* Day grid */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-5 gap-2">
          {DAY_APPS.map(app => (
            <div key={app.day} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "#F3F0FF", border: "1px solid #E9D5FF" }}>
                {app.icon}
              </div>
              <p className="text-xs font-bold" style={{ color: "#6B7280" }}>DAY {app.day}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "#9CA3AF" }}>+18 more days with premium tools</p>
      </div>

      {/* Social proof */}
      <div className="mx-4 mb-4 rounded-xl p-3 text-center" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
        <p className="text-sm font-black" style={{ color: "#92400E" }}>
          🔥 <span style={{ color: "#EA580C" }}>203 people</span> purchased this plan in the last hour
        </p>
      </div>

      {/* Live purchase ticker */}
      <div className="mx-4 mb-6 overflow-hidden rounded-xl" style={{ background: "#F9F5FF", border: "1px solid #EDE9FE" }}>
        <div className="px-4 py-2 flex items-center gap-2 text-sm" style={{ color: "#5B21B6" }}>
          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#7C3AED" }}></span>
          <span className="font-medium truncate">{purchases[ticker]}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-safe">
        <button className="btn-primary text-lg py-5" onClick={onSpin}>
          🎡 SPIN & UNLOCK MY DISCOUNT
        </button>
        <p className="text-center text-xs mt-2" style={{ color: "#9CA3AF" }}>Spin the wheel to unlock your special price</p>
      </div>
    </div>
  );
}

// ─── Spin Wheel ───────────────────────────────────────────────────────────────
// Segments go clockwise from top. 50% is gold and narrowest (looks hardest to win).
// Centers (cumulative °): 5%→35, 20%→105, 15%→175, 30%→245, 10%→302.5, 50%→342.5
const WHEEL_SEGS = [
  { label: "5%",  deg: 70, color: "#E5E7EB", textColor: "#374151" },
  { label: "20%", deg: 70, color: "#DDD6FE", textColor: "#5B21B6" },
  { label: "15%", deg: 70, color: "#A78BFA", textColor: "#fff" },
  { label: "30%", deg: 70, color: "#7C3AED", textColor: "#fff" },
  { label: "10%", deg: 45, color: "#4C1D95", textColor: "#fff" },
  { label: "50%", deg: 35, color: "#F59E0B", textColor: "#78350F" }, // GOLD — winner
];
// CSS rotate(deg) spins canvas clockwise → pointer (at top) sees canvas position (360-deg%360)%360.
// 50% center is at 342.5° → deg%360 must equal 360-342.5=17.5° → TOTAL_DEG = 7×360+17.5 = 2537.5
const WHEEL_TOTAL_DEG = 2538; // lands pointer at canvas 342° = inside 50% gold segment ✓

function drawWheel(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = canvas.width;
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 14;

  ctx.clearRect(0, 0, size, size);

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 14, 0, 2 * Math.PI);
  ctx.fillStyle = "#1E1B4B";
  ctx.fill();

  // Segments
  let cumDeg = 0;
  WHEEL_SEGS.forEach((seg) => {
    const startAngle = (cumDeg - 90) * (Math.PI / 180);
    const endAngle   = (cumDeg + seg.deg - 90) * (Math.PI / 180);
    const midAngle   = startAngle + (endAngle - startAngle) / 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Text centered along segment midpoint at 68% radius
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midAngle);
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 3;
    ctx.fillStyle = seg.textColor;

    const textX = r * 0.68;
    if (seg.label === "50%") {
      ctx.font = "bold 17px system-ui";
      ctx.fillText("50%", textX, -5);
      ctx.font = "bold 10px system-ui";
      ctx.fillText("OFF", textX, 9);
    } else {
      const fs = seg.deg < 50 ? 13 : 15;
      ctx.font = `bold ${fs}px system-ui`;
      ctx.fillText(seg.label, textX, -4);
      ctx.font = `${fs - 3}px system-ui`;
      ctx.fillText("OFF", textX, 9);
    }
    ctx.restore();

    cumDeg += seg.deg;
  });

  // Center hub
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(1, "#E5E7EB");
  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Decorative dots on outer ring
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
    const bx = cx + (r + 8) * Math.cos(angle);
    const by = cy + (r + 8) * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(bx, by, 4, 0, 2 * Math.PI);
    ctx.fillStyle = i % 2 === 0 ? "#FCD34D" : "#FB923C";
    ctx.fill();
  }
}

function WheelScreen({ onWin }: { onWin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [won, setWon]       = useState(false);
  const [spinning, setSpinning] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (canvasRef.current) drawWheel(canvasRef.current);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const spin = () => {
    if (spinning || won) return;
    setSpinning(true);

    const TOTAL_DEG = WHEEL_TOTAL_DEG;
    const DURATION  = 5500;
    const start     = performance.now();

    if (canvasRef.current) canvasRef.current.style.willChange = "transform";

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      const elapsed = Math.min(now - start, DURATION);
      const t       = elapsed / DURATION;
      const deg     = TOTAL_DEG * easeOutCubic(t);

      if (canvasRef.current) {
        canvasRef.current.style.transform = `rotate(${deg}deg)`;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        if (canvasRef.current) canvasRef.current.style.willChange = "auto";
        setTimeout(() => {
          setSpinning(false);
          setWon(true);
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  return (
    <div className="step-enter flex flex-col items-center text-center px-5 py-6 gap-5">
      <div>
        <h2 className="text-2xl font-black mb-1" style={{ color: "#111827" }}>Spin and unlock your</h2>
        <p className="text-2xl font-black" style={{ color: "#7C3AED" }}>Exclusive Discount!</p>
        <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
          Don't miss the chance to master AI with a personalized offer 🎁
        </p>
      </div>

      {/* Wheel container + pointer — responsive: fits any phone width */}
      <div className="relative flex items-center justify-center"
        style={{ width: "min(300px, calc(100vw - 56px))", height: "min(300px, calc(100vw - 56px))" }}>
        {/* Fixed pointer at top */}
        <div className="absolute z-20" style={{ top: -2, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
            borderTop: "30px solid #111827",
            filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))",
          }} />
        </div>

        {/* Canvas scales with container via CSS */}
        <canvas
          ref={canvasRef}
          width={290}
          height={290}
          style={{
            width: "min(290px, calc(100vw - 68px))",
            height: "min(290px, calc(100vw - 68px))",
            borderRadius: "50%",
            boxShadow: "0 8px 32px rgba(76,29,149,0.35)",
          }}
        />
      </div>

      {spinning && !won && (
        <p className="text-sm font-semibold animate-pulse" style={{ color: "#7C3AED" }}>
          🎡 Spinning...
        </p>
      )}

      {!won && (
        <button className="btn-primary text-lg py-5 w-full max-w-sm" onClick={spin} disabled={spinning}>
          {spinning ? "⏳ Wait..." : "🎡 SPIN"}
        </button>
      )}

      {/* Winner modal */}
      {won && (
        <div className="fixed inset-0 flex items-end justify-center z-50"
          style={{ background: "rgba(0,0,0,0.55)" }}>
          <div className="step-enter w-full max-w-lg rounded-t-3xl p-6 flex flex-col items-center gap-4 text-center"
            style={{ background: "#fff" }}>
            <div className="text-5xl">🥳</div>
            <h3 className="text-2xl font-black" style={{ color: "#111827" }}>Congratulations!</h3>
            <div className="w-full rounded-2xl p-5" style={{
              background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
              border: "2.5px solid #7C3AED",
            }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#5B21B6" }}>you won a discount</p>
              <p className="text-5xl font-black leading-none" style={{ color: "#7C3AED" }}>50% off</p>
              <p className="text-sm mt-2 font-medium" style={{ color: "#6B7280" }}>Applied automatically ✓</p>
            </div>
            <button className="btn-primary text-lg py-4" onClick={onWin}>
              CLAIM MY DISCOUNT →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "1-week",
    name: "1-WEEK\nPLAN",
    originalPrice: 13.86,
    discountedPrice: 6.93,
    perDay: 0.99,
    popular: false,
    description: "Perfect for getting started",
    link: "https://pay.hotmart.com/P105974340C?off=to2tgttk&checkoutMode=10",
  },
  {
    id: "4-weeks",
    name: "4-WEEK\nPLAN",
    originalPrice: 39.99,
    discountedPrice: 19.99,
    perDay: 0.71,
    popular: true,
    description: "Double the results",
    link: "https://pay.hotmart.com/P105974340C?off=p488ll55&checkoutMode=10",
  },
];

function PricingScreen() {
  const [selected, setSelected] = useState("4-weeks");
  const [timeLeft, setTimeLeft] = useState({ m: 5, s: 44 });
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const couponCode = "LEARNIVE50";

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.m === 0 && prev.s === 0) return prev;
        if (prev.s === 0) return { m: prev.m - 1, s: 59 };
        return { ...prev, s: prev.s - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (n: number) => n.toString().padStart(2, "0");

  const selectedPlan = PLANS.find(p => p.id === selected)!;

  const faqs = [
    { q: "Do I really need 28 days?", a: "Yes. The brain needs 21+ days to build new habits. Learnive's method is designed with learning neuroscience for lasting results." },
    { q: "What if I have no technical experience?", a: "Perfect — Learnive was created exactly for you. You don't need to code or have any technical background. Just 15 minutes a day." },
    { q: "What if I don't like it?", a: "You have 30 days to request a full refund. No questions asked. Zero risk." },
    { q: "When does my access start?", a: "Immediately after your payment you'll receive full access to the platform, the mobile app, and all bonuses." },
  ];

  return (
    <div className="step-enter flex flex-col" style={{ background: "#fff" }}>
      {/* Sticky timer */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
        style={{ background: "#1F2937", borderBottom: "1px solid #374151" }}>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white" style={{ opacity: 0.7 }}>Discount expires in</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="px-2 py-0.5 rounded font-black text-base text-white" style={{ background: "#374151", minWidth: "30px", textAlign: "center" }}>
              {fmt(timeLeft.m)}
            </div>
            <span className="text-white font-black text-sm">:</span>
            <div className="px-2 py-0.5 rounded font-black text-base text-white" style={{ background: "#374151", minWidth: "30px", textAlign: "center" }}>
              {fmt(timeLeft.s)}
            </div>
            <span className="text-xs text-white ml-1" style={{ opacity: 0.6 }}>min sec</span>
          </div>
        </div>
        <a href={selectedPlan.link} target="_blank" rel="noopener noreferrer"
          className="btn-primary py-2.5 px-4 text-sm flex-shrink-0" style={{ width: "auto", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
          GET MY PLAN
        </a>
      </div>

      {/* Coupon applied */}
      <div className="mx-4 mt-4 rounded-xl px-4 py-3 flex items-center gap-2"
        style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
        <span className="text-green-600">✅</span>
        <p className="text-sm font-bold" style={{ color: "#166534" }}>Your promo code has been applied!</p>
      </div>
      <div className="mx-4 mt-2 mb-4 rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB" }}>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span className="font-bold tracking-widest text-sm" style={{ color: "#374151" }}>{couponCode}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "#DC2626" }}>
          <span>{fmt(timeLeft.m)}:{fmt(timeLeft.s)}</span>
          <span style={{ color: "#9CA3AF", fontWeight: 400 }}>&nbsp;Min&nbsp;Sec</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 mb-4 text-center">
        <h2 className="text-lg font-black" style={{ color: "#111827" }}>Choose the best plan for you</h2>
      </div>

      {/* Plans */}
      <div className="px-4 mb-2 flex flex-col gap-3">
        {PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className="relative text-left rounded-2xl p-4 transition-all"
            style={{
              border: `2px solid ${selected === plan.id ? "#7C3AED" : "#E5E7EB"}`,
              background: selected === plan.id ? "#F9F5FF" : "#fff",
            }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1"
                style={{ background: "#7C3AED", whiteSpace: "nowrap" }}>
                👍 MOST POPULAR
              </div>
            )}
            <div className="flex justify-between items-center" style={{ marginTop: plan.popular ? "4px" : 0 }}>
              <div>
                <p className="font-black text-base leading-tight whitespace-pre-line" style={{ color: "#111827" }}>{plan.name}</p>
                <p className="text-xs mt-1 line-through" style={{ color: "#9CA3AF" }}>US${plan.originalPrice.toFixed(2)}</p>
                <p className="text-sm font-bold" style={{ color: "#7C3AED" }}>US${plan.discountedPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: "#111827" }}>
                  US${plan.perDay.toFixed(2)}
                </p>
                <p className="text-xs font-semibold" style={{ color: "#6B7280" }}>per day</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Terms */}
      <div className="mx-4 mb-4 p-3 rounded-xl text-xs leading-relaxed" style={{ background: "#F9FAFB", color: "#6B7280" }}>
        {selected === "1-week" ? (
          <p>By clicking Get My Plan, I agree to pay <strong>US$6.93</strong> (taxes not included) for my 1-week plan and that, if I don't cancel before the end of the introductory period, it will automatically renew at the regular price of <strong>US$39.99</strong> every 4 weeks until I cancel. I can cancel online by visiting my profile.</p>
        ) : (
          <p>By clicking Get My Plan, I agree to pay <strong>US$19.99</strong> (taxes not included) for my 4-week plan and that, if I don't cancel before the end of the period, it will automatically renew at the regular price of <strong>US$39.99</strong> every 4 weeks until I cancel. I can cancel online by visiting my profile.</p>
        )}
      </div>

      {/* Main CTA */}
      <div className="px-4 mb-6">
        <a href={selectedPlan.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="btn-primary text-lg py-5">GET MY PLAN →</button>
        </a>
        <p className="text-center text-xs mt-3" style={{ color: "#9CA3AF" }}>
          🔒 Secure SSL payment · 🛡️ 30-day guarantee · ❌ Cancel anytime
        </p>
      </div>

      {/* Testimonials */}
      <div className="px-4 mb-6">
        <div className="flex gap-0.5 justify-center mb-1">{"⭐⭐⭐⭐⭐"}</div>
        <p className="text-sm font-bold text-center mb-1" style={{ color: "#111827" }}>4.9 / 5 · +18,000 reviews</p>
        <p className="text-xs text-center mb-4" style={{ color: "#6B7280" }}>on Trustpilot and App Store</p>
        {[
          { name: "Laura M., 29", role: "Content Creator", text: "In 28 days I learned more than in years. Now I do in 1 hour what used to take me a full day." },
          { name: "Robert S., 41", role: "Marketing Manager", text: "I was skeptical because I'm not technical. But the method is so clear that by the first week I was already using AI in my campaigns." },
          { name: "Daniela C., 35", role: "Entrepreneur", text: "With the prompts I learned, I now create content in minutes. My sales increased 40%." },
        ].map((t, i) => (
          <div key={i} className="mb-3 rounded-2xl p-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
            <div className="flex gap-0.5 mb-2">{"⭐⭐⭐⭐⭐"}</div>
            <p className="text-sm italic mb-2" style={{ color: "#374151" }}>"{t.text}"</p>
            <p className="text-sm font-bold" style={{ color: "#111827" }}>{t.name}</p>
            <p className="text-xs" style={{ color: "#7C3AED" }}>{t.role}</p>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="mx-4 mb-6 rounded-2xl p-5 text-center" style={{ background: "#F0FDF4", border: "2px solid #86EFAC" }}>
        <div className="text-4xl mb-2">🛡️</div>
        <h3 className="font-black text-base mb-2" style={{ color: "#166534" }}>30-Day Full Money-Back Guarantee</h3>
        <p className="text-sm" style={{ color: "#166534" }}>
          If within the first 30 days you're not satisfied, we'll refund <strong>every cent</strong>. No questions, no hassle.
        </p>
      </div>

      {/* FAQ */}
      <div className="px-4 mb-6">
        <h3 className="text-base font-black mb-3" style={{ color: "#111827" }}>Frequently Asked Questions</h3>
        {faqs.map((faq, i) => (
          <button key={i} className="w-full mb-2 rounded-xl p-4 text-left"
            style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
            onClick={() => setShowFaq(showFaq === i ? null : i)}>
            <div className="flex justify-between items-center gap-3">
              <p className="text-sm font-semibold" style={{ color: "#111827" }}>{faq.q}</p>
              <span className="text-lg flex-shrink-0" style={{ color: "#7C3AED" }}>{showFaq === i ? "−" : "+"}</span>
            </div>
            {showFaq === i && <p className="text-sm mt-3 leading-relaxed" style={{ color: "#4B5563" }}>{faq.a}</p>}
          </button>
        ))}
      </div>

      {/* Final CTA */}
      <div className="px-4 pb-safe">
        <a href={selectedPlan.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <button className="btn-primary text-lg py-5">YES, I WANT TO START NOW →</button>
        </a>
        <p className="text-center text-xs mt-2" style={{ color: "#9CA3AF" }}>
          ⚡ Offer expires in {fmt(timeLeft.m)}:{fmt(timeLeft.s)}
        </p>
      </div>
    </div>
  );
}

// ─── Offer controller (sub-steps) ─────────────────────────────────────────────
type OfferSubStep = "intro" | "wheel" | "pricing";

function OfferScreen({ answers }: { answers: Answers }) {
  const [subStep, setSubStep] = useState<OfferSubStep>("intro");

  if (subStep === "intro") return <OfferIntro answers={answers} onSpin={() => setSubStep("wheel")} />;
  if (subStep === "wheel") return <WheelScreen onWin={() => setSubStep("pricing")} />;
  return <PricingScreen />;
}

// ─── Main Quiz Controller ─────────────────────────────────────────────────────
export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [key, setKey] = useState(0);

  const currentStep = QUIZ_STEPS[stepIndex];

  const goNext = useCallback(() => {
    setStepIndex(i => Math.min(i + 1, QUIZ_STEPS.length - 1));
    setSelected([]);
    setKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleIntroAnswer = (id: string) => {
    setAnswers(a => ({ ...a, 0: [id] }));
    goNext();
  };

  const handleSelect = useCallback((questionNumber: number, id: string, multiple: boolean) => {
    if (multiple) {
      setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    } else {
      setAnswers(a => ({ ...a, [questionNumber]: [id] }));
      setTimeout(goNext, 280);
    }
  }, [goNext]);

  const handleQuestionNext = useCallback((questionNumber: number) => {
    if (selected.length > 0) {
      setAnswers(a => ({ ...a, [questionNumber]: selected }));
      goNext();
    }
  }, [selected, goNext]);

  const showHeader = currentStep.type !== "offer";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAFA" }}>
      {showHeader && (
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(250,250,250,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #F3F4F6" }}>
          <Logo />
          {currentStep.type !== "intro" && (
            <button onClick={() => { setStepIndex(i => Math.max(i - 1, 0)); setKey(k => k + 1); }}
              className="text-sm px-4 py-2 rounded-xl" style={{ color: "#6B7280", background: "#F3F4F6", minHeight: 44, minWidth: 72 }}>
              ← Back
            </button>
          )}
        </header>
      )}

      {showHeader && <ProgressBar step={currentStep} />}

      <main className="flex-1 w-full max-w-lg mx-auto" key={key}>
        {currentStep.type === "intro" && <IntroScreen onAnswer={handleIntroAnswer} />}
        {currentStep.type === "interstitial" && <InterstitialScreen step={currentStep} onNext={goNext} />}
        {currentStep.type === "question" && (
          <QuestionScreen
            step={currentStep}
            selected={selected}
            onSelect={id => handleSelect(currentStep.number, id, currentStep.multiple ?? false)}
            onNext={() => handleQuestionNext(currentStep.number)}
          />
        )}
        {currentStep.type === "loading" && <LoadingScreen onDone={goNext} />}
        {currentStep.type === "email" && <EmailScreen onSubmit={email => { setAnswers(a => ({ ...a, email: [email] })); goNext(); }} />}
        {currentStep.type === "offer" && <OfferScreen answers={answers} />}
      </main>
    </div>
  );
}
