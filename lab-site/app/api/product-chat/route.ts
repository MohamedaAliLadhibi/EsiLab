import { NextResponse } from 'next/server';

type ChatRequest = {
  question?: string;
  product?: {
    name?: string;
    sku?: string;
    brand?: string;
    category?: string;
    packageSize?: string;
    shortDescription?: string;
    description?: string;
    specs?: Array<{ label: string; value: string }>;
  };
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENROUTER_API_KEY is not configured.' },
      { status: 503 },
    );
  }

  const body = (await request.json()) as ChatRequest;
  const question = body.question?.trim();
  const product = body.product;

  if (!question || !product?.name) {
    return NextResponse.json(
      { error: 'Missing product or question.' },
      { status: 400 },
    );
  }

  const specs = product.specs?.map((spec) => `- ${spec.label}: ${spec.value}`).join('\n') || 'No detailed specs provided.';
  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4001',
      'X-Title': 'EsiLab Catalogue',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are EsiLab product assistant for a laboratory equipment catalogue. Answer in the same language as the user when possible. Use only the provided product data. If price, stock, compatibility, safety, installation, or regulatory certainty is needed, explain what can be inferred and ask the user to contact EsiLab for confirmation. Be concise and practical.',
        },
        {
          role: 'user',
          content: [
            `Product name: ${product.name}`,
            product.sku ? `Reference: ${product.sku}` : '',
            product.brand ? `Brand: ${product.brand}` : '',
            product.category ? `Category: ${product.category}` : '',
            product.packageSize ? `Package size: ${product.packageSize}` : '',
            product.shortDescription ? `Short description: ${product.shortDescription}` : '',
            product.description ? `Description: ${product.description}` : '',
            `Specs:\n${specs}`,
            `Question: ${question}`,
          ].filter(Boolean).join('\n'),
        },
      ],
      temperature: 0.35,
      max_tokens: 450,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: errorText || 'AI provider request failed.' },
      { status: response.status },
    );
  }

  const json = await response.json();
  const answer = json?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    return NextResponse.json(
      { error: 'AI provider returned an empty response.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ answer });
}
