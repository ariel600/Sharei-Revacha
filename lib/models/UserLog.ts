import mongoose, { Schema, type Model } from "mongoose";
import type { AuthLogStatus } from "@/types/shaarei";

export interface IUserLog {
  username: string;
  timestamp: Date;
  status: AuthLogStatus;
}

const UserLogSchema = new Schema<IUserLog>(
  {
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ["success", "failed"], required: true },
  },
  { collection: "userlogs" },
);

export const UserLog: Model<IUserLog> =
  mongoose.models.UserLog ?? mongoose.model<IUserLog>("UserLog", UserLogSchema);
