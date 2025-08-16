// models/AgentConfig.ts (extended)

import mongoose, { Schema, Document } from "mongoose";
import {
    modelProviderEnum,
    modelProviderEnumType,
} from "../enums/modelProviderEnum.js";

export interface IAgentConfig extends Document {
    name: string;
    personaPrompt: string;
    modelProvider: modelProviderEnumType;
    modelName: string; // LLM model name/version (e.g. "gpt-4", "gemini-2.5", "claude-4")
    createdAt: Date;
    updatedAt: Date;
}

const AgentConfigSchema: Schema<IAgentConfig> = new Schema({
    name: { type: String, required: true, unique: true },
    personaPrompt: { type: String, required: true },
    modelProvider: {
        type: String,
        required: true,
        enum: Object.values(modelProviderEnum),
    },
    modelName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const AgentConfig = mongoose.model<IAgentConfig>(
    "AgentConfig",
    AgentConfigSchema
);

export default AgentConfig;
