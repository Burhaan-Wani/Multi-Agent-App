interface MetricScore {
    score: number;
    rationale: string;
}

interface AgentEvaluation {
    scores: Record<string, MetricScore>; // metricName -> { score, rationale }
    totalScore: number; // weighted total score from judge
    rank: number;
}

interface PeerEvaluations {
    [judgeProvider: string]: {
        [targetAgentName: string]: AgentEvaluation;
    };
}

export interface AggregatedScore {
    agentName: string;
    provider: string;
    totalScore: number;
    averageScore: number;
    numJudges: number;
}

export function aggregatePeerScores(
    peerEvaluations: PeerEvaluations,
    responses: {
        agentName: string;
        provider: string;
        model: string;
        response: string;
    }[]
) {
    const scoreMap: Record<string, AggregatedScore> = {};

    // Initialize tracking for each provider from responses
    responses.forEach(r => {
        scoreMap[r.provider] = {
            agentName: r.agentName,
            provider: r.provider,
            totalScore: 0,
            averageScore: 0,
            numJudges: 0,
        };
    });

    // Loop through each judge's evaluations
    for (const judgeProvider in peerEvaluations) {
        const judgedResults = peerEvaluations[judgeProvider];

        for (const targetAgentName in judgedResults) {
            const evalData = judgedResults[targetAgentName];
            // Find the provider from agentName (match with responses list)
            const providerObj = responses.find(
                r => r.agentName === targetAgentName
            );
            if (!providerObj) continue;

            const targetProvider = providerObj.provider;

            scoreMap[targetProvider].totalScore += evalData.totalScore;
            scoreMap[targetProvider].numJudges += 1;
        }
    }

    // Calculate average scores
    let leaderboard = Object.values(scoreMap).map(agent => ({
        ...agent,
        averageScore:
            agent.numJudges > 0 ? agent.totalScore / agent.numJudges : 0,
    }));

    // Sort by averageScore descending
    leaderboard.sort((a, b) => b.averageScore - a.averageScore);

    return leaderboard;
}
