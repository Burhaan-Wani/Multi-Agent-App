import { LeaderboardItem } from "@/types/evaluation";

type Props = { leaderboard: LeaderboardItem[] };

export default function Leaderboard({ leaderboard }: Props) {
    return (
        <section className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-100 font-semibold text-gray-700">
                        <tr>
                            <th className="px-4 py-2">Agent</th>
                            <th className="px-4 py-2">Provider</th>
                            <th className="px-4 py-2">Total Score</th>
                            <th className="px-4 py-2">Average Score</th>
                            <th className="px-4 py-2">Judges</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((item, i) => (
                            <tr
                                key={i}
                                className={`border-t ${
                                    i === 0 ? "bg-green-50 font-bold" : ""
                                }`}
                            >
                                <td className="px-4 py-2">{item.agentName}</td>
                                <td className="px-4 py-2">{item.provider}</td>
                                <td className="px-4 py-2">
                                    {item.totalScore.toFixed(2)}
                                </td>
                                <td className="px-4 py-2">
                                    {item.averageScore.toFixed(2)}
                                </td>
                                <td className="px-4 py-2">{item.numJudges}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
