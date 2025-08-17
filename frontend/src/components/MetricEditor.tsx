// src/components/MetricEditor.tsx
import { Metric } from "../types/evaluation";
import { Trash2, PlusCircle, AlertCircle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";

type MetricsEditorProps = {
    metrics: Metric[];
    setMetrics: (metrics: Metric[]) => void;
};

export default function MetricsEditor({
    metrics,
    setMetrics,
}: MetricsEditorProps) {
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (
        index: number,
        field: keyof Metric,
        value: string | number
    ) => {
        const updated = [...metrics];
        if (field === "weight") {
            const parsed = parseFloat(value.toString());
            updated[index][field] = isNaN(parsed) ? 0 : parsed;
        } else {
            updated[index][field] = value as string;
        }
        setMetrics(updated);
    };

    const removeMetric = (index: number) => {
        setMetrics(metrics.filter((_, i) => i !== index));
    };

    const addMetric = () => {
        setMetrics([...metrics, { name: "", description: "", weight: 0 }]);
    };

    useEffect(() => {
        const newErrors: string[] = [];
        metrics.forEach((m, idx) => {
            if (!m.name.trim())
                newErrors.push(`Metric #${idx + 1}: Name is required`);
            if (m.weight < 0 || m.weight > 1)
                newErrors.push(`Metric #${idx + 1}: Weight must be 0-1`);
        });
        const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
        if (Math.abs(1 - totalWeight) > 0.001) {
            newErrors.push(
                `Total weight must be 1 (current: ${totalWeight.toFixed(2)})`
            );
        }
        setErrors(newErrors);
    }, [metrics]);

    return (
        <section className="space-y-3">
            {errors.length > 0 && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 space-y-1 dark:border-red-500/30 dark:bg-red-900/50">
                    {errors.map((err, i) => (
                        <p
                            key={i}
                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                        >
                            <AlertCircle size={14} />
                            {err}
                        </p>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                {metrics.map((metric, idx) => (
                    <Card
                        key={idx}
                        className="relative bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 py-2"
                    >
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="space-y-1 col-span-3">
                                        <Label
                                            htmlFor={`name-${idx}`}
                                            className="text-xs text-slate-600 dark:text-slate-400"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id={`name-${idx}`}
                                            type="text"
                                            value={metric.name}
                                            onChange={e =>
                                                handleChange(
                                                    idx,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. Relevance"
                                            className="h-9 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <Label
                                            htmlFor={`weight-${idx}`}
                                            className="text-xs text-slate-600 dark:text-slate-400"
                                        >
                                            Weight
                                        </Label>
                                        <Input
                                            id={`weight-${idx}`}
                                            type="number"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={metric.weight}
                                            onChange={e =>
                                                handleChange(
                                                    idx,
                                                    "weight",
                                                    e.target.value
                                                )
                                            }
                                            className="h-9 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label
                                        htmlFor={`desc-${idx}`}
                                        className="text-xs text-slate-600 dark:text-slate-400"
                                    >
                                        Description
                                    </Label>
                                    <Input
                                        id={`desc-${idx}`}
                                        type="text"
                                        value={metric.description}
                                        onChange={e =>
                                            handleChange(
                                                idx,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Briefly describe the metric"
                                        className="h-9 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <button
                            type="button"
                            onClick={() => removeMetric(idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                        >
                            <Trash2 size={16} />
                        </button>
                    </Card>
                ))}
            </div>

            <Button
                variant="outline"
                onClick={addMetric}
                className="w-full border-dashed text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
            >
                <PlusCircle size={16} className="mr-2" />
                Add Metric
            </Button>
        </section>
    );
}
