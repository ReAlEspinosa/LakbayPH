/* Built-in routine templates.
 *
 * A routine is a plan, not a record. It names exercises and carries a target
 * set count and rep range; starting one builds an active-workout draft with
 * empty sets, so the targets are only hints and nothing is logged until the
 * user types real numbers and ticks a set off.
 *
 * Each entry repeats the exercise name and category rather than looking them
 * up in the exercise store. A routine must still build if the store is
 * partial, and a plan that renders as blank rows is worse than no plan.
 */

export const ROUTINES = [
  {
    id: 'beginner-full-body',
    name: 'Beginner',
    note: 'Full body · 6 lifts + 2 add-ons',
    exercises: [
      { exerciseId: 'low-incline-db-press', name: 'Low Incline Dumbbell Press', category: 'Chest', sets: 3, target: '10-15' },
      { exerciseId: 'goblet-squat', name: 'Goblet Squat', category: 'Legs', sets: 3, target: '10-15' },
      { exerciseId: 'neutral-grip-pull-ups', name: 'Neutral Grip Pull-Ups', category: 'Back', sets: 3, target: '5-8' },
      { exerciseId: 'db-romanian-deadlift', name: 'Dumbbell Romanian Deadlift', category: 'Legs', sets: 3, target: '10-15' },
      { exerciseId: 'cable-row', name: 'Cable Row', category: 'Back', sets: 3, target: '10-15' },
      { exerciseId: 'lateral-raise-superset', name: 'Lateral Raise Superset', category: 'Shoulders', sets: 3, target: '10-20' },
      { exerciseId: 'dead-bug', name: 'Dead Bug', category: 'Core', sets: 3, target: '5 per side', addOn: true },
      { exerciseId: 'arms-superset', name: 'Arms Superset', category: 'Arms', sets: 3, target: '8-12', addOn: true },
    ],
  },
];

/* Shape the routine into the same object the active-workout draft uses, so a
 * routine-seeded session autosaves, restores and finishes like any other. */
export function buildRoutineDraft(routine) {
  return {
    name: routine.name,
    startedAt: Date.now(),
    exercises: routine.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      name: ex.name,
      category: ex.category,
      target: ex.target,
      sets: Array.from({ length: ex.sets }, () => ({ reps: '', weight: '', completed: false })),
    })),
  };
}
