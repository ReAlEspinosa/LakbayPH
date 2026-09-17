const DB_NAME = 'LakbayFitness';
const DB_VERSION = 1;

const DEFAULT_EXERCISES = [
  { id: 'bench-press', name: 'Bench Press', category: 'Chest', bodyPart: 'chest' },
  { id: 'incline-bench', name: 'Incline Bench Press', category: 'Chest', bodyPart: 'chest' },
  { id: 'push-ups', name: 'Push-ups', category: 'Chest', bodyPart: 'chest' },
  { id: 'chest-fly', name: 'Chest Fly', category: 'Chest', bodyPart: 'chest' },
  { id: 'pull-ups', name: 'Pull-ups', category: 'Back', bodyPart: 'back' },
  { id: 'barbell-row', name: 'Barbell Row', category: 'Back', bodyPart: 'back' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'Back', bodyPart: 'back' },
  { id: 'deadlift', name: 'Deadlift', category: 'Back', bodyPart: 'back' },
  { id: 'ohp', name: 'Overhead Press', category: 'Shoulders', bodyPart: 'shoulders' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'Shoulders', bodyPart: 'shoulders' },
  { id: 'face-pull', name: 'Face Pull', category: 'Shoulders', bodyPart: 'shoulders' },
  { id: 'bicep-curl', name: 'Bicep Curl', category: 'Arms', bodyPart: 'arms' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'Arms', bodyPart: 'arms' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'Arms', bodyPart: 'arms' },
  { id: 'tricep-dip', name: 'Tricep Dip', category: 'Arms', bodyPart: 'arms' },
  { id: 'squat', name: 'Squat', category: 'Legs', bodyPart: 'legs' },
  { id: 'leg-press', name: 'Leg Press', category: 'Legs', bodyPart: 'legs' },
  { id: 'lunges', name: 'Lunges', category: 'Legs', bodyPart: 'legs' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'Legs', bodyPart: 'legs' },
  { id: 'calf-raise', name: 'Calf Raise', category: 'Legs', bodyPart: 'legs' },
  { id: 'plank', name: 'Plank', category: 'Core', bodyPart: 'core' },
  { id: 'crunches', name: 'Crunches', category: 'Core', bodyPart: 'core' },
  { id: 'leg-raise', name: 'Leg Raise', category: 'Core', bodyPart: 'core' },
  { id: 'russian-twist', name: 'Russian Twist', category: 'Core', bodyPart: 'core' },
  { id: 'running', name: 'Running', category: 'Cardio', bodyPart: 'cardio' },
  { id: 'cycling', name: 'Cycling', category: 'Cardio', bodyPart: 'cardio' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'Cardio', bodyPart: 'cardio' },
  { id: 'burpees', name: 'Burpees', category: 'Cardio', bodyPart: 'cardio' },
  // Beginner routine (see routines.js).
  { id: 'low-incline-db-press', name: 'Low Incline Dumbbell Press', category: 'Chest', bodyPart: 'chest' },
  { id: 'goblet-squat', name: 'Goblet Squat', category: 'Legs', bodyPart: 'legs' },
  { id: 'neutral-grip-pull-ups', name: 'Neutral Grip Pull-Ups', category: 'Back', bodyPart: 'back' },
  { id: 'db-romanian-deadlift', name: 'Dumbbell Romanian Deadlift', category: 'Legs', bodyPart: 'legs' },
  { id: 'cable-row', name: 'Cable Row', category: 'Back', bodyPart: 'back' },
  { id: 'lateral-raise-superset', name: 'Lateral Raise Superset', category: 'Shoulders', bodyPart: 'shoulders' },
  { id: 'dead-bug', name: 'Dead Bug', category: 'Core', bodyPart: 'core' },
  { id: 'arms-superset', name: 'Arms Superset', category: 'Arms', bodyPart: 'arms' },
];

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined' || indexedDB === null) {
      reject(new Error('This browser has no IndexedDB. Private browsing may be blocking storage.'));
      return;
    }
    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err);
      return;
    }
    request.onerror = () => reject(request.error || new Error('Could not open the local database.'));
    request.onblocked = () => reject(new Error('Another open tab is blocking a database upgrade. Close it and reload.'));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('workouts')) {
        const ws = db.createObjectStore('workouts', { keyPath: 'id' });
        ws.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains('exercises')) {
        db.createObjectStore('exercises', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('bodyWeight')) {
        const bw = db.createObjectStore('bodyWeight', { keyPath: 'id' });
        bw.createIndex('date', 'date', { unique: false });
      }
    };
  });
}

