// app/api/extract-specs/route.js
// POST /api/extract-specs
// Receives a base64-encoded image of a spec sheet / datasheet.
// Calls Anthropic Claude vision to extract key-value specification pairs.
// Returns: { specs: [{ key: string, value: string }] }

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { imageBase64, mediaType } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured. Add it to .env.local." },
        { status: 500 }
      );
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Extract all specification key-value pairs from this image. This is likely a product datasheet or specification table.

Return ONLY a valid JSON array with no extra text, in this exact format:
[
  { "key": "specification name", "value": "specification value" },
  ...
]

Rules:
- Include every spec row you can read, even partial ones
- Keys should be clean labels (e.g. "Bore Size", "Operating Pressure", "Weight")
- Values should include units where present (e.g. "32 mm", "0–10 bar", "1.2 kg")
- Skip table headers, section titles, and non-spec text
- If a spec has multiple values (e.g. a range), combine them into one value string
- Return an empty array [] if no specs are found`,
            },
          ],
        },
      ],
    });

    const raw = response.content[0]?.text?.trim() || "[]";

    // Extract JSON array even if Claude wrapped it in markdown code fences
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ specs: [] });
    }

    let specs;
    try {
      specs = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ specs: [] });
    }

    // Sanitise: ensure each item has string key and value
    const clean = specs
      .filter((s) => s && typeof s.key === "string" && s.key.trim())
      .map((s) => ({
        key: String(s.key).trim(),
        value: String(s.value ?? "").trim(),
      }));

    return NextResponse.json({ specs: clean });
  } catch (err) {
    console.error("[extract-specs]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to extract specs" },
      { status: 500 }
    );
  }
}
