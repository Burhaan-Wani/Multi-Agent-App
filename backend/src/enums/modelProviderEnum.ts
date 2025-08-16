export const modelProviderEnum = {
    GEMINI_FLASH: "gemini-flash",
    GEMINI_PRO: "gemini-pro",
    DEEPSEEK: "deepseek",
};

export type modelProviderEnumType =
    (typeof modelProviderEnum)[keyof typeof modelProviderEnum];
