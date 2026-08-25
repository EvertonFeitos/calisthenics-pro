import { DEFAULT_EXERCISES, DEFAULT_SCHEDULES } from './defaultData';
import { LocalStorageWorkoutRepository } from './repository';
import { Exercise, WorkoutSession } from '../../types';

describe('LocalStorageWorkoutRepository', () => {
  let repository: LocalStorageWorkoutRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageWorkoutRepository();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('carrega seeds padrao quando o armazenamento esta vazio', async () => {
    const levels = await repository.getLevels();
    const currentLevel = await repository.getCurrentLevel();
    const exercises = await repository.getExercises();
    const workouts = await repository.getWorkouts();
    const schedule = await repository.getSchedule('basico');

    expect(levels.length).toBeGreaterThan(0);
    expect(currentLevel).toBe('iniciante');
    expect(exercises.length).toBe(DEFAULT_EXERCISES.length);
    expect(workouts.length).toBeGreaterThan(0);
    expect(schedule).toEqual(DEFAULT_SCHEDULES['basico']);
  });

  it('mescla exercicios default ausentes sem perder customizados', async () => {
    const customExercise: Exercise = {
      id: 'ex_custom_merge',
      name: 'Custom Pull',
      description: 'Exercicio criado pelo usuario',
      type: 'REPETITIONS',
      category: 'pull',
      muscleGroup: 'Costas',
      instruction: 'Executar com controle.',
    };

    localStorage.setItem(
      'calistenia_exercises',
      JSON.stringify([customExercise, DEFAULT_EXERCISES[0]])
    );
    localStorage.setItem('calistenia_schema_version_v6', JSON.stringify('6.0'));

    const exercises = await repository.getExercises();

    expect(exercises.some((exercise) => exercise.id === 'ex_custom_merge')).toBeTrue();
    expect(exercises.length).toBe(DEFAULT_EXERCISES.length + 1);
  });

  it('preenche a midia padrao em exercicios default legados quando o seed base confere', async () => {
    const defaultExercise = DEFAULT_EXERCISES.find((exercise) => exercise.id === 'ex_knee_pushup');

    expect(defaultExercise).toBeDefined();

    if (!defaultExercise) {
      return;
    }

    const { imageUrl, videoUrl, videoEmbedUrl, ...legacyExercise } = defaultExercise;

    localStorage.setItem('calistenia_exercises', JSON.stringify([legacyExercise]));
    localStorage.setItem('calistenia_schema_version_v6', JSON.stringify('6.0'));

    const exercises = await repository.getExercises();
    const restored = exercises.find((exercise) => exercise.id === defaultExercise.id);

    expect(restored?.videoUrl).toBe(defaultExercise.videoUrl);
  });

  it('nao sobrescreve exercicio default editado pelo usuario ao sincronizar midia', async () => {
    const defaultExercise = DEFAULT_EXERCISES.find((exercise) => exercise.id === 'ex_knee_pushup');

    expect(defaultExercise).toBeDefined();

    if (!defaultExercise) {
      return;
    }

    const { imageUrl, videoUrl, videoEmbedUrl, ...legacyExercise } = defaultExercise;
    const editedExercise = {
      ...legacyExercise,
      name: 'Knee Push Up Customizado',
    };

    localStorage.setItem('calistenia_exercises', JSON.stringify([editedExercise]));
    localStorage.setItem('calistenia_schema_version_v6', JSON.stringify('6.0'));

    const exercises = await repository.getExercises();
    const preserved = exercises.find((exercise) => exercise.id === defaultExercise.id);

    expect(preserved?.name).toBe('Knee Push Up Customizado');
    expect(preserved?.imageUrl).toBeUndefined();
    expect(preserved?.videoUrl).toBeUndefined();
  });

  it('faz CRUD de exercicio preservando o shape salvo', async () => {
    const exercise: Exercise = {
      id: 'ex_custom_save',
      name: 'Dragon Squat Assistida',
      description: 'Progressao unilateral',
      type: 'REPETITIONS',
      category: 'legs_core',
      muscleGroup: 'Quadriceps, Gluteos',
      instruction: 'Descer com apoio leve.',
      tips: ['Controle a descida'],
      videoUrl: 'https://example.com/dragon.mp4',
    };

    await repository.saveExercise(exercise);

    let stored = await repository.getExerciseById(exercise.id);
    expect(stored).toEqual(exercise);

    await repository.deleteExercise(exercise.id);

    stored = await repository.getExerciseById(exercise.id);
    expect(stored).toBeNull();
  });

  it('salva a grade customizada e restaura o padrao do nivel ativo', async () => {
    const original = await repository.getSchedule('basico');
    const custom = original.map((day, index) => ({
      ...day,
      dayOfWeek: `Ciclo ${index + 1}`,
      notes: `Nota ${index + 1}`,
      isRestDay: index === 0,
      workoutId: index === 0 ? null : day.workoutId,
    }));

    await repository.saveSchedule('basico', custom);

    const saved = await repository.getSchedule('basico');
    expect(saved).toEqual(custom);

    const reset = await repository.resetScheduleToDefault('basico');
    expect(reset).toEqual(DEFAULT_SCHEDULES['basico']);
  });

  it('limpa apenas o historico quando solicitado', async () => {
    const session: WorkoutSession = {
      id: 'session_test',
      workoutId: 'w_test',
      levelId: 'basico',
      workoutName: 'Treino Teste',
      startedAt: new Date('2026-08-20T10:00:00.000Z').toISOString(),
      finishedAt: new Date('2026-08-20T10:10:00.000Z').toISOString(),
      durationSeconds: 600,
      status: 'COMPLETED',
      exercises: [],
    };

    await repository.saveWorkoutSession(session);
    await repository.clearWorkoutSessions();

    const sessions = await repository.getWorkoutSessions();
    const exercises = await repository.getExercises();

    expect(sessions).toEqual([]);
    expect(exercises.length).toBeGreaterThan(0);
  });

  it('limpa todas as chaves e volta a semear dados na proxima carga', async () => {
    await repository.clearAllData();

    expect(localStorage.getItem('calistenia_exercises')).toBeNull();
    expect(localStorage.getItem('calistenia_sessions')).toBeNull();
    expect(localStorage.getItem('calistenia_schema_version_v6')).toBeNull();

    const exercises = await repository.getExercises();

    expect(exercises.length).toBe(DEFAULT_EXERCISES.length);
    expect(localStorage.getItem('calistenia_schema_version_v6')).toBe(JSON.stringify('6.0'));
  });
});