function getExerciseIds(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('exercises', 'readonly');
    const req = tx.objectStore('exercises').getAllKeys();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function ensureDefaultExercises() {
  const db = await openDB();
  try {
    // Backfill by id rather than skipping a non-empty store: a device seeded
    // before this list grew would otherwise never see the new exercises, and
    // a bumped DB_VERSION cannot help - the upgrade already ran there.
    const existing = new Set(await getExerciseIds(db));
    const missing = DEFAULT_EXERCISES.filter(ex => !existing.has(ex.id));
    if (missing.length === 0) return;
    // Seed in its own transaction. Awaiting between the read and the put()s
    // inside a single transaction relies on it still being active after a
    // microtask checkpoint, which is fragile across browsers - so don't.
    await new Promise((resolve, reject) => {
      const tx = db.transaction('exercises', 'readwrite');
      const store = tx.objectStore('exercises');
      for (const ex of missing) store.put(ex);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export async function initDB() {
  await ensureDefaultExercises();
}

export async function getExercises() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('exercises', 'readonly');
    const req = tx.objectStore('exercises').getAll();
    req.onsuccess = () => { resolve(req.result); db.close(); };
    req.onerror = () => { reject(req.error); db.close(); };
  });
}

export async function addCustomExercise(exercise) {
  const db = await openDB();
  const tx = db.transaction('exercises', 'readwrite');
  tx.objectStore('exercises').put(exercise);
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => { resolve(); db.close(); };
    tx.onerror = () => { reject(tx.error); db.close(); };
  });
}

export async function saveWorkout(workout) {
  const db = await openDB();
  const tx = db.transaction('workouts', 'readwrite');
  tx.objectStore('workouts').put(workout);
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => { resolve(); db.close(); };
    tx.onerror = () => { reject(tx.error); db.close(); };
  });
}

export async function getWorkouts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('workouts', 'readonly');
    const req = tx.objectStore('workouts').getAll();
    req.onsuccess = () => {
      const sorted = req.result.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(sorted);
      db.close();
    };
    req.onerror = () => { reject(req.error); db.close(); };
  });
}

export async function getWorkout(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('workouts', 'readonly');
    const req = tx.objectStore('workouts').get(id);
    req.onsuccess = () => { resolve(req.result); db.close(); };
    req.onerror = () => { reject(req.error); db.close(); };
  });
}

export async function deleteWorkout(id) {
  const db = await openDB();
  const tx = db.transaction('workouts', 'readwrite');
  tx.objectStore('workouts').delete(id);
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => { resolve(); db.close(); };
    tx.onerror = () => { reject(tx.error); db.close(); };
  });
}

export async function saveBodyWeight(entry) {
  const db = await openDB();
  const tx = db.transaction('bodyWeight', 'readwrite');
  tx.objectStore('bodyWeight').put(entry);
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => { resolve(); db.close(); };
    tx.onerror = () => { reject(tx.error); db.close(); };
  });
}

export async function getBodyWeights() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bodyWeight', 'readonly');
    const req = tx.objectStore('bodyWeight').getAll();
    req.onsuccess = () => {
      const sorted = req.result.sort((a, b) => new Date(a.date) - new Date(b.date));
      resolve(sorted);
      db.close();
    };
    req.onerror = () => { reject(req.error); db.close(); };
  });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* Active-workout draft.
 *
 * Kept in localStorage rather than IndexedDB on purpose: it is written on
 * every keystroke and needs to survive the tab being evicted while the phone
 * is locked mid-set, so a synchronous write is the right trade. Storage can
 * throw (Safari private browsing, quota), and a failed draft save must never
 * take the workout down with it.
 */
const DRAFT_KEY = 'lakbay-fitness:active-workout';

export function saveDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || !Array.isArray(draft.exercises)) return null;
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nothing to do - an undeletable draft is harmless */
  }
}
