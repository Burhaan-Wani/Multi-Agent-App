import {
    callDeepSeek,
    callGeminiFlash,
    callQwenai,
} from "../services/llmServices.js";

export async function peerEvaluateLLMResponses(
    query: string,
    agentResponses: {
        agentName: string;
        provider: string;
        model: string;
        response: string;
    }[],
    metrics: { name: string; description: string; weight: number }[]
) {
    const evaluations: Record<string, any> = {};

    // Loop: each LLM acts as judge for other providers' responses
    for (const judge of agentResponses) {
        // Responses excluding this judge's own response
        const others = agentResponses.filter(
            r => !(r.agentName === judge.agentName && r.model === judge.model)
        );

        // Build evaluator prompt
        const prompt = `
You are acting as an impartial evaluator.

User submitted the query: "${query}"

Here are responses from other LLM providers (excluding your own):

${others
    .map(r => `Agent: ${r.agentName} \nResponse: ${r.response}`)
    .join("\n\n")}

Evaluation Metrics:
${metrics
    .map(
        m => `- ${m.name.toUpperCase()} (Weight: ${m.weight}): ${m.description}`
    )
    .join("\n")}

For EACH response, score it (1-10) per metric with rationale, calculate weighted total score, and rank. 
Return ONLY JSON in this format:

{
  "agentName": {
    "scores": {
      "metricName": { "score": X, "rationale": "..." }
    },
    "totalScore": Y,
    "rank": Z
  },
  ...
}
    `.trim();

        // Call the judge's own LLM API
        let rawResult = "";
        switch (judge.provider) {
            case "qwen":
                rawResult = await callQwenai(
                    judge.model,
                    "You are an expert evaluator.",
                    prompt
                );
                break;
            case "gemini-flash":
                rawResult = await callGeminiFlash(
                    judge.model,
                    "You are an expert evaluator.",
                    prompt
                );
                break;
            case "deepseek":
                rawResult = await callDeepSeek(
                    judge.model,
                    "You are an expert evaluator.",
                    prompt
                );
                break;
            default:
                throw new Error(`Unknown provider: ${judge.provider}`);
        }

        // Extract JSON from result
        const match = rawResult.match(/\{[\s\S]*\}/);
        evaluations[judge.provider] = match ? JSON.parse(match[0]) : {};
        // evaluations[judge.provider] = match ? JSON.parse(match[0]) : {};
    }

    return evaluations; // { openai: {...}, gemini: {...}, anthropic: {...} }
}
