export const modelProviderEnum = {
    GEMINI_FLASH: "gemini-flash",
    // OPEN_AI: "openai",
    DEEPSEEK: "deepseek",
    QWEN: "qwen",
};

export type modelProviderEnumType =
    (typeof modelProviderEnum)[keyof typeof modelProviderEnum];
