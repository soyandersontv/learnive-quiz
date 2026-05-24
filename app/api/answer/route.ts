import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/answer — save one quiz answer
export async function POST(req: NextRequest) {
  try {
    const { sessionId, questionNumber, questionType, answerIds } = await req.json();

    if (!sessionId || questionNumber == null || !answerIds?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const answer = await prisma.quizAnswer.create({
      data: {
        sessionId,
        questionNumber,
        questionType: questionType ?? "question",
        answerIds,
      },
    });

    return NextResponse.json({ answerId: answer.id });
  } catch (err) {
    console.error("[POST /api/answer]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
