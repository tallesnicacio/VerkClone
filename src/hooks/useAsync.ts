import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Hook para gerenciar operações assíncronas
 */
export function useAsync<T = any>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  /**
   * Executa uma função assíncrona
   */
  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, error: null, loading: true });

    try {
      const data = await asyncFunction();
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, error: err, loading: false });
      throw err;
    }
  }, []);

  /**
   * Reseta o estado
   */
  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    execute,
    reset,
  };
}

/**
 * Hook simplificado para loading state
 */
export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const withLoading = useCallback(async <T,>(asyncFunction: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return [loading, withLoading, setLoading] as const;
}
