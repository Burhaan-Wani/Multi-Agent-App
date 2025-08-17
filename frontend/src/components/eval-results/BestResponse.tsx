import { LeaderboardItem } from "@/types/evaluation";

type Props = { bestResponse: LeaderboardItem };

export default function BestResponse({ bestResponse }: Props) {
    return (
        <div className="mt-6 p-4 bg-green-100 rounded-md border border-green-300">
            <h3 className="text-lg font-semibold text-green-900">
                Best Response
            </h3>
            <p className="text-green-800 text-sm mt-1">
                <strong>{bestResponse.agentName}</strong> from{" "}
                <em>{bestResponse.provider}</em> achieved the highest average
                score.
            </p>
        </div>
    );
}
