type TokenListener = (token: string | null) => void;

const listeners = new Set<TokenListener>();

export function onTokenChange(listener: TokenListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitTokenChange(token: string | null) {
  return listeners.forEach((listener) => listener(token));
}
