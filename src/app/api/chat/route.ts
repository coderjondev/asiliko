import { NextResponse } from "next/server";
import { isAllowedModelId } from "@/lib/allowed-models";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequestBody = {
  model?: string;
  messages: ChatMessage[];
};

export async function POST(request: Request) {
  const baseUrl = process.env.OMNIROUTE_BASE_URL;
  const apiKey = process.env.OMNIROUTE_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error("OmniRoute env vars are not configured");
    return NextResponse.json(
      { error: "OmniRoute is not configured" },
      { status: 500 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body.messages || body.messages.length === 0) {
    return NextResponse.json(
      { error: "messages is required" },
      { status: 400 },
    );
  }

  const DEFAULT_MODEL_ID = "kr/claude-sonnet-4.5";
  const model =
    body.model && isAllowedModelId(body.model) ? body.model : DEFAULT_MODEL_ID;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: body.messages,
          stream: false,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorData = data as {
        error?: string | { message?: string };
      } | null;
      const errorMessage =
        (typeof errorData?.error === "object"
          ? errorData.error?.message
          : errorData?.error) ||
        `Chat request failed (status ${response.status})`;

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "OmniRoute returned an invalid response" },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("OmniRoute chat error:", error);

    const isAbort = error instanceof Error && error.name === "AbortError";

    return NextResponse.json(
      {
        error: isAbort
          ? "OmniRoute request timed out"
          : "Failed to connect to OmniRoute",
      },
      { status: isAbort ? 504 : 500 },
    );
  }
}
