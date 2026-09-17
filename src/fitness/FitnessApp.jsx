import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dumbbell, Plus, Play, Clock, ChevronLeft, Trash2,
  Check, Calendar, Home, BarChart3,
  X, Timer, RotateCcw, ChevronRight, Save, AlertTriangle
} from 'lucide-react';
import {
  initDB, getExercises, saveWorkout, getWorkouts, getWorkout,
  deleteWorkout, saveBodyWeight, getBodyWeights, generateId, addCustomExercise,
  saveDraft, loadDraft, clearDraft
} from './db';
import { ROUTINES, buildRoutineDraft } from './routines';

const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

const CATEGORY_EMOJI = {
  Chest: '\u{1F4AA}', Back: '\u{1F9B4}', Shoulders: '\u{1F3CB}', Arms: '\u{1F4AA}',
  Legs: '\u{1F9B5}', Core: '\u{1F525}', Cardio: '\u{1F3C3}', Custom: '\u{2B50}'
};

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (today - target) / (1000 * 60 * 60 * 24);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${Math.floor(diff)} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function getTotalVolume(workout) {
  let vol = 0;
  for (const ex of workout.exercises || []) {
    for (const set of ex.sets || []) {
      if (set.completed) vol += (set.reps || 0) * (set.weight || 0);
    }
  }
  return vol;
}

function getTotalSets(workout) {
  let count = 0;
  for (const ex of workout.exercises || []) {
    for (const set of ex.sets || []) {
      if (set.completed) count++;
    }
  }
  return count;
}

