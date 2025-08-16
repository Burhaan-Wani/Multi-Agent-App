import mongoose, { Schema, Document } from "mongoose";

export interface IMetric extends Document {
    name: string;
    description: string;
    weight: number;
}

export const MetricSchema: Schema<IMetric> = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 1 },
});

const Metric = mongoose.model<IMetric>("Metric", MetricSchema);

export default Metric;
