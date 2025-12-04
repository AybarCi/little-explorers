import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    try {
      (globalThis as any)?.frameworkReady?.();
    } catch {}
  }, []);
}
