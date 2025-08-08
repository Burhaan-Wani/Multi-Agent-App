import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

import { providerEnum, providerEnumType } from "../enums/providerEnum.js";

export interface UserDocument extends Document {
    providerId: string;
    provider: providerEnumType;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePasswords: (password: string) => Promise<boolean>;
    omitPassword: () => Omit<UserDocument, "password">;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        providerId: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        provider: {
            type: String,
            enum: Object.values(providerEnum),
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password as string, 12);
});

userSchema.methods.comparePasswords = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.omitPassword = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
