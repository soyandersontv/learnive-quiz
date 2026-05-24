export type QuizOption = {
  id: string;
  label: string;
  sublabel?: string;
  emoji?: string;
};

export type QuizStep =
  | { type: "intro" }
  | {
      type: "interstitial";
      id: string;
      emoji: string;
      title: string;
      body: string;
      stat?: string;
    }
  | {
      type: "question";
      number: number;
      question: string;
      subtitle?: string;
      options: QuizOption[];
      multiple?: boolean;
      nextText?: string;
    }
  | { type: "loading" }
  | { type: "email" }
  | { type: "offer" };

export const TOTAL_QUESTIONS = 20;

export const QUIZ_STEPS: QuizStep[] = [
  // Step 0: Intro
  { type: "intro" },

  // Step 1: Social proof interstitial
  {
    type: "interstitial",
    id: "social-proof-1",
    emoji: "🌎",
    stat: "Over 2,000,000",
    title: "people already master AI with Learnive",
    body: "Join millions of people transforming their careers and lives with artificial intelligence skills. Your moment is now.",
  },

  // Q1/20: Age
  {
    type: "question",
    number: 1,
    question: "How old are you?",
    subtitle: "We'll personalize your AI plan based on your profile",
    options: [
      { id: "18-24", label: "18 – 24 years old", emoji: "✨" },
      { id: "25-34", label: "25 – 34 years old", emoji: "🚀" },
      { id: "35-44", label: "35 – 44 years old", emoji: "💼" },
      { id: "45+",   label: "45+ years old",     emoji: "🎯" },
    ],
  },

  // Q2/20: Main goal
  {
    type: "question",
    number: 2,
    question: "What is your main goal in 2026?",
    subtitle: "This helps us create your ideal learning path",
    options: [
      { id: "dominar-ia",            label: "Master AI for personal projects",         emoji: "🤖" },
      { id: "habilidades-financieras", label: "Increase my income with AI",            emoji: "💰" },
      { id: "crecimiento-profesional", label: "Grow professionally",                   emoji: "📈" },
      { id: "jubilacion",            label: "Plan my future and retirement",            emoji: "🏖️" },
      { id: "desarrollo-personal",   label: "Comprehensive personal development",       emoji: "🌱" },
    ],
  },

  // Q3/20: Overwhelmed
  {
    type: "question",
    number: 3,
    question: "Do you feel overwhelmed by everything out there about AI?",
    options: [
      { id: "siempre",  label: "Always — it's too much",          emoji: "😵" },
      { id: "a-menudo", label: "Often it confuses me",            emoji: "😟" },
      { id: "a-veces",  label: "Sometimes it happens",            emoji: "🤔" },
      { id: "no",       label: "Not at all, I handle it fine",    emoji: "😎" },
    ],
  },

  // Q4/20: Comfort with AI tools
  {
    type: "question",
    number: 4,
    question: "How comfortable are you using AI tools?",
    options: [
      { id: "nada",              label: "I know nothing about AI",       emoji: "🌱" },
      { id: "muchas-dificultades", label: "I struggle a lot",            emoji: "😰" },
      { id: "algunas-dificultades", label: "I have some difficulties",   emoji: "🙂" },
      { id: "comodo",            label: "I feel quite comfortable",       emoji: "💪" },
    ],
  },

  // Q5/20: Fear of falling behind
  {
    type: "question",
    number: 5,
    question: "Are you afraid of falling behind in the AI era?",
    options: [
      { id: "siempre",  label: "Yes, it worries me all the time", emoji: "😨" },
      { id: "a-menudo", label: "I think about it often",          emoji: "😕" },
      { id: "a-veces",  label: "I consider it sometimes",         emoji: "🤷" },
      { id: "no",       label: "No, not at all",                  emoji: "😌" },
    ],
  },

  // Interstitial 2: Empathy
  {
    type: "interstitial",
    id: "empathy-1",
    emoji: "💙",
    title: "Don't worry! You're in the right place",
    body: "We've helped over 2,000,000 people master AI — regardless of their experience level. Our method is backed by thousands of hours of research and is 100% adapted to your pace and needs.",
  },

  // Q6/20: AI too hard?
  {
    type: "question",
    number: 6,
    question: "Do you think learning AI is too difficult for you?",
    options: [
      { id: "si-siempre", label: "Yes, it seems very hard",         emoji: "😣" },
      { id: "si-pero",    label: "Yes, but I still want to learn",  emoji: "💪" },
      { id: "no",         label: "No, I think I can do it",         emoji: "🔥" },
    ],
  },

  // Q7/20: AI level
  {
    type: "question",
    number: 7,
    question: "How would you rate your current AI level?",
    subtitle: "Be honest — there are no wrong answers",
    options: [
      { id: "experto",     label: "Expert",       sublabel: "I master advanced tools",     emoji: "🏆" },
      { id: "competente",  label: "Proficient",   sublabel: "I use AI with confidence",    emoji: "⭐" },
      { id: "intermedio",  label: "Intermediate", sublabel: "I know the basics",           emoji: "📚" },
      { id: "principiante", label: "Beginner",    sublabel: "Just getting started",        emoji: "🌱" },
    ],
  },

  // Q8/20: ChatGPT
  {
    type: "question",
    number: 8,
    question: "Have you ever used ChatGPT?",
    options: [
      { id: "diario",        label: "Yes, I use it every day",         emoji: "🤖" },
      { id: "algunas-veces", label: "Yes, I've tried it a few times",  emoji: "👍" },
      { id: "miedo",         label: "I'm afraid to try it",            emoji: "😰" },
      { id: "no-conozco",    label: "No, I don't know what it is",     emoji: "❓" },
    ],
  },

  // Q9/20: Other AI tools (multi-select)
  {
    type: "question",
    number: 9,
    question: "Which other AI tools do you already have experience with?",
    subtitle: "Select all that apply",
    multiple: true,
    nextText: "NEXT STEP",
    options: [
      { id: "nuevo",      label: "I'm new to AI",          emoji: "🌱" },
      { id: "midjourney", label: "Midjourney",              emoji: "🎨" },
      { id: "gemini",     label: "Google Gemini",           emoji: "🔵" },
      { id: "otter",      label: "Otter.ai",                emoji: "🎙️" },
      { id: "dall-e",     label: "DALL-E",                  emoji: "🖼️" },
      { id: "jasper",     label: "Jasper",                  emoji: "✍️" },
      { id: "copilot",    label: "Microsoft Copilot",       emoji: "💻" },
      { id: "playground", label: "OpenAI Playground",       emoji: "⚡" },
      { id: "claude",     label: "Claude (Anthropic)",      emoji: "🧠" },
    ],
  },

  // Q10/20: What stopped you?
  {
    type: "question",
    number: 10,
    question: "What has stopped you from mastering AI until now?",
    options: [
      { id: "sin-sistema",  label: "There was no clear system to follow", emoji: "🗺️" },
      { id: "sin-tiempo",   label: "I didn't have enough time",           emoji: "⏰" },
      { id: "tarde",        label: "I felt it was already too late",      emoji: "😔" },
      { id: "complicado",   label: "It seemed too complicated",           emoji: "🧩" },
    ],
  },

  // Interstitial 3: Motivational
  {
    type: "interstitial",
    id: "motivational-1",
    emoji: "⏳",
    title: "The best time was yesterday. The second best is TODAY.",
    body: "Most people never see results because they never start. With Learnive, you only need 15 minutes a day. In 28 days you'll have built a real advantage that opens doors you can't even imagine today.",
  },

  // Q11/20: Fear of replacement
  {
    type: "question",
    number: 11,
    question: "Are you worried AI might replace you at work?",
    options: [
      { id: "siempre",   label: "Yes, it worries me constantly",          emoji: "😰" },
      { id: "a-veces",   label: "I think about it sometimes",             emoji: "🤔" },
      { id: "no-porque", label: "No, because I already know how to use it", emoji: "💪" },
      { id: "nunca",     label: "I had never thought about it",           emoji: "😐" },
    ],
  },

  // Interstitial 4: Harvard quote
  {
    type: "interstitial",
    id: "harvard-quote",
    emoji: "🎓",
    title: "\"AI won't replace people. People with AI will.\"",
    body: "— Harvard Business Review\n\nMastering AI today is not optional — it's your biggest competitive advantage. Those who act now will define the next 10 years of their career.",
  },

  // Q12/20: AI impact on career
  {
    type: "question",
    number: 12,
    question: "Have you thought about how AI skills could change your career in 2026?",
    options: [
      { id: "si-escuchado", label: "Yes, I've read about it and I'm very interested", emoji: "📖" },
      { id: "curioso",      label: "I'm curious, I want to learn more",               emoji: "🔍" },
      { id: "nuevo",        label: "It's something new to me",                         emoji: "✨" },
    ],
  },

  // Q13/20: Income range
  {
    type: "question",
    number: 13,
    question: "What income range would you like to reach?",
    subtitle: "This helps us personalize your financial path",
    options: [
      { id: "50-100k",  label: "$50,000 – $100,000 USD/year",  emoji: "💵" },
      { id: "100-300k", label: "$100,000 – $300,000 USD/year", emoji: "💰" },
      { id: "300k+",    label: "More than $300,000 USD/year",  emoji: "🏆" },
    ],
  },

  // Q14/20: Comfortable learning?
  {
    type: "question",
    number: 14,
    question: "Are you comfortable learning new things?",
    options: [
      { id: "si",       label: "Yes, I love learning",         emoji: "🙌" },
      { id: "no",       label: "No, I find it hard to adapt",  emoji: "😬" },
      { id: "no-seguro", label: "Depends on the topic",        emoji: "🤷" },
    ],
  },

  // Q15/20: Areas to apply AI (multi-select)
  {
    type: "question",
    number: 15,
    question: "Which areas would you like to apply AI to?",
    subtitle: "Select all that interest you",
    multiple: true,
    nextText: "CONTINUE",
    options: [
      { id: "diseno",      label: "Graphic Design",         emoji: "🎨" },
      { id: "contenido",   label: "Content Creation",       emoji: "✍️" },
      { id: "web",         label: "Web Development",        emoji: "💻" },
      { id: "marketing",   label: "Digital Marketing",      emoji: "📱" },
      { id: "redes",       label: "Social Media",           emoji: "📲" },
      { id: "video",       label: "Video Editing",          emoji: "🎬" },
      { id: "fotografia",  label: "Photography",            emoji: "📸" },
      { id: "ecommerce",   label: "E-commerce",             emoji: "🛒" },
      { id: "consultoria", label: "Consulting / Business",  emoji: "🤝" },
    ],
  },

  // Q16/20: Readiness
  {
    type: "question",
    number: 16,
    question: "How ready do you feel to start your AI transformation?",
    options: [
      { id: "totalmente", label: "Totally ready! This is my moment", emoji: "🔥" },
      { id: "preparado",  label: "Ready, though a bit nervous",      emoji: "💪" },
      { id: "algo",       label: "Somewhat ready, lacking confidence", emoji: "🙂" },
      { id: "no",         label: "I don't feel ready yet",           emoji: "🌱" },
    ],
  },

  // Q17/20: Focus
  {
    type: "question",
    number: 17,
    question: "Do you find it easy to stay focused while learning?",
    options: [
      { id: "si",           label: "Yes, I focus without problems",             emoji: "🎯" },
      { id: "mayoria",      label: "Generally yes, though I get distracted sometimes", emoji: "😊" },
      { id: "cuesta",       label: "I struggle to stay focused",                emoji: "😓" },
      { id: "postergacion", label: "I tend to procrastinate frequently",        emoji: "⏰" },
    ],
  },

  // Interstitial 5: Empathy focus
  {
    type: "interstitial",
    id: "empathy-focus",
    emoji: "🧠",
    title: "That's completely normal! It's not a lack of willpower.",
    body: "People get distracted when the path isn't clear. Learnive solves that: 5–10 minute lessons, a clear daily structure, and smart reminders that keep you on track effortlessly.",
  },

  // Q18/20: Daily minutes
  {
    type: "question",
    number: 18,
    question: "How many minutes a day can you dedicate to learning AI?",
    subtitle: "We'll build your plan around exactly this time",
    options: [
      { id: "10min", label: "10 minutes a day", emoji: "⚡" },
      { id: "15min", label: "15 minutes a day", emoji: "🎯" },
      { id: "20min", label: "20 minutes a day", emoji: "🚀" },
    ],
  },

  // Q19/20: Commitments (multi-select)
  {
    type: "question",
    number: 19,
    question: "In 2026 I commit to:",
    subtitle: "Select all that apply",
    multiple: true,
    nextText: "CONTINUE",
    options: [
      { id: "aprender", label: "Learning something new every day",               emoji: "📚" },
      { id: "habitos",  label: "Building better habits with technology",          emoji: "⚙️" },
      { id: "metas",    label: "Achieving my personal and professional goals",    emoji: "🏆" },
    ],
  },

  // Q20/20: Celebration
  {
    type: "question",
    number: 20,
    question: "How would you celebrate your first results with AI?",
    subtitle: "Having a clear reward boosts your motivation",
    options: [
      { id: "cuentas",    label: "Pay off debts or pending bills",      emoji: "✅" },
      { id: "jubilacion", label: "Invest in my future / retirement",    emoji: "📈" },
      { id: "emergencia", label: "Emergency fund",                      emoji: "🛡️" },
      { id: "vacaciones", label: "A dream vacation",                    emoji: "✈️" },
      { id: "otro",       label: "Another personal dream",              emoji: "⭐" },
    ],
  },

  // Interstitial 6: Final push
  {
    type: "interstitial",
    id: "final-push",
    emoji: "🎉",
    title: "You made it! Your personalized plan is almost ready",
    body: "Based on your answers, we've designed a 28-day AI challenge 100% tailored to you. People with your profile who complete the program report an average 40% increase in productivity and new income opportunities.",
  },

  // Loading
  { type: "loading" },

  // Email
  { type: "email" },

  // Offer
  { type: "offer" },
];

export const INTERSTITIALS_BY_ANSWER: Record<
  string,
  { emoji: string; title: string; body: string }
> = {
  "fear-ai": {
    emoji: "💙",
    title: "Don't worry! You're in good hands",
    body: "We've helped over 2 million people with exactly the same concern. Our method is designed so you never feel lost.",
  },
};
