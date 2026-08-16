import { NextResponse } from "next/server";
import { getAllowedModel } from "@/lib/allowed-models";

type OmniRouteModel = {
  id: string;
  object: string;
  owned_by?: string;
};

type OmniRouteModelsResponse = {
  data: OmniRouteModel[];
};

type OmniRouteErrorResponse = {
  error?: string | { message?: string };
};

export async function GET() {
  const baseUrl = process.env.OMNIROUTE_BASE_URL;
  const apiKey = process.env.OMNIROUTE_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error("OmniRoute env vars are not configured");
    return NextResponse.json(
      { error: "OmniRoute is not configured" },
      { status: 500 },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/api/v1/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    let data: OmniRouteModelsResponse | OmniRouteErrorResponse | null = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorData = data as OmniRouteErrorResponse | null;
      const errorMessage =
        (typeof errorData?.error === "object"
          ? errorData.error?.message
          : errorData?.error) ||
        `Failed to fetch models from OmniRoute (status ${response.status})`;

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const successData = data as OmniRouteModelsResponse | null;

    if (!successData?.data) {
      return NextResponse.json(
        { error: "OmniRoute returned an invalid response" },
        { status: 502 },
      );
    }

    const filteredModels = successData.data
      .map((model) => {
        const allowed = getAllowedModel(model.id);
        if (!allowed) return null;

        return {
          id: model.id,
          object: model.object,
          brandName: allowed.brandName,
          description: allowed.description,
        };
      })
      .filter((model): model is NonNullable<typeof model> => model !== null);

    return NextResponse.json({ data: filteredModels });
  } catch (error) {
    console.error("OmniRoute models error:", error);

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
