import { ActiveWorkoutSession } from './active-workout-session';
import { soundService } from './soundService';
import { Exercise, Workout } from '../types';

describe('ActiveWorkoutSession', () => {
  let service: ActiveWorkoutSession;

  const repetitionExercise: Exercise = {
    id: 'pushup',
    name: 'Flexao',
    description: 'Flexao tradicional',
    type: 'REPETITIONS',
    category: 'push',
    muscleGroup: 'Peito',
    instruction: 'Desca controlado e subida explosiva.',
  };

  const timeExercise: Exercise = {
    id: 'plank',
    name: 'Prancha',
    description: 'Prancha abdominal',
    type: 'TIME',
    category: 'legs_core',
    muscleGroup: 'Core',
    instruction: 'Mantenha alinhamento neutro.',
  };

  beforeEach(() => {
    jasmine.clock().install();
    service = new ActiveWorkoutSession();

    spyOn(soundService, 'playCountdownTick');
    spyOn(soundService, 'playRestFinished');
    spyOn(soundService, 'playSetComplete');
    spyOn(soundService, 'playWorkoutComplete');
  });

  afterEach(() => {
    service.destroy();
    jasmine.clock().uninstall();
  });

  it('avanca para descanso e conclui a sessao ao finalizar a ultima serie', () => {
    const workout: Workout = {
      id: 'w_push',
      levelId: 'basico',
      name: 'Peito Base',
      description: 'Treino curto de flexao',
      category: 'push',
      estimatedMinutes: 12,
      exercises: [
        {
          id: 'we_push_1',
          workoutId: 'w_push',
          exerciseId: 'pushup',
          order: 1,
          sets: 2,
          targetRepetitions: 10,
          restDuration: 60,
        },
      ],
    };

    service.initialize(workout, 'basico', { pushup: repetitionExercise }, 90);
    service.setInputValue(12);

    const firstResult = service.completeSet();

    expect(firstResult).toBeNull();
    expect(service.phase()).toBe('RESTING');
    expect(service.sessionExercises()[0].sets[0].actualRepetitions).toBe(12);
    expect(service.sessionExercises()[0].sets[0].completed).toBeTrue();

    service.skipRest();
    expect(service.phase()).toBe('WORKING');
    expect(service.currentSetIndex()).toBe(1);

    service.setInputValue(11);
    const completedSession = service.completeSet();

    expect(completedSession).not.toBeNull();
    expect(completedSession?.status).toBe('COMPLETED');
    expect(completedSession?.exercises[0].sets[1].actualRepetitions).toBe(11);
    expect(soundService.playWorkoutComplete).toHaveBeenCalled();
  });

  it('respeita o modo AUTO_WORK_REST em exercicio por tempo', () => {
    const workout: Workout = {
      id: 'w_core',
      levelId: 'basico',
      name: 'Core Base',
      description: 'Treino curto de prancha',
      category: 'legs_core',
      estimatedMinutes: 8,
      exercises: [
        {
          id: 'we_core_1',
          workoutId: 'w_core',
          exerciseId: 'plank',
          order: 1,
          sets: 1,
          targetDuration: 15,
          restDuration: 45,
        },
      ],
    };

    service.initialize(workout, 'basico', { plank: timeExercise }, 90);
    service.setTimerMode('AUTO_WORK_REST');

    expect(service.timeLeft()).toBe(15);

    jasmine.clock().tick(3000);

    expect(service.timeLeft()).toBe(12);
  });

  it('nao deixa o ajuste de descanso cair abaixo de 5 segundos', () => {
    const workout: Workout = {
      id: 'w_rest',
      levelId: 'basico',
      name: 'Teste Descanso',
      description: 'Ajuste de descanso',
      category: 'push',
      estimatedMinutes: 5,
      exercises: [
        {
          id: 'we_rest_1',
          workoutId: 'w_rest',
          exerciseId: 'pushup',
          order: 1,
          sets: 2,
          targetRepetitions: 8,
          restDuration: 20,
        },
      ],
    };

    service.initialize(workout, 'basico', { pushup: repetitionExercise }, 90);
    service.completeSet();

    expect(service.phase()).toBe('RESTING');

    service.adjustRest(-100);

    expect(service.timeLeft()).toBe(5);
  });
});
