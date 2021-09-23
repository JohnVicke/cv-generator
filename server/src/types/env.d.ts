declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    REDIS_SECRET: string;
    DATABASE_URI: string;
    REDIS_TLS_URL: string;
    CORS_ORIGIN: string;
  }
}