import AgentConfig, { IAgentConfig } from "../models/AgentConfig.model.js";
import {
    callGeminiPro,
    callGeminiFlash,
    callDeepSeek,
} from "../services/llmServices.js";

export const runAllLLMAgents = async (userQuery: string) => {
    const agents: IAgentConfig[] = await AgentConfig.find({});
    return Promise.all(
        agents.map(async agent => {
            let responseText = "";
            switch (agent.modelProvider) {
                case "deepseek":
                    responseText = await callDeepSeek(
                        agent.modelName,
                        agent.personaPrompt,
                        userQuery
                    );
                    break;
                case "gemini-pro":
                    responseText = await callGeminiPro(
                        agent.modelName,
                        agent.personaPrompt,
                        userQuery
                    );
                    break;
                case "gemini-flash":
                    responseText = await callGeminiFlash(
                        agent.modelName,
                        agent.personaPrompt,
                        userQuery
                    );
                    break;
                default:
                    throw new Error(
                        `Unsupported LLM provider: ${agent.modelProvider}`
                    );
            }
            return {
                agentName: agent.name,
                provider: agent.modelProvider,
                model: agent.modelName,
                response: responseText,
            };
        })
    );
};
