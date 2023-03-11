import { Types } from "mongoose";

export interface User {
  _id: Types.ObjectId;
  userName: string;
  displayName: string;
  profileImageUrl: string | null;
  password?: string | null;
  userType: string;
}

export interface Post {
  _id: Types.ObjectId;
  title: string;
  content: string;
  published: boolean;
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
  user: Types.ObjectId;
}

export interface Like {
  any: Types.ObjectId;
  user: Types.ObjectId;
}

export interface Comment {
  _id: Types.ObjectId;
  content: string;
  nesting: number;
  edited: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: Types.ObjectId;
  any: Types.ObjectId;
  superAny?: Types.ObjectId;
}
