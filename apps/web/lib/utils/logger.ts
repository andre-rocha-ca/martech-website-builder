// ─── Structured Logger ──────────────────────────────────────

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  component: string;
  message: string;
  requestId?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel =
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

export function createLogger(component: string) {
  const log = (
    level: LogLevel,
    message: string,
    meta?: Partial<Omit<LogEntry, "timestamp" | "level" | "service" | "component" | "message">>
  ) => {
    if (!shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: "martech-website-builder",
      component,
      message,
      ...meta,
    };

    const output = formatEntry(entry);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  };

  return {
    debug: (msg: string, meta?: Record<string, unknown>) => log("debug", msg, { metadata: meta }),
    info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, { metadata: meta }),
    warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, { metadata: meta }),
    error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, { metadata: meta }),
    timed: async <T>(
      label: string,
      fn: () => Promise<T>,
      meta?: Record<string, unknown>
    ): Promise<T> => {
      const start = Date.now();
      try {
        const result = await fn();
        log("info", `${label} completed`, {
          duration: Date.now() - start,
          metadata: meta,
        });
        return result;
      } catch (err) {
        log("error", `${label} failed`, {
          duration: Date.now() - start,
          metadata: {
            ...meta,
            error: err instanceof Error ? err.message : String(err),
          },
        });
        throw err;
      }
    },
  };
}
