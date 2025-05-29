import { Metadata } from "next";

import { env } from "./env";

export const applicationName: Metadata["title"] = "Nova - Productivity Tool";
export const applicationDescription: Metadata["description"] =
  "Boost your productivity with Nova, the ultimate Notion-like workspace for task management, note-taking, and collaboration.";
export const applicationKeywords: Metadata["keywords"] = [
  "Notion alternative",
  "productivity app",
  "task management",
  "note-taking app",
  "collaboration tools",
];
export const applicationOpenGraph: Metadata["openGraph"] = {
  title: applicationName,
  description: applicationDescription,
  images: "/nova-og.png",
};

export const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 1;
export const MAX_UPLOAD_IMAGE_SIZE = 1024 * 1024 * MAX_UPLOAD_IMAGE_SIZE_IN_MB; // 2 mb

export const SESSION_REFRESH_INTERVAL_S = 60 * 60 * 24 * 15; // 15 days
export const SESSION_MAX_DURATION_S = SESSION_REFRESH_INTERVAL_S * 2; // 30 days

export const MAX_PASSWORD_LENGTH = 24;
export const MIN_PASSWORD_LENGTH = 8;
export const RESET_PASSWORD_TOKEN_EXPIRES_IN_S = 60 * 10; // 10 min

export const VERIFICATION_OTP_LENGTH = 6;
export const VERIFICATION_OTP_EXPIRES_IN_S = 10 * 60; // 10 min

export const USER_REFETCH_INTERVAL = 1 * 60 * 1000; // 1 min in milliseconds

export const afterLoginUrl = `${env.NEXT_PUBLIC_URL}/`;

export const ACCEPTED_IMAGE_FILE_TYPE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg",
];
