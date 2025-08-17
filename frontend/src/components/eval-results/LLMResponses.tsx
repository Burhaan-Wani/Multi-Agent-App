import { AgentResponse } from "@/types/evaluation";

type Props = { responses: AgentResponse[] };

export default function LLMResponses({ responses }: Props) {
    return (
        <section>
            <h3 className="text-xl font-semibold mb-4">LLM Responses</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {responses.map((r, idx) => (
                    <article
                        key={idx}
                        className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow whitespace-pre-wrap"
                        aria-label={`Response from ${r.agentName}`}
                    >
                        <h4 className="font-semibold mb-2 text-gray-800">
                            {r.agentName}{" "}
                            <span className="text-gray-500 text-sm">
                                ({r.provider})
                            </span>
                        </h4>
                        <p className="text-gray-600 text-sm">{r.response}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
