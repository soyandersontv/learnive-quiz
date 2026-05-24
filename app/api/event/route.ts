import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/event — log a funnel event (pixel milestones, email captured, wheel spun, plan selected)
export async function POST(req: NextRequest) {
  try {
    const { sessionId, event, metadata } = await req.json();

    if (!sessionId || !event) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.sessionEvent.create({
      data: { sessionId, event, metadata: metadata ?? undefined },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/event]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
