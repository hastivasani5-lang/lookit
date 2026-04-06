declare module "aos" {
  interface AOSSettings {
    duration?: number;
    once?: boolean;
    offset?: number;
    easing?: string;
    delay?: number;
    [key: string]: any;
  }

  export function init(settings?: AOSSettings): void;
  export function refresh(): void;
  export function refreshHard(): void;
}
