import { Construct } from "constructs";
import * as dotenv from "dotenv";

enum Stage {
  STAGING = "staging",
}
export const getEnv = (key: string, fallback = ""): string => {
  return process.env[key] ?? fallback;
};

const stage: Stage = process.env.STAGE as Stage;
dotenv.config({ path: `${__dirname}/.env.${stage}` });

export const getStage = (): Stage => stage;

export const getServiceName = (): string => getEnv("SERVICE_NAME");

export const getRegion = (): string => getEnv("REGION");

export const getAccount = (): string => getEnv("ACCOUNT");

// Compose BASE ENVS
export type BaseEnvs = {
  STAGE: string;
  REGION: string;
  LOG_CHANNEL: string;
  CACHE_PATH: string;
  VIEW_COMPILED_PATH: string;
  APP_NAME: string;
  APP_ENV: string;
  APP_DEBUG: string;
};

export const baseEnvs = (): BaseEnvs => ({
  STAGE: getStage(),
  REGION: getRegion(),
  LOG_CHANNEL: getEnv("LOG_CHANNEL"),
  CACHE_PATH: getEnv("CACHE_PATH"),
  VIEW_COMPILED_PATH: getEnv("VIEW_COMPILED_PATH"),
  APP_NAME: getEnv("APP_NAME"),
  APP_ENV: getEnv("APP_ENV"),
  APP_DEBUG: getEnv("APP_DEBUG"),
});
