import { useState, useEffect, useCallback } from 'react';
import StorageManager from '../storage';
import type { StorageData } from '../types';

/**
 * Hook para acessar e observar dados do Chrome Storage
 */
export function useStorage<K extends keyof StorageData>(
  key: K
): [StorageData[K] | undefined, (value: StorageData[K]) => Promise<void>, boolean] {
  const [value, setValue] = useState<StorageData[K] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Carregar valor inicial
  useEffect(() => {
    const loadValue = async () => {
      try {
        const data = await StorageManager.get(key);
        setValue(data[key]);
      } catch (error) {
        console.error(`Error loading storage key "${key}":`, error);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  // Observar mudanças
  useEffect(() => {
    const handleChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    StorageManager.addListener(handleChange);

    // Cleanup não é possível com a API atual do StorageManager
    // TODO: Implementar removeListener no StorageManager
  }, [key]);

  // Função para atualizar valor
  const updateValue = useCallback(
    async (newValue: StorageData[K]) => {
      try {
        await StorageManager.set({ [key]: newValue } as any);
        setValue(newValue);
      } catch (error) {
        console.error(`Error updating storage key "${key}":`, error);
        throw error;
      }
    },
    [key]
  );

  return [value, updateValue, loading];
}

/**
 * Hook para acessar configurações
 */
export function useSettings() {
  return useStorage('settings');
}

/**
 * Hook para acessar contatos
 */
export function useContacts() {
  return useStorage('contacts');
}

/**
 * Hook para acessar lembretes
 */
export function useReminders() {
  return useStorage('reminders');
}

/**
 * Hook para acessar analytics
 */
export function useAnalytics() {
  return useStorage('analytics');
}

/**
 * Hook genérico para qualquer chave do storage com transformação
 */
export function useStorageValue<K extends keyof StorageData, T = StorageData[K]>(
  key: K,
  transform?: (value: StorageData[K] | undefined) => T
): [T | undefined, (value: StorageData[K]) => Promise<void>, boolean] {
  const [rawValue, updateValue, loading] = useStorage(key);

  const transformedValue = transform && rawValue !== undefined
    ? transform(rawValue)
    : (rawValue as any as T);

  return [transformedValue, updateValue, loading];
}