function getStreak(workouts) {
  if (!workouts.length) return 0;
  const dates = [...new Set(workouts.map(w => {
    const d = new Date(w.date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }))];
  const now = new Date();
  let streak = 0;
  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
  if (!dates.includes(todayKey)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  while (true) {
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (dates.includes(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function RestTimer({ onClose }) {
  const [duration, setDuration] = useState(90);
  const [time, setTime] = useState(90);
  const [running, setRunning] = useState(true);
  const deadlineRef = useRef(Date.now() + 90 * 1000);
  const firedRef = useRef(false);

  const start = useCallback((seconds) => {
    firedRef.current = false;
    deadlineRef.current = Date.now() + seconds * 1000;
    setDuration(seconds);
    setTime(seconds);
    setRunning(true);
  }, []);

  // Tick against a wall-clock deadline. A plain setInterval countdown drifts,
  // and browsers throttle timers hard once the screen locks or the tab is
  // backgrounded - which is exactly when a rest timer is running.
  useEffect(() => {
    if (!running) return undefined;
    const tick = () => {
      const remaining = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setTime(remaining);
      if (remaining === 0) {
        setRunning(false);
        if (!firedRef.current) {
          firedRef.current = true;
          try { navigator.vibrate?.(300); } catch { /* unsupported - not worth surfacing */ }
        }
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running]);

  // Resync the moment the tab comes back, so a throttled timer isn't stale.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && running) {
        setTime(Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000)));
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [running]);

  const toggleRunning = () => {
    if (running) {
      setRunning(false);
    } else {
      deadlineRef.current = Date.now() + time * 1000;
      setRunning(true);
    }
  };

  const presets = [30, 60, 90, 120, 180];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Rest Timer</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold tabular-nums ${time === 0 ? 'text-green-600' : 'text-ocean'}`}>
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </div>
          {time === 0 && <p className="text-green-600 font-medium mt-2">Time's up!</p>}
        </div>
        <div className="flex gap-2 justify-center mb-6">
          {presets.map(p => (
            <button key={p} onClick={() => start(p)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${duration === p ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600'}`}>
              {p}s
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={toggleRunning} disabled={time === 0}
            className="flex-1 py-3 rounded-xl font-semibold bg-ocean text-white disabled:opacity-40">
            {running ? 'Pause' : 'Resume'}
          </button>
          <button onClick={() => start(duration)} aria-label="Restart timer"
            className="p-3 rounded-xl bg-gray-100 text-gray-600">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ExercisePicker({ exercises, onSelect, onClose, onAddCustom }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Chest');

  const filtered = exercises.filter(e => {
    const matchCat = category === 'All' || e.category === category;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const ex = {
      id: 'custom-' + generateId(),
      name: customName.trim(),
      category: customCategory,
      bodyPart: customCategory.toLowerCase(),
      custom: true
    };
    onAddCustom(ex);
    setShowCustom(false);
    setCustomName('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-slide-up">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Add Exercise</h3>
            <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
          </div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..." autoFocus
            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30" />
        </div>
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {showCustom ? (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-3">
              <input type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                placeholder="Exercise name" autoFocus
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30" />
              <select value={customCategory} onChange={e => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddCustom} className="flex-1 py-2 rounded-lg bg-ocean text-white text-sm font-medium">Add</button>
                <button onClick={() => setShowCustom(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => setShowCustom(true)}
                className="w-full mt-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-ocean hover:text-ocean transition-colors">
                <Plus size={16} /> Create Custom Exercise
              </button>
              {filtered.map(ex => (
                <button key={ex.id} onClick={() => onSelect(ex)}
                  className="w-full text-left py-3 px-1 border-b border-gray-50 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-xl">{CATEGORY_EMOJI[ex.category] || '\u{1F3CB}'}</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{ex.name}</div>
                    <div className="text-xs text-gray-400">{ex.category}</div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-lg flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-sand" />
        <p className="text-sm flex-1">{message}</p>
        <button onClick={onDismiss} aria-label="Dismiss" className="shrink-0 text-gray-400">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function RoutineCard({ routine, onStart }) {
  const [open, setOpen] = useState(false);
  const setCount = routine.exercises.reduce((n, ex) => n + ex.sets, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-lg bg-palm/10 flex items-center justify-center text-palm shrink-0">
          <Dumbbell size={20} />
        </div>
        <button onClick={() => setOpen(o => !o)} className="flex-1 min-w-0 text-left">
          <div className="font-semibold text-gray-800 text-sm">{routine.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {routine.note} · {setCount} sets
          </div>
        </button>
        <button onClick={() => onStart(routine)}
          className="px-3 py-1.5 rounded-lg bg-ocean text-white text-xs font-semibold shrink-0 active:scale-95 transition-transform">
          Start routine
        </button>
        <button onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Hide exercises' : 'Show exercises'}
          className="p-1 text-gray-300 shrink-0">
          <ChevronRight size={16} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 -mt-1">
          {routine.exercises.map((ex, i) => (
            <div key={ex.exerciseId}
              className={`flex items-baseline gap-2 py-1.5 text-sm ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              {ex.addOn && <span className="text-[10px] uppercase tracking-wide text-sunset font-semibold">Add-on</span>}
              <span className="flex-1 min-w-0 text-gray-700 truncate">{ex.name}</span>
              <span className="text-xs text-gray-400 tabular-nums shrink-0">{ex.sets} × {ex.target}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardView({ workouts, onStartWorkout, onStartRoutine, onViewWorkout }) {
  const streak = getStreak(workouts);
  const thisWeek = workouts.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return d >= weekAgo;
  });
  const totalVolThisWeek = thisWeek.reduce((sum, w) => sum + getTotalVolume(w), 0);

  return (
    <div className="pb-24 px-4">
      <div className="pt-6 pb-4">
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>
          Fitness Log
        </h1>
      </div>

      <button onClick={onStartWorkout}
        className="w-full py-4 rounded-2xl font-semibold text-white text-lg flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #0e6d8c, #0a5670)' }}>
        <Play size={22} fill="white" /> Start Workout
      </button>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-sunset">{streak}</div>
          <div className="text-xs text-gray-500 mt-0.5">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-ocean">{thisWeek.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">This Week</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-palm">{totalVolThisWeek > 1000 ? `${(totalVolThisWeek / 1000).toFixed(1)}k` : totalVolThisWeek}</div>
          <div className="text-xs text-gray-500 mt-0.5">Volume (kg)</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Routines</h2>
        <div className="space-y-2">
          {ROUTINES.map(r => (
            <RoutineCard key={r.id} routine={r} onStart={onStartRoutine} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Workouts</h2>
        {workouts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Dumbbell size={48} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No workouts yet</p>
            <p className="text-sm mt-1">Tap "Start Workout" to begin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {workouts.slice(0, 10).map(w => (
              <button key={w.id} onClick={() => onViewWorkout(w.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left flex items-center gap-4 active:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center text-ocean">
                  <Dumbbell size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {w.name || 'Workout'}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {formatDate(w.date)} · {w.exercises?.length || 0} exercises · {getTotalSets(w)} sets
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {w.duration ? formatDuration(w.duration) : ''}
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveWorkoutView({ onFinish, onCancel, onError, exerciseList, draft }) {
  const [exercises, setExercises] = useState(() => draft?.exercises ?? []);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [workoutName, setWorkoutName] = useState(() => draft?.name ?? '');
  const [allExercises, setAllExercises] = useState(exerciseList);
  const [confirmCancel, setConfirmCancel] = useState(false);
  // Resuming a draft keeps its original start time so the duration stays honest.
  const startTime = useRef(draft?.startedAt ?? Date.now());
  const timerRef = useRef(null);

  // Derive elapsed time from the start timestamp rather than counting ticks:
  // setInterval is throttled while the screen is locked, and a workout timer
  // that silently loses ten minutes is worse than no timer.
  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startTime.current) / 1000)));
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Autosave the in-progress workout. Mobile browsers evict backgrounded tabs
  // without warning; without this, locking the phone mid-set loses the session.
  useEffect(() => {
    saveDraft({ name: workoutName, exercises, startedAt: startTime.current });
  }, [workoutName, exercises]);

  const addExercise = (ex) => {
    setExercises(prev => [...prev, {
      exerciseId: ex.id,
      name: ex.name,
      category: ex.category,
      sets: [{ reps: '', weight: '', completed: false }]
    }]);
    setShowPicker(false);
  };

  const handleAddCustom = async (ex) => {
    try {
      await addCustomExercise(ex);
      setAllExercises(prev => [...prev, ex]);
      addExercise(ex);
    } catch (err) {
      onError(err?.message || 'Could not save that custom exercise.');
    }
  };

  const addSet = (exIdx) => {
    setExercises(prev => {
      const next = [...prev];
      const lastSet = next[exIdx].sets[next[exIdx].sets.length - 1];
      next[exIdx] = {
        ...next[exIdx],
        sets: [...next[exIdx].sets, { reps: lastSet?.reps || '', weight: lastSet?.weight || '', completed: false }]
      };
      return next;
    });
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    setExercises(prev => {
      const next = [...prev];
      const sets = [...next[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], [field]: value };
      next[exIdx] = { ...next[exIdx], sets };
      return next;
    });
  };

  const toggleSet = (exIdx, setIdx) => {
    setExercises(prev => {
      const next = [...prev];
      const sets = [...next[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], completed: !sets[setIdx].completed };
      next[exIdx] = { ...next[exIdx], sets };
      return next;
    });
    if (!exercises[exIdx].sets[setIdx].completed) {
      setShowTimer(true);
    }
  };

  const removeExercise = (exIdx) => {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  };

  const removeSet = (exIdx, setIdx) => {
    setExercises(prev => {
      const next = [...prev];
      next[exIdx] = {
        ...next[exIdx],
        sets: next[exIdx].sets.filter((_, i) => i !== setIdx)
      };
      return next;
    });
  };

  const hasWork = exercises.length > 0;

  const requestCancel = () => {
    if (hasWork) setConfirmCancel(true);
    else discard();
  };

  const discard = () => {
    clearInterval(timerRef.current);
    clearDraft();
    onCancel();
  };

  const handleFinish = () => {
    if (!hasWork) {
      onError('Add at least one exercise before finishing.');
      return;
    }
    clearInterval(timerRef.current);
    const workout = {
      id: generateId(),
      name: workoutName || `Workout`,
      date: new Date().toISOString(),
      duration: elapsed,
      exercises: exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(s => ({
          ...s,
          reps: parseInt(s.reps) || 0,
          weight: parseFloat(s.weight) || 0
        }))
      }))
    };
    onFinish(workout);
  };

  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const totalVolume = exercises.reduce((sum, ex) =>
    sum + ex.sets.filter(s => s.completed).reduce((v, s) => v + (parseInt(s.reps) || 0) * (parseFloat(s.weight) || 0), 0), 0);

  return (
    <div className="pb-6 px-4 min-h-screen" style={{ background: 'linear-gradient(180deg, #f0f7fa 0%, #f9f7f3 30%)' }}>
      <div className="sticky top-0 z-30 pt-4 pb-3 -mx-4 px-4" style={{ background: 'linear-gradient(180deg, #f0f7fa 0%, #f0f7fa 80%, transparent)' }}>
        <div className="flex items-center justify-between">
          <button onClick={requestCancel} className="text-gray-500 text-sm font-medium">Cancel</button>
          <div className="flex items-center gap-2 text-ocean font-semibold">
            <Clock size={16} />
            <span className="tabular-nums">{formatDuration(elapsed)}</span>
          </div>
          <button onClick={handleFinish}
            className="px-4 py-1.5 rounded-lg bg-palm text-white text-sm font-semibold">
            Finish
          </button>
        </div>
      </div>

      <input type="text" value={workoutName} onChange={e => setWorkoutName(e.target.value)}
        placeholder="Workout name (optional)"
        className="w-full px-0 py-2 bg-transparent text-xl font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none border-b border-transparent focus:border-gray-200"
        style={{ fontFamily: '"Playfair Display", serif' }} />

      <div className="flex gap-4 mt-3 mb-4 text-sm">
        <span className="text-gray-500">{completedSets} sets</span>
        <span className="text-gray-500">{totalVolume > 0 ? `${totalVolume} kg vol` : ''}</span>
      </div>

      {exercises.map((ex, exIdx) => (
        <div key={exIdx} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{CATEGORY_EMOJI[ex.category] || '\u{1F3CB}'}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{ex.name}</h3>
              {ex.target && (
                <span className="text-[11px] text-gray-400 tabular-nums shrink-0">target {ex.target}</span>
              )}
            </div>
            <button onClick={() => removeExercise(exIdx)} className="text-gray-300 hover:text-red-400 p-1">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem_2rem] gap-2 text-xs text-gray-400 font-medium mb-1 px-1">
            <span>SET</span><span>KG</span><span>REPS</span><span></span><span></span>
          </div>

          {ex.sets.map((set, setIdx) => (
            <div key={setIdx} className={`grid grid-cols-[2rem_1fr_1fr_2.5rem_2rem] gap-2 items-center mb-1.5 px-1 py-1 rounded-lg ${set.completed ? 'bg-palm/5' : ''}`}>
              <span className="text-xs text-gray-400 font-medium text-center">{setIdx + 1}</span>
              <input type="number" inputMode="decimal" value={set.weight}
                onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                placeholder="0" className={`w-full px-2 py-1.5 rounded-lg text-center text-sm font-medium border focus:outline-none focus:ring-1 focus:ring-ocean/30 ${set.completed ? 'bg-palm/10 border-palm/20 text-palm' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
              <input type="number" inputMode="numeric" value={set.reps}
                onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                placeholder="0" className={`w-full px-2 py-1.5 rounded-lg text-center text-sm font-medium border focus:outline-none focus:ring-1 focus:ring-ocean/30 ${set.completed ? 'bg-palm/10 border-palm/20 text-palm' : 'bg-gray-50 border-gray-200 text-gray-800'}`} />
              <button onClick={() => toggleSet(exIdx, setIdx)}
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${set.completed ? 'bg-palm border-palm text-white' : 'border-gray-300 text-transparent hover:border-palm/50'}`}>
                <Check size={14} />
              </button>
              <button onClick={() => removeSet(exIdx, setIdx)} className="text-gray-300 hover:text-red-400 p-1">
                <X size={14} />
              </button>
            </div>
          ))}

          <button onClick={() => addSet(exIdx)}
            className="w-full mt-2 py-2 text-xs font-medium text-ocean bg-ocean/5 rounded-lg hover:bg-ocean/10 transition-colors">
            + Add Set
          </button>
        </div>
      ))}

      <button onClick={() => setShowPicker(true)}
        className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-ocean hover:text-ocean transition-colors active:bg-gray-50 mt-2">
        <Plus size={18} /> Add Exercise
      </button>

      <button onClick={() => setShowTimer(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-ocean text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-20">
        <Timer size={22} />
      </button>

      {showPicker && (
        <ExercisePicker exercises={allExercises} onSelect={addExercise}
          onClose={() => setShowPicker(false)} onAddCustom={handleAddCustom} />
      )}
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}

      {confirmCancel && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-800">Discard this workout?</h3>
            <p className="text-sm text-gray-500 mt-2">
              {exercises.length} exercise{exercises.length === 1 ? '' : 's'} and {completedSets} completed
              set{completedSets === 1 ? '' : 's'} will be lost. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmCancel(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700">
                Keep going
              </button>
              <button onClick={discard}
                className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutDetailView({ workoutId, onBack, onDelete }) {
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    getWorkout(workoutId).then(setWorkout);
  }, [workoutId]);

  if (!workout) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const volume = getTotalVolume(workout);
  const sets = getTotalSets(workout);

  return (
    <div className="pb-24 px-4">
      <div className="sticky top-0 z-30 pt-4 pb-3 -mx-4 px-4 bg-[#f9f7f3]">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-ocean text-sm font-medium">
            <ChevronLeft size={18} /> Back
          </button>
          <button onClick={() => onDelete(workout.id)}
            className="text-red-400 text-sm font-medium flex items-center gap-1">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
        {workout.name || 'Workout'}
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="grid grid-cols-3 gap-3 mt-4 mb-6">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-lg font-bold text-ocean">{workout.duration ? formatDuration(workout.duration) : '-'}</div>
          <div className="text-xs text-gray-500">Duration</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-lg font-bold text-palm">{sets}</div>
          <div className="text-xs text-gray-500">Sets</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-lg font-bold text-sunset">{volume > 1000 ? `${(volume / 1000).toFixed(1)}k` : volume}</div>
          <div className="text-xs text-gray-500">Volume (kg)</div>
        </div>
      </div>

      {(workout.exercises || []).map((ex, exIdx) => (
        <div key={exIdx} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{CATEGORY_EMOJI[ex.category] || '\u{1F3CB}'}</span>
            <h3 className="font-semibold text-gray-800 text-sm">{ex.name}</h3>
          </div>
          <div className="space-y-1">
            {(ex.sets || []).map((set, setIdx) => (
              <div key={setIdx} className={`flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm ${set.completed ? 'bg-palm/5' : 'bg-gray-50'}`}>
                <span className="text-xs text-gray-400 w-6">{setIdx + 1}</span>
                <span className={`font-medium ${set.completed ? 'text-palm' : 'text-gray-400'}`}>
                  {set.weight || 0} kg × {set.reps || 0}
                </span>
                {set.completed && <Check size={14} className="text-palm ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryView({ workouts, onViewWorkout }) {
  const grouped = {};
  for (const w of workouts) {
    const d = new Date(w.date);
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(w);
  }

  return (
    <div className="pb-24 px-4">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Playfair Display", serif' }}>
          History
        </h1>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No workout history</p>
          <p className="text-sm mt-1">Complete a workout to see it here</p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, ws]) => (
          <div key={month} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{month}</h2>
            <div className="space-y-2">
              {ws.map(w => (
                <button key={w.id} onClick={() => onViewWorkout(w.id)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left flex items-center gap-4 active:bg-gray-50 transition-colors">
                  <div className="w-12 text-center">
                    <div className="text-lg font-bold text-gray-800">{new Date(w.date).getDate()}</div>
                    <div className="text-xs text-gray-400">{new Date(w.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">{w.name || 'Workout'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {w.exercises?.length || 0} exercises · {getTotalSets(w)} sets · {getTotalVolume(w)} kg
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {w.duration ? formatDuration(w.duration) : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StatsView({ workouts, onError }) {
  const [bodyWeights, setBodyWeights] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [showWeightInput, setShowWeightInput] = useState(false);

  useEffect(() => {
    getBodyWeights()
      .then(setBodyWeights)
      .catch((err) => onError(err?.message || 'Could not load body weight history.'));
  }, [onError]);

  const saveWeight = async () => {
    const weight = parseFloat(newWeight);
    if (!Number.isFinite(weight) || weight <= 0) {
      onError('Enter a body weight greater than zero.');
      return;
    }
    const entry = { id: generateId(), date: new Date().toISOString(), weight };
    try {
      await saveBodyWeight(entry);
      setBodyWeights(prev => [...prev, entry]);
      setNewWeight('');
      setShowWeightInput(false);
    } catch (err) {
      onError(err?.message || 'Could not save that weight.');
    }
  };

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + getTotalVolume(w), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  const exerciseFreq = {};
  for (const w of workouts) {
    for (const ex of w.exercises || []) {
      exerciseFreq[ex.name] = (exerciseFreq[ex.name] || 0) + 1;
    }
  }
  const topExercises = Object.entries(exerciseFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const weeklyData = [];
  for (let i = 3; i >= 0; i--) {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - i * 7);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const count = workouts.filter(w => {
      const d = new Date(w.date);
      return d >= weekStart && d < weekEnd;
    }).length;
    weeklyData.push({ label: i === 0 ? 'This wk' : `${i}w ago`, count });
  }
  const maxWeek = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="pb-24 px-4">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Playfair Display", serif' }}>
          Stats
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-ocean">{totalWorkouts}</div>
          <div className="text-xs text-gray-500">Total Workouts</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-sunset">{totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(0)}k` : totalVolume}</div>
          <div className="text-xs text-gray-500">Total Volume (kg)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-palm">{formatDuration(totalDuration)}</div>
          <div className="text-xs text-gray-500">Total Time</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-coral">{avgDuration ? formatDuration(avgDuration) : '-'}</div>
          <div className="text-xs text-gray-500">Avg Duration</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">Weekly Activity</h2>
        <div className="flex items-end gap-3 h-24">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t-md bg-ocean/20 relative" style={{ height: `${(d.count / maxWeek) * 100}%`, minHeight: d.count > 0 ? '8px' : '2px' }}>
                <div className="absolute inset-0 rounded-t-md bg-ocean" style={{ height: '100%' }} />
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{d.label}</span>
              <span className="text-xs font-medium text-gray-600">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {topExercises.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Top Exercises</h2>
          {topExercises.map(([name, count], i) => (
            <div key={name} className="flex items-center gap-3 py-2">
              <span className="w-5 text-xs font-bold text-gray-400">{i + 1}</span>
              <span className="flex-1 text-sm text-gray-700">{name}</span>
              <span className="text-xs text-gray-400">{count}x</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800 text-sm">Body Weight</h2>
          <button onClick={() => setShowWeightInput(!showWeightInput)} className="text-ocean text-sm font-medium">
            {showWeightInput ? 'Cancel' : '+ Log'}
          </button>
        </div>
        {showWeightInput && (
          <div className="flex gap-2 mb-3">
            <input type="number" inputMode="decimal" value={newWeight} onChange={e => setNewWeight(e.target.value)}
              placeholder="kg" autoFocus className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/30" />
            <button onClick={saveWeight} className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium">
              <Save size={16} />
            </button>
          </div>
        )}
        {bodyWeights.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No entries yet</p>
        ) : (
          <div className="space-y-1">
            {bodyWeights.slice(-5).reverse().map(bw => (
              <div key={bw.id} className="flex justify-between text-sm py-1.5">
                <span className="text-gray-500">{new Date(bw.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="font-medium text-gray-800">{bw.weight} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FitnessApp() {
  const [view, setView] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [ready, setReady] = useState(false);
  const [fatalError, setFatalError] = useState(null);
  const [toast, setToast] = useState(null);
  const [draft, setDraft] = useState(null);
  const [pendingRoutine, setPendingRoutine] = useState(null);

  const loadData = useCallback(async () => {
    const [ws, exs] = await Promise.all([getWorkouts(), getExercises()]);
    setWorkouts(ws);
    setExercises(exs);
  }, []);

  const init = useCallback(() => {
    setFatalError(null);
    initDB()
      .then(loadData)
      .then(() => {
        setDraft(loadDraft());
        setReady(true);
      })
      .catch((err) => {
        // Storage can be unavailable outright (private browsing, blocked
        // site data). Say so instead of spinning on "Loading..." forever.
        setFatalError(err?.message || 'Could not open local storage on this device.');
      });
  }, [loadData]);

  useEffect(init, [init]);

  const handleFinishWorkout = async (workout) => {
    try {
      await saveWorkout(workout);
      clearDraft();
      setDraft(null);
      await loadData();
      setView('dashboard');
    } catch (err) {
      setToast(err?.message || 'Could not save that workout. It is still open - try again.');
    }
  };

  // Seeding the draft is what starts the routine: ActiveWorkoutView reads it
  // on mount and autosaves from there, so the session survives a reload the
  // same way a hand-built one does.
  const startRoutine = (routine) => {
    setPendingRoutine(null);
    setDraft(buildRoutineDraft(routine));
    setView('workout');
  };

  // A routine would overwrite an in-progress workout, which is never silent.
  const handleStartRoutine = (routine) => {
    if (draft && draft.exercises.length > 0) setPendingRoutine(routine);
    else startRoutine(routine);
  };

  const handleCancelWorkout = () => {
    setDraft(null);
    setView('dashboard');
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteWorkout(id);
      await loadData();
      setView('history');
      setSelectedWorkout(null);
    } catch (err) {
      setToast(err?.message || 'Could not delete that workout.');
    }
  };

  const handleViewWorkout = (id) => {
    setSelectedWorkout(id);
    setView('detail');
  };

  if (fatalError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f9f7f3' }}>
        <div className="text-center max-w-sm">
          <AlertTriangle size={40} className="mx-auto text-sunset" />
          <h1 className="text-lg font-semibold text-gray-800 mt-3">Storage unavailable</h1>
          <p className="text-sm text-gray-500 mt-2">{fatalError}</p>
          <p className="text-xs text-gray-400 mt-3">
            This app keeps everything on your device. Private browsing or blocked site data will stop it working.
          </p>
          <button onClick={init} className="mt-5 px-5 py-2.5 rounded-xl bg-ocean text-white text-sm font-semibold">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f7f3' }}>
        <div className="text-center">
          <Dumbbell size={40} className="mx-auto text-ocean animate-pulse" />
          <p className="text-gray-400 text-sm mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'workout') {
    return (
      <>
        <ActiveWorkoutView
          exerciseList={exercises}
          draft={draft}
          onFinish={handleFinishWorkout}
          onCancel={handleCancelWorkout}
          onError={setToast}
        />
        <Toast message={toast} onDismiss={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f9f7f3' }}>
      {view === 'dashboard' && (
        <>
          {draft && draft.exercises.length > 0 && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-sunset/10 border border-sunset/30 flex items-center gap-3">
              <Dumbbell size={18} className="text-sunset shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">Unfinished workout</p>
                <p className="text-xs text-gray-500">
                  {draft.exercises.length} exercise{draft.exercises.length === 1 ? '' : 's'} saved on this device
                </p>
              </div>
              <button onClick={() => setView('workout')}
                className="px-3 py-1.5 rounded-lg bg-sunset text-white text-xs font-semibold shrink-0">
                Resume
              </button>
              <button onClick={() => { clearDraft(); setDraft(null); }}
                aria-label="Discard unfinished workout"
                className="p-1 text-gray-400 shrink-0">
                <X size={16} />
              </button>
            </div>
          )}
          <DashboardView workouts={workouts}
            onStartWorkout={() => setView('workout')}
            onStartRoutine={handleStartRoutine}
            onViewWorkout={handleViewWorkout} />
        </>
      )}
      {view === 'history' && (
        <HistoryView workouts={workouts} onViewWorkout={handleViewWorkout} />
      )}
      {view === 'detail' && selectedWorkout && (
        <WorkoutDetailView workoutId={selectedWorkout}
          onBack={() => { setView('history'); setSelectedWorkout(null); }}
          onDelete={handleDeleteWorkout} />
      )}
      {view === 'stats' && <StatsView workouts={workouts} onError={setToast} />}

      {pendingRoutine && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-800">Replace the unfinished workout?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Starting {pendingRoutine.name} discards the {draft?.exercises?.length || 0} exercise
              {draft?.exercises?.length === 1 ? '' : 's'} saved on this device. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPendingRoutine(null)}
                className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700">
                Keep it
              </button>
              <button onClick={() => startRoutine(pendingRoutine)}
                className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white">
                Start routine
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />

      {view !== 'workout' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-[env(safe-area-inset-bottom)] z-40">
          <div className="flex justify-around max-w-md mx-auto">
            {[
              { id: 'dashboard', icon: Home, label: 'Home' },
              { id: 'history', icon: Calendar, label: 'History' },
              { id: 'workout', icon: Dumbbell, label: 'Workout', accent: true },
              { id: 'stats', icon: BarChart3, label: 'Stats' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id)}
                className={`flex flex-col items-center py-2 px-4 min-w-[4rem] ${tab.accent ? '' : view === tab.id ? 'text-ocean' : 'text-gray-400'}`}>
                {tab.accent ? (
                  <div className="w-12 h-12 -mt-5 rounded-full bg-ocean text-white flex items-center justify-center shadow-lg">
                    <tab.icon size={22} />
                  </div>
                ) : (
                  <tab.icon size={22} />
                )}
                <span className={`text-[10px] mt-0.5 ${tab.accent ? 'text-ocean font-medium' : ''}`}>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
