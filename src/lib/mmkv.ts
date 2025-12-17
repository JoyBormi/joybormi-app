import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Create a single MMKV instance
const storageMMKV = createMMKV();

// Create the Zustand-compatible storage object
export const storage: StateStorage = {
  setItem: (name, value) => {
    // MMKV only deals with strings, so we can store the raw string value
    return storageMMKV.set(name, value);
  },
  getItem: (name) => {
    // Retrieve the string value and return it (or null if not found)
    const value = storageMMKV.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storageMMKV.remove(name);
  },
};
