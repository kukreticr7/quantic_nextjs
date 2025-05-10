declare module 'bcryptjs' {
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hash(data: string, salt: number | string): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  export function hashSync(data: string, salt: string): string;
  export function compareSync(data: string, encrypted: string): boolean;
}
