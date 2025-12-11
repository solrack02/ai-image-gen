// Simple IndexedDB helper to persist generation data without localStorage quota issues.
const DB_NAME = "fissium_generation_db";
const DB_STORE = "generation";
const DB_VERSION = 1;

type GenerationPayload = {
  prompt: string;
  images: { data: string; prompt: string }[];
};

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const put = async (key: string, value: GenerationPayload) => {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB_STORE).put(value, key);
  });
};

const get = async (key: string) => {
  const db = await openDb();
  return new Promise<GenerationPayload | undefined>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    tx.onerror = () => reject(tx.error);
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result as GenerationPayload | undefined);
    req.onerror = () => reject(req.error);
  });
};

export const saveGeneration = async (
  key: string,
  payload: GenerationPayload
): Promise<void> => {
  try {
    await put(key, payload);
  } catch (err) {
    // Fallback to localStorage if IndexedDB fails.
    window.localStorage.setItem(key, JSON.stringify(payload));
    console.warn("IndexedDB indisponivel, usando localStorage", err);
  }
};

export const loadGeneration = async (
  key: string
): Promise<GenerationPayload | null> => {
  try {
    const stored = await get(key);
    if (stored) return stored;
  } catch (err) {
    console.warn("Falha ao ler IndexedDB, tentando localStorage", err);
  }
  try {
    const ls = window.localStorage.getItem(key);
    if (ls) return JSON.parse(ls) as GenerationPayload;
  } catch (err) {
    console.warn("Falha ao ler localStorage", err);
  }
  return null;
};

export type { GenerationPayload };
