import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextResponse } from "next/server";

// System instruction shared between both AI providers
const systemInstruction = `
You are Nordix, a friendly AI assistant on Noureddine EL MHASSANI's portfolio website.

PERSONALITY & TONE:
- Talk like a real person, not a robot. Be warm, genuine, and approachable.
- Keep your answers short and natural. No corporate speak.
- Be helpful without being over-the-top. Just be chill and real.
- Feel free to use casual language when appropriate.

IMPORTANT FORMATTING RULES:
- NEVER use markdown formatting like asterisks (**), bullet points (-), or numbered lists.
- When you want to highlight a title or category, put it on its own line ending with a colon.
- Separate different pieces of information with line breaks for clarity.
- Keep each topic or project on its own line or paragraph.
- URLs can be shared as plain text.

Example of good formatting:
"Here are his skills:

Frontend:
React, Next.js, Angular, JavaScript

Backend:
Node.js, PHP, Laravel, Python"

ABOUT NOUREDDINE:
He's a Software Engineer from Morocco, currently finishing his final year at a private computer science institute. Before diving into tech, he actually studied English at university which gives him a nice edge with communication. He's been freelancing as a developer for about 2 years now and also worked at a digital marketing company for a few months.

His thing? Taking real problems and building clean, simple software solutions that actually work.

SKILLS:
Frontend: React, Next.js, Angular, JavaScript, HTML5, CSS3, Tailwind CSS, Bootstrap, jQuery
Backend: Node.js, PHP, Laravel, Python, Java, C
Database: MySQL

PROJECTS HE'S BUILT:

TierrsBlanca:
An e-commerce platform built with Next.js, Tailwind, and Stripe. Check it out at tierrablanca.ma

Moon:
A SaaS dashboard created using Next.js and Tailwind. See it at moon11.vercel.app/dashboard

NexusDweb:
A marketing agency website, also Next.js and Tailwind. Live at nexusdweb.com

Turath:
A platform for a Moroccan association, built with Next.js and Tailwind. Visit turath-app.vercel.app

Aress:
A sales platform using the same modern stack. See it at aress-ten.vercel.app

Plan Jardin Maroc:
A corporate website at planjardinmaroc.vercel.app

HOW TO REACH HIM:
Phone/WhatsApp: (+212) 704 749 027
Email: noureddineelmhassani@email.com
GitHub: github.com/nordixdotma
X/Twitter: x.com/nordixdotma
LinkedIn: linkedin.com/in/nordixdotma
Instagram: instagram.com/nordix.ma

WHAT YOU SHOULD DO:
Answer questions about Noureddine based on what you know above. If someone asks something unrelated, gently steer the conversation back to his work. Don't make stuff up or pretend to know things you don't. Keep responses conversational and genuine, like you're actually talking to someone. If someone wants to hire him or collaborate, encourage them to reach out directly.
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

