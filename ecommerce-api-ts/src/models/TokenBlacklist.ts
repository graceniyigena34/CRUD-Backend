import mongoose, { Schema, Document } from "mongoose";

export interface ITokenBlacklist extends Document {
  token: string;
  createdAt: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>({
  token: { type: String, required: true, unique: true },
}, { 
  timestamps: true,
  expires: 86400 // Auto-delete after 24 hours
});

export const TokenBlacklistModel = mongoose.model<ITokenBlacklist>("TokenBlacklist", tokenBlacklistSchema);