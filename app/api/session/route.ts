import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/session — create a new session at quiz start
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { utmSource, utmMedium, utmCampaign } = body;

    const userAgent = req.headers.get("user-agent") ?? undefined;

    const session = await prisma.quizSession.create({
      data: {
        utmSource: utmSource ?? null,
        utmMedium: utmMedium ?? null,
        utmCampaign: utmCampaign ?? null,
        userAgent: userAgent ?? null,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("[POST /api/session]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/session — update email or status
export async function PATCH(req: NextRequest) {
  try {
    const { sessionId, email, status } = await req.json();
    if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (email) data.email = email;
    if (status) data.status = status;
    if (status === "completed") data.completedAt = new Date();

    const session = await prisma.quizSession.update({
      where: { id: sessionId },
      data,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("[PATCH /api/session]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
