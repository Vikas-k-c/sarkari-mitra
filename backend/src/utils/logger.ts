type LogContext = Record<string, unknown>;

const write = (
  level: "info" | "error",
  message: string,
  context: LogContext = {}
): void => {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  });

  if (level === "error") {
    console.error(entry);
    return;
  }

  console.log(entry);
};

export const logger = {
  info: (message: string, context?: LogContext): void =>
    write("info", message, context),
  error: (message: string, context?: LogContext): void =>
    write("error", message, context),
};
