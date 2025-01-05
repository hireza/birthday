import dotenv from "dotenv";

dotenv.config({ path: "./local.env" });

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  TEMPORAL_HOST,
  MESSAGE_BIRTHDAY_HOUR,
  MESSAGE_BIRTHDAY_MINUTE,
} = process.env;

interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

interface MessageConfig {
  birthday: {
    hour: number;
    minute: number;
  };
}

interface TemporalConfig {
  address: string;
}

export const config = {
  database: {
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: parseInt(POSTGRES_PORT || "5432", 10),
  } as DatabaseConfig,
  temporal: {
    address: TEMPORAL_HOST,
  } as TemporalConfig,
  message: {
    birthday: {
      hour: parseInt(MESSAGE_BIRTHDAY_HOUR || "9", 10),
      minute: parseInt(MESSAGE_BIRTHDAY_MINUTE || "0", 10),
    },
  } as MessageConfig,
};
