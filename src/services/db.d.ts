export {};

declare module '../services/db' {
  export const db: {
    execSync: (query: string) => void;
    getFirstSync: (query: string, params?: any[]) => { count?: number };
    getAllSync: (query: string, params?: any[]) => any[];
    runSync: (query: string, params?: any[]) => void;
  };

  export function initDatabase(): void;
}
