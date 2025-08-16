import "dotenv/config";
import AgentConfig from "../models/AgentConfig.model.js";
import { connectDB } from "../config/db.config.js";
import { modelProviderEnum } from "../enums/modelProviderEnum.js";

await connectDB();
const agentConfig = [
    {
        name: "Gemini Flash",
        modelProvider: modelProviderEnum.GEMINI_FLASH,
        modelName: "gemini-2.5-flash",
        personaPrompt: "You are a helpful assistant.",
    },
    {
        name: "Gemini Pro",
        modelProvider: modelProviderEnum.GEMINI_PRO,
        modelName: "gemini-2.5-pro",
        personaPrompt: "You are a helpful assistant.",
    },
    {
        name: "DeepSeek R1",
        modelProvider: modelProviderEnum.DEEPSEEK,
        modelName: "deepseek/deepseek-r1-0528:free",
        personaPrompt: "You are a helpful assistant.",
    },
];

async function seedAgentConfig() {
    await AgentConfig.deleteMany({});
    await AgentConfig.create(agentConfig);
    console.log("seeding finished");
    process.exit(1);
}

await seedAgentConfig();
