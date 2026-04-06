type EnvConfig = {
  DATABASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  ELASTICSEARCH_URL?: string;
};

const requiredServerVars = ["DATABASE_URL"] as const;
const requiredPublicVars = ["NEXT_PUBLIC_APP_URL"] as const;

function assertRequired(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getEnvConfig(): EnvConfig {
  const DATABASE_URL = assertRequired("DATABASE_URL", process.env.DATABASE_URL);
  const NEXT_PUBLIC_APP_URL = assertRequired(
    "NEXT_PUBLIC_APP_URL",
    process.env.NEXT_PUBLIC_APP_URL,
  );

  for (const key of requiredServerVars) {
    assertRequired(key, process.env[key]);
  }

  for (const key of requiredPublicVars) {
    assertRequired(key, process.env[key]);
  }

  const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;

  return {
    DATABASE_URL,
    NEXT_PUBLIC_APP_URL,
    ELASTICSEARCH_URL,
  };
}
