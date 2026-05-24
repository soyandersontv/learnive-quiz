import { prisma } from "@/lib/prisma";
import { QUIZ_STEPS } from "@/lib/quiz-data";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "learnive2026";
const TZ = "America/Bogota";

// Lookup map: questionNumber → question text (from the fixed quiz data)
const QUESTION_TEXT: Record<number, string> = Object.fromEntries(
  QUIZ_STEPS
    .filter((s): s is Extract<typeof s, { type: "question" }> => s.type === "question")
    .map(s => [s.number, s.question])
);
QUESTION_TEXT[0] = "How prepared are you for the AI era?";

const fmt = (date: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-CO", { timeZone: TZ, ...opts }).format(date);

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ pw?: string; session?: string }>;
}) {
  const params = await searchParams;

  // Simple password gate
  if (params.pw !== PASSWORD) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F5FF", fontFamily: "system-ui, sans-serif" }}>
        <form method="GET" style={{ background: "#fff", padding: 32, borderRadius: 20, boxShadow: "0 4px 24px rgba(124,58,237,0.12)", display: "flex", flexDirection: "column", gap: 16, minWidth: 320 }}>
          <div style={{ fontSize: 28, textAlign: "center" }}>🔐</div>
          <h1 style={{ margin: 0, textAlign: "center", color: "#7C3AED", fontSize: 20, fontWeight: 800 }}>Learnive Admin</h1>
          <input name="pw" type="password" placeholder="Contraseña" autoFocus
            style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid #E5E7EB", fontSize: 16, outline: "none" }} />
          <button type="submit"
            style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Load sessions with answers and events
  const sessions = await prisma.quizSession.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      answers: { orderBy: { questionNumber: "asc" } },
      events: { orderBy: { createdAt: "asc" } },
    },
  });

  const selectedId = params.session;
  const selectedSession = selectedId ? sessions.find(s => s.id === selectedId) : null;

  const statusColor: Record<string, string> = {
    in_progress: "#F59E0B",
    completed: "#10B981",
    converted: "#7C3AED",
  };

  const total = sessions.length;
  const completed = sessions.filter(s => s.status === "completed" || s.status === "converted").length;
  const converted = sessions.filter(s => s.status === "converted").length;
  const emails = sessions.filter(s => s.email).length;

  return (
    <div style={{ minHeight: "100vh", background: "#F9F5FF", fontFamily: "system-ui, sans-serif", color: "#111827" }}>
      {/* Header */}
      <div style={{ background: "#7C3AED", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 24 }}>📊</span>
        <h1 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 800 }}>Learnive — Panel de Registros</h1>
        <a href={`/admin?pw=${PASSWORD}`} style={{ marginLeft: "auto", color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none" }}>↺ Actualizar</a>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "20px 24px" }}>
        {[
          { label: "Total sesiones", value: total, icon: "👥" },
          { label: "Emails capturados", value: emails, icon: "📧" },
          { label: "Quiz completado", value: completed, icon: "✅" },
          { label: "Convertidos (pagaron)", value: converted, icon: "💰" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#7C3AED" }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, padding: "0 24px 24px" }}>
        {/* Sessions list */}
        <div style={{ width: selectedSession ? 380 : "100%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, marginRight: selectedSession ? 20 : 0 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#374151" }}>Usuarios ({total})</h2>
          {sessions.map(s => (
            <a key={s.id} href={`/admin?pw=${PASSWORD}&session=${s.id}`}
              style={{
                display: "block", textDecoration: "none",
                background: s.id === selectedId ? "#EDE9FE" : "#fff",
                border: `2px solid ${s.id === selectedId ? "#7C3AED" : "#E5E7EB"}`,
                borderRadius: 14, padding: "14px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor[s.status] ?? "#9CA3AF", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.email ?? <span style={{ color: "#9CA3AF", fontStyle: "italic" }}>Sin email</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    {fmt(new Date(s.createdAt), { dateStyle: "short", timeStyle: "short" })}
                    {" · "}{s.answers.length} respuestas
                    {s.utmSource && ` · ${s.utmSource}`}
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 8, background: statusColor[s.status] + "20", color: statusColor[s.status] }}>
                  {s.status}
                </div>
              </div>
            </a>
          ))}
          {sessions.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>Aún no hay registros</div>
          )}
        </div>

        {/* Session detail */}
        {selectedSession && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#374151" }}>
              Detalle del usuario
            </h2>
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Email", value: selectedSession.email ?? "—" },
                  { label: "Estado", value: selectedSession.status },
                  { label: "Creado", value: fmt(new Date(selectedSession.createdAt), { dateStyle: "short", timeStyle: "medium" }) },
                  { label: "Completado", value: selectedSession.completedAt ? fmt(new Date(selectedSession.completedAt), { dateStyle: "short", timeStyle: "medium" }) : "—" },
                  { label: "UTM Source", value: selectedSession.utmSource ?? "—" },
                  { label: "UTM Campaign", value: selectedSession.utmCampaign ?? "—" },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: "#111827", fontWeight: 600, marginTop: 2 }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answers */}
            <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#374151" }}>
              Respuestas ({selectedSession.answers.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedSession.answers.map((a, i) => (
                <div key={a.id} style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>
                    P{a.questionNumber} · {fmt(new Date(a.answeredAt), { timeStyle: "short" })}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    {a.question ?? QUESTION_TEXT[a.questionNumber] ?? `Pregunta ${a.questionNumber}`}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {a.answerIds.map(id => (
                      <span key={id} style={{ background: "#EDE9FE", color: "#5B21B6", borderRadius: 8, padding: "3px 10px", fontSize: 13, fontWeight: 600 }}>
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {selectedSession.answers.length === 0 && (
                <div style={{ color: "#9CA3AF", fontSize: 14 }}>No hay respuestas guardadas</div>
              )}
            </div>

            {/* Events */}
            {selectedSession.events.length > 0 && (
              <>
                <h3 style={{ margin: "16px 0 10px", fontSize: 15, fontWeight: 700, color: "#374151" }}>
                  Eventos del funnel
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedSession.events.map(e => (
                    <span key={e.id} style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #86EFAC", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
                      ✓ {e.event}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
