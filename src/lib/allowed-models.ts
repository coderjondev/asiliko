export type AllowedModel = {
  id: string;
  brandName: string;
  description?: string;
};

export const ALLOWED_MODELS: AllowedModel[] = [
  {
    id: "kr/claude-sonnet-4.5",
    brandName: "Asiliko Sonnet 4.5",
    description: "Kuchli va aqlli, murakkab vazifalar uchun",
  },
  {
    id: "kr/claude-haiku-4.5",
    brandName: "Asiliko Haiku 4.5",
    description: "Tez va yengil, oddiy so'rovlar uchun",
  },
  {
    id: "kr/deepseek-3.2",
    brandName: "Asiliko Deep V3.2",
    description: "Chuqur mulohaza va tahlil uchun",
  },
  {
    id: "kr/minimax-m2.5",
    brandName: "Asiliko Max M2.5",
    description: "Ko'p qirrali, keng vazifalar uchun",
  },
  {
    id: "kr/minimax-m2.1",
    brandName: "Asiliko Max Lite M2.1",
    description: "Tejamkor va tez javob beruvchi",
  },
  {
    id: "kr/glm-5",
    brandName: "Asiliko GLM-5",
    description: "Umumiy vazifalar uchun ishonchli model",
  },
  {
    id: "kr/qwen3-coder-next",
    brandName: "Asiliko Coder Next",
    description: "Dasturlash va kod yozish uchun",
  },
  {
    id: "gc/grok-4.5",
    brandName: "Asiliko Grok 4.5",
    description: "Ijodiy va tabiiy suhbat uchun",
  },
  {
    id: "gc/grok-composer-2.5-fast",
    brandName: "Asiliko Grok Fast 2.5",
    description: "Tezkor javoblar uchun optimallashtirilgan",
  },
];

export type AllowedModelId = (typeof ALLOWED_MODELS)[number]["id"];

const ALLOWED_MODEL_MAP = new Map<string, AllowedModel>(
  ALLOWED_MODELS.map((model) => [model.id, model]),
);

export const isAllowedModelId = (id: string): boolean =>
  ALLOWED_MODEL_MAP.has(id);

export const getAllowedModel = (id: string): AllowedModel | undefined =>
  ALLOWED_MODEL_MAP.get(id);
