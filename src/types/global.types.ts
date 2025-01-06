import { TUser } from "@/redux/features/auth/authSlice";
import { BaseQueryApi } from "@reduxjs/toolkit/query";

export type TError = {
  data: {
    message: string;
    success: boolean;
    stack: string;
  };
  status: number;
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export interface TAnimeDetails {
  title: string;
  description: string;
  episode: string;
  streamingLinks: { source: string; server: string; link: string }[];
  releaseDate: string;
  slug: string;
  nextEpisode: string | null;
  previousEpisode: string | null;
}

export interface TExternalAPi extends TAnimeDetails {
  schedule: { day: string[]; time: string };
  status: "ongoing" | "completed";
  isDeleted: boolean;
  user: TUser;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
