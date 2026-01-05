import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextResponse } from "next/server";

// System instruction shared between both AI providers
const systemInstruction = `
You are Nordix, the AI assistant on Noureddine EL MHASSANI's portfolio website. Your role is to help visitors learn about Noureddine, his work, and how to connect with him.

PERSONALITY:
- Be warm, professional, and genuinely helpful
- Keep responses concise but informative
- Sound like a knowledgeable assistant, not a robot
- Be enthusiastic about Noureddine's work when appropriate
- Use a friendly, conversational tone

RESPONSE FORMATTING (CRITICAL):
- DO NOT use markdown symbols like **, *, -, #, or numbered lists (1. 2. 3.)
- For titles/categories, write them on their own line ending with a colon
- Use blank lines to separate different sections
- Keep paragraphs short and scannable
- When listing items, put each on its own line without bullet points
- URLs should be written as plain text (they will be auto-linked)
- Email addresses should be written as plain text (they will be auto-linked)

EXAMPLE FORMAT:
"He specializes in modern web development. Here's what he works with:

Frontend Technologies:
React, Next.js, TypeScript, Tailwind CSS

Backend Technologies:
Node.js, PHP, Laravel, Python

You can see his work at tierrablanca.ma or moon11.vercel.app/dashboard"

ABOUT NOUREDDINE:
Noureddine EL MHASSANI is a Software Engineer based in Morocco. He's currently completing his final year at a private computer science institute. Before tech, he studied English at university, giving him strong communication skills. He has 2+ years of freelance development experience and previously worked at a digital marketing agency.

His focus is on building clean, modern web applications that solve real problems. He takes pride in writing maintainable code and creating smooth user experiences.

TECHNICAL SKILLS:
Frontend: React, Next.js, Angular, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Bootstrap
Backend: Node.js, PHP, Laravel, Python, Java, C
Database: MySQL
Tools: Git, VS Code, Figma

PORTFOLIO PROJECTS:

TierrsBlanca (tierrablanca.ma):
Full e-commerce platform with Stripe payments, built with Next.js and Tailwind

Moon (moon11.vercel.app/dashboard):
SaaS analytics dashboard featuring data visualization and modern UI

NexusDweb (nexusdweb.com):
Marketing agency website with animations and responsive design

Turath (turath-app.vercel.app):
Platform for a Moroccan cultural association

Aress (aress-ten.vercel.app):
Sales and inventory management platform

Plan Jardin Maroc (planjardinmaroc.vercel.app):
Corporate website for a landscaping company

CONTACT INFORMATION:
Phone/WhatsApp: +212 704 749 027
Email: noureddineelmhassani@email.com
GitHub: github.com/nordixdotma
LinkedIn: linkedin.com/in/nordixdotma
Twitter/X: x.com/nordixdotma
Instagram: instagram.com/nordix.ma

GUIDELINES:
- Answer questions about Noureddine based on the information above
- If asked about unrelated topics, politely redirect to his work or skills
- Never invent information not provided here
- For hiring inquiries, share contact details and encourage direct outreach
- Highlight relevant projects when discussing skills or experience
- Keep responses focused and avoid unnecessary verbosity
`;

// OpenRouter fallback function
const FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "openchat/openchat-7b:free",
  "huggingfaceh4/zephyr-7b-beta:free",
];

async function callOpenRouter(messages: any[]): Promise<string> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  
  if (!openRouterKey) {
    throw new Error("OPENROUTER_API_KEY is missing");
  }

  // Convert messages to OpenRouter format
  const formattedMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    })),
  ];

  // Try models in sequence
  for (const model of FREE_MODELS) {
    try {
      console.log(`Trying OpenRouter model: ${model}`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://nordix.ma",
          "X-Title": "Nordix Portfolio",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 1024,
          messages: formattedMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      console.warn(`Model ${model} failed: ${response.status}`, errorData);
      // Continue to next model
    } catch (error) {
      console.warn(`Error calling model ${model}:`, error);
      // Continue to next model
    }
  }

  throw new Error("All OpenRouter free models failed.");
}

// Gemini API function
async function callGemini(messages: any[], apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: systemInstruction,
  });

  // Handle history: Gemini expects history to start with 'user' role
  const historyMessages = messages.slice(0, -1);
  const validHistoryMessages =
    historyMessages.length > 0 && historyMessages[0].role !== "user"
      ? historyMessages.slice(1)
      : historyMessages;

  const history: Content[] = validHistoryMessages.map((m: any) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(lastMessage);
  const response = await result.response;
  return response.text();
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    // Check if at least one API key is available
    if (!geminiKey && !openRouterKey) {
      console.error("No API keys configured");
      return NextResponse.json(
        { error: "Internal Server Error: No API keys configured" },
        { status: 500 }
      );
    }
    

    let text: string;

    // Try Gemini first if available
    if (geminiKey) {
      try {
        text = await callGemini(messages, geminiKey);
        return NextResponse.json({ text });
      } catch (geminiError) {
        console.error("Gemini API failed, trying OpenRouter fallback:", geminiError);
        
        // If OpenRouter key is available, try it as fallback
        if (openRouterKey) {
          try {
            text = await callOpenRouter(messages);
            return NextResponse.json({ text });
          } catch (openRouterError) {
            console.error("OpenRouter fallback also failed:", openRouterError);
            return NextResponse.json(
              { error: "Both AI providers failed. Please try again later." },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: "Gemini API failed and no fallback configured." },
            { status: 500 }
          );
        }
      }
    } else if (openRouterKey) {
      // Only OpenRouter is configured
      try {
        text = await callOpenRouter(messages);
        return NextResponse.json({ text });
      } catch (openRouterError) {
        console.error("OpenRouter API failed:", openRouterError);
        return NextResponse.json(
          { error: "Failed to generate response. Please try again later." },
          { status: 500 }
        );
      }
    }

    // This shouldn't be reached, but just in case
    return NextResponse.json(
      { error: "No API provider available." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}

