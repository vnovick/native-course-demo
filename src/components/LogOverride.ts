interface ConsoleLog {
  (...args: any[]): void;
}

declare global {
  interface Console {
    originalLog: ConsoleLog;
  }
}

const jsLogs: string[] = [];
const originalConsoleLog = console.log.bind(console);

console.log = (...args) => {
  jsLogs.push(args.join(' '));
  originalConsoleLog(...args);
};

export const getJsLogs = () => jsLogs;
