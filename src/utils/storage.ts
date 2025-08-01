// Utilitários para gerenciamento de dados locais
export const STORAGE_KEYS = {
  USER: 'user',
  TEMPLES: 'temples',
  USERS: 'users',
  MEDIUMS: 'mediums',
  SUPPLIERS: 'suppliers',
  FINANCIAL_RECORDS: 'financial_records',
  EVENTS: 'events',
  NOTIFICATIONS: 'notifications',
  SMTP_CONFIG: 'smtp_config',
  THEME: 'theme',
  REMEMBER_ME: 'rememberMe'
} as const;

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
};

export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Backup e restore de dados
export const exportData = (): string => {
  const data: Record<string, any> = {};
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        data[key] = JSON.parse(item);
      } catch {
        data[key] = item;
      }
    }
  });
  
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        setStorageItem(key, value);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};