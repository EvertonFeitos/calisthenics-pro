import React, { useState, useEffect, useRef } from 'react';
import {
  Workout,
  Exercise,
  WorkoutSession,
  ExerciseSession,
  SetSession,
  LevelId,
} from '../types';
import { soundService } from '../services/soundService';
import { ExerciseMediaViewer } from './ExerciseMediaViewer';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  AlertTriangle,
  Flame,
  Clock,
  Dumbbell,
  Timer,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ActiveWorkoutViewProps {
  workout: Workout;
  currentLevelId: LevelId;
  exercisesMap: Record<string, Exercise>;
  defaultRestDuration: number;
  soundEnabled: boolean;
  onFinishWorkout: (session: WorkoutSession) => void;
  onCancelWorkout: () => void;
}

type WorkoutPhase = 'READY' | 'WORKING' | 'RESTING' | 'PAUSED';
type TimerMode = 'REST_ONLY' | 'AUTO_WORK_REST';

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  workout,
  currentLevelId,
  exercisesMap,
  defaultRestDuration,
  soundEnabled,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  // Session tracking state
  const [startedAt] = useState<string>(new Date().toISOString());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [timerMode, setTimerMode] = useState<TimerMode>('REST_ONLY');
  const [phase, setPhase] = useState<WorkoutPhase>('WORKING');
  const [previousPhase, setPreviousPhase] = useState<WorkoutPhase>('WORKING');

  // Completed sets store: exerciseId -> array of SetSession
  const [sessionExercises, setSessionExercises] = useState<ExerciseSession[]>(() => {
    return workout.exercises.map((we, idx) => {
      const ex = exercisesMap[we.exerciseId];
      const sets: SetSession[] = [];
      for (let s = 1; s <= we.sets; s++) {
        sets.push({
          id: `set_${we.id}_${s}`,
          setNumber: s,
          targetRepetitions: we.targetRepetitions,
          actualRepetitions: null,
          targetDuration: we.targetDuration,
          actualDuration: null,
          completed: false,
        });
      }
      return {
        id: `es_${workout.id}_${we.id}`,
        exerciseId: we.exerciseId,
        exerciseName: ex?.name || 'Exercício',
        type: ex?.type || 'REPETITIONS',
        order: idx + 1,
        sets,
      };
    });
  });

  // Current Exercise & Set references
  const currentWorkoutExercise = workout.exercises[currentExerciseIndex];
  const currentExerciseData = exercisesMap[currentWorkoutExercise?.exerciseId];
  const isTimeBased = currentExerciseData?.type === 'TIME';

  // Reps / Duration inputs for current active set
  const initialTargetVal = isTimeBased
    ? currentWorkoutExercise?.targetDuration || 15
    : currentWorkoutExercise?.targetRepetitions || 8;
  const [inputVal, setInputVal] = useState<number>(initialTargetVal);
  const [skipInputVal, setSkipInputVal] = useState<boolean>(false);

  // Timers State
  const [restDuration, setRestDuration] = useState<number>(
    currentWorkoutExercise?.restDuration || defaultRestDuration || 120
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [workStopwatch, setWorkStopwatch] = useState<number>(0);
  const [totalWorkoutDuration, setTotalWorkoutDuration] = useState<number>(0);

  // Dialog state
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);

  // Refs for intervals
  const timerRef = useRef<any>(null);
  const totalTimerRef = useRef<any>(null);

  // Update restDuration when exercise changes
  useEffect(() => {
    if (currentWorkoutExercise) {
      setRestDuration(currentWorkoutExercise.restDuration || defaultRestDuration || 120);
      const target = isTimeBased
        ? currentWorkoutExercise.targetDuration || 15
        : currentWorkoutExercise.targetRepetitions || 8;
      setInputVal(target);
      setSkipInputVal(false);
    }
  }, [currentExerciseIndex]);

  // Overall workout stopwatch
  useEffect(() => {
    totalTimerRef.current = setInterval(() => {
      setTotalWorkoutDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(totalTimerRef.current);
  }, []);

  // Main active countdown / work timer effect
  useEffect(() => {
    if (phase === 'PAUSED') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (phase === 'RESTING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            soundService.playRestFinished();
            advanceToNextSetAfterRest();
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            soundService.playCountdownTick(prev === 2 ? 800 : 600);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'WORKING') {
      if (timerMode === 'AUTO_WORK_REST' && isTimeBased) {
        // Auto work countdown
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleCompleteSet(inputVal);
              return 0;
            }
            if (prev <= 4 && prev > 1) {
              soundService.playCountdownTick(prev === 2 ? 800 : 600);
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Simple work stopwatch for time-based exercise
        timerRef.current = setInterval(() => {
          setWorkStopwatch((prev) => prev + 1);
        }, 1000);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timerMode, isTimeBased, currentExerciseIndex, currentSetIndex]);

  // Advance logic
  const advanceToNextSetAfterRest = () => {
    const currentEx = workout.exercises[currentExerciseIndex];
    if (currentSetIndex + 1 < currentEx.sets) {
      // Next set in same exercise
      setCurrentSetIndex((prev) => prev + 1);
      setPhase('WORKING');
      setWorkStopwatch(0);
      const target = isTimeBased
        ? currentEx.targetDuration || 15
        : currentEx.targetRepetitions || 8;
      setInputVal(target);
      setSkipInputVal(false);
      if (timerMode === 'AUTO_WORK_REST' && isTimeBased) {
        setTimeLeft(target);
      }
    } else if (currentExerciseIndex + 1 < workout.exercises.length) {
      // Next exercise
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSetIndex(0);
      setPhase('WORKING');
      setWorkStopwatch(0);
    } else {
      // All exercises and sets finished!
      finishFullWorkout();
    }
  };

  // Complete current set
  const handleCompleteSet = (customValue?: number) => {
    soundService.playSetComplete();

    const actualReps = !isTimeBased
      ? skipInputVal
        ? null
        : customValue !== undefined
        ? customValue
        : inputVal
      : null;

    const actualDur = isTimeBased
      ? skipInputVal
        ? null
      : timerMode === 'AUTO_WORK_REST'
        ? currentWorkoutExercise?.targetDuration || 15
        : workStopwatch > 0
        ? workStopwatch
        : inputVal
      : null;

    // Update session state
    const updated = [...sessionExercises];
    const currentExSession = updated[currentExerciseIndex];
    if (currentExSession && currentExSession.sets[currentSetIndex]) {
      currentExSession.sets[currentSetIndex] = {
        ...currentExSession.sets[currentSetIndex],
        actualRepetitions: actualReps,
        actualDuration: actualDur,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setSessionExercises(updated);
    }

    // Check if this was the last set of the last exercise
    const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
    const isLastSet = currentSetIndex === currentWorkoutExercise.sets - 1;

    if (isLastExercise && isLastSet) {
      finishFullWorkout(updated);
      return;
    }

    // Otherwise transition to REST phase
    setPhase('RESTING');
    setTimeLeft(restDuration);
  };

  const handleSkipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advanceToNextSetAfterRest();
  };

  const handleAdjustRest = (deltaSeconds: number) => {
    setTimeLeft((prev) => Math.max(5, prev + deltaSeconds));
  };

  const handleSetExactRest = (seconds: number) => {
    setTimeLeft(seconds);
    setRestDuration(seconds);
  };

  const handleTogglePause = () => {
    if (phase === 'PAUSED') {
      setPhase(previousPhase);
    } else {
      setPreviousPhase(phase);
      setPhase('PAUSED');
    }
  };

  const finishFullWorkout = (finalExercises = sessionExercises) => {
    soundService.playWorkoutComplete();
    const session: WorkoutSession = {
      id: `session_${Date.now()}`,
      workoutId: workout.id,
      levelId: currentLevelId,
      workoutName: workout.name,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationSeconds: totalWorkoutDuration,
      status: 'COMPLETED',
      exercises: finalExercises,
    };
    onFinishWorkout(session);
  };

  // Helper formatting mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate overall workout completion %
  const totalSetsInWorkout = workout.exercises.reduce((sum, e) => sum + e.sets, 0);
  const completedSetsCount = sessionExercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = Math.min(
    100,
    Math.round((completedSetsCount / (totalSetsInWorkout || 1)) * 100)
  );

  return (
    <div className="fixed inset-0 z-40 bg-[#080808] text-[#F0F0F0] flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Bento Top Navigation & Controls */}
      <div className="sticky top-0 z-10 bg-[#080808]/90 backdrop-blur-xl border-b border-[#222] px-4 py-3.5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            id="quit-workout-btn"
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#888] hover:text-rose-400 py-1.5 px-3 rounded-full hover:bg-[#161616] border border-transparent hover:border-[#262626] transition-all"
          >
            <X className="w-4 h-4" />
            <span>Encerrar</span>
          </button>

          <div className="text-center">
            <h2 className="text-xs font-black uppercase text-indigo-400 tracking-wider">
              {workout.name}
            </h2>
            <div className="text-xs text-[#888] flex items-center justify-center gap-1.5 font-semibold font-mono">
              <Clock className="w-3.5 h-3.5 text-[#666]" />
              <span>{formatTime(totalWorkoutDuration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-timer-mode-btn"
              onClick={() =>
                setTimerMode((prev) => (prev === 'REST_ONLY' ? 'AUTO_WORK_REST' : 'REST_ONLY'))
              }
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                timerMode === 'AUTO_WORK_REST'
                  ? 'bg-indigo-950/70 text-indigo-300 border-indigo-500/50 ring-1 ring-indigo-500/30'
                  : 'bg-[#161616] text-[#888] border-[#262626]'
              }`}
              title="Alternar entre modo descanso manual e modo execução automática WORK/REST"
            >
              {timerMode === 'AUTO_WORK_REST' ? 'Modo Auto' : 'Manual'}
            </button>

            <button
              id="pause-workout-btn"
              onClick={handleTogglePause}
              className={`p-2 rounded-full border transition-all ${
                phase === 'PAUSED'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                  : 'bg-[#161616] text-[#ccc] border-[#262626] hover:bg-[#202020]'
              }`}
              title={phase === 'PAUSED' ? 'Retomar treino' : 'Pausar treino'}
            >
              {phase === 'PAUSED' ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bento Workout Progress Bar */}
        <div className="max-w-xl mx-auto mt-2.5">
          <div className="flex justify-between text-[10px] text-[#888] font-bold mb-1 uppercase tracking-wider">
            <span>Progresso da Sessão</span>
            <span className="font-mono text-indigo-400">
              {completedSetsCount}/{totalSetsInWorkout} séries ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#181818] rounded-full overflow-hidden border border-[#222]">
            <div
              className="h-full bg-indigo-500 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Active Body */}
      <div className="flex-1 max-w-xl mx-auto w-full p-4 flex flex-col justify-between">
        {/* Phase Notification Banner if Paused */}
        {phase === 'PAUSED' && (
          <div className="bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 px-4 py-2.5 rounded-2xl text-center text-xs font-bold animate-pulse mb-3">
            Treino pausado. Toque no botão Play para continuar.
          </div>
        )}

        {/* Current Exercise Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 bg-[#121212] border border-[#222] px-3.5 py-1 rounded-full text-xs font-bold text-[#888] mb-2">
            <span>Exercício {currentExerciseIndex + 1} de {workout.exercises.length}</span>
            <span className="w-1 h-1 rounded-full bg-[#444]" />
            <span className="text-indigo-400 font-extrabold">
              Série {currentSetIndex + 1} de {currentWorkoutExercise?.sets}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#F0F0F0] tracking-tight">
            {currentExerciseData?.name || 'Exercício'}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-xs text-[#888] font-medium">{currentExerciseData?.muscleGroup}</p>
            {(currentExerciseData?.videoUrl || currentExerciseData?.imageUrl) && (
              <button
                type="button"
                onClick={() => setShowMediaModal(true)}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all"
              >
                <span>Ver Execução Correta</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Center Card: WORK phase vs REST phase */}
        {phase === 'RESTING' ? (
          /* REST MODE CARD */
          <div className="bg-[#121212] border border-[#222] rounded-[32px] p-6 text-center shadow-2xl flex flex-col items-center justify-center my-auto animate-scaleUp">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
              Descanso entre Séries
            </span>

            {/* Circular Countdown Display */}
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-[#181818] stroke-current"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-indigo-500 stroke-current transition-all duration-1000"
                  strokeWidth="6"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * timeLeft) / (restDuration || 1)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#F0F0F0] tracking-tight font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider mt-0.5">
                  Restante
                </span>
              </div>
            </div>

            {/* Quick Rest Adjusters (+15s / -15s / Exact presets) */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjustRest(-15)}
                  className="px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222] text-[#bbb] text-xs font-bold border border-[#262626] transition-colors"
                >
                  -15s
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustRest(15)}
                  className="px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222] text-[#bbb] text-xs font-bold border border-[#262626] transition-colors"
                >
                  +15s
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustRest(30)}
                  className="px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222] text-[#bbb] text-xs font-bold border border-[#262626] transition-colors"
                >
                  +30s
                </button>
              </div>

              {/* Exact time preset chips */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {[30, 60, 90, 120, 180].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSetExactRest(sec)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors ${
                      restDuration === sec
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-[#161616] text-[#888] border-[#262626] hover:text-[#ccc]'
                    }`}
                  >
                    {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Skip Rest Button */}
            <button
              id="skip-rest-btn"
              type="button"
              onClick={handleSkipRest}
              className="mt-5 w-full py-3.5 rounded-full bg-[#181818] hover:bg-[#202020] border border-[#262626] text-[#F0F0F0] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <SkipForward className="w-4 h-4 text-indigo-400" />
              Pular Descanso e Iniciar Próxima Série
            </button>

            {/* Quick Media Review while resting */}
            {(currentExerciseData?.videoUrl || currentExerciseData?.imageUrl) && (
              <div className="w-full mt-4 text-left">
                <ExerciseMediaViewer
                  videoUrl={currentExerciseData.videoUrl}
                  imageUrl={currentExerciseData.imageUrl}
                  exerciseName={currentExerciseData.name}
                  collapsible={true}
                  defaultCollapsed={true}
                />
              </div>
            )}
          </div>
        ) : (
          /* WORK PHASE CARD */
          <div className="bg-[#121212] border border-[#222] rounded-[32px] p-6 shadow-2xl flex flex-col justify-between my-auto">
            {/* Target Display */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Meta Sugerida</span>
                <div className="text-lg font-black text-indigo-400">
                  {currentWorkoutExercise?.targetRepetitions
                    ? `${currentWorkoutExercise.targetRepetitions} repetições`
                    : `${currentWorkoutExercise?.targetDuration} segundos`}
                </div>
              </div>

              {isTimeBased && (
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Cronômetro</span>
                  <div className="text-xl font-black text-[#F0F0F0] font-mono">
                    {formatTime(timerMode === 'AUTO_WORK_REST' ? timeLeft : workStopwatch)}
                  </div>
                </div>
              )}
            </div>

            {/* Instruction snippet */}
            {currentExerciseData?.instruction && (
              <p className="text-xs text-[#aaa] py-2.5 leading-relaxed">
                {currentExerciseData.instruction}
              </p>
            )}

            {/* Direct Inline Media (Video Tutorial or Illustration Image) */}
            {(currentExerciseData?.videoUrl || currentExerciseData?.imageUrl) && (
              <div className="my-2">
                <ExerciseMediaViewer
                  videoUrl={currentExerciseData.videoUrl}
                  imageUrl={currentExerciseData.imageUrl}
                  exerciseName={currentExerciseData.name}
                  collapsible={true}
                  defaultCollapsed={false}
                />
              </div>
            )}

            {/* Performance Input (Actual Repetitions or Duration Done) */}
            <div className="bg-[#161616] rounded-2xl p-4 border border-[#262626] mt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#F0F0F0] flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />
                  {isTimeBased ? 'Duração Real (segundos)' : 'Repetições Realizadas'}
                </label>

                {/* Option to skip recording */}
                <button
                  type="button"
                  id="toggle-skip-input-btn"
                  onClick={() => setSkipInputVal(!skipInputVal)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                    skipInputVal
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-[#888] hover:text-[#ccc] underline'
                  }`}
                >
                  {skipInputVal ? 'Sem registro (opcional)' : 'Não registrar reps'}
                </button>
              </div>

              {!skipInputVal ? (
                <div>
                  <div className="flex items-center justify-center gap-4 my-2">
                    <button
                      type="button"
                      id="decrease-rep-btn"
                      onClick={() => setInputVal((prev) => Math.max(0, prev - 1))}
                      className="w-12 h-12 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] text-[#F0F0F0] font-black text-xl flex items-center justify-center border border-[#2a2a2a] active:scale-95 transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="w-24 text-center">
                      <span className="text-4xl font-black text-[#F0F0F0] font-mono">{inputVal}</span>
                      <span className="block text-[10px] uppercase font-bold text-[#888]">
                        {isTimeBased ? 'Segundos' : 'Reps'}
                      </span>
                    </div>

                    <button
                      type="button"
                      id="increase-rep-btn"
                      onClick={() => setInputVal((prev) => prev + 1)}
                      className="w-12 h-12 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] text-[#F0F0F0] font-black text-xl flex items-center justify-center border border-[#2a2a2a] active:scale-95 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick select pills */}
                  <div className="flex justify-center gap-1.5 mt-3">
                    {[0, 3, 5, 8, 10, 12, 15].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInputVal(val)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors ${
                          inputVal === val
                            ? 'bg-indigo-600 text-white border-indigo-500 font-black shadow-sm'
                            : 'bg-[#181818] text-[#888] border-[#262626] hover:text-[#ccc]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-[#888] bg-[#121212] rounded-xl">
                  A série será marcada como concluída sem salvar contagem numérica.
                </div>
              )}
            </div>

            {/* Complete Set CTA */}
            <button
              id="complete-set-btn"
              type="button"
              onClick={() => handleCompleteSet()}
              className="mt-5 w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-95 transition-all border border-indigo-400/30"
            >
              <CheckCircle2 className="w-5 h-5" />
              CONCLUIR SÉRIE
            </button>
          </div>
        )}

        {/* Next Exercise Preview */}
        <div className="mt-4 bg-[#121212] border border-[#222] rounded-2xl p-3.5 flex items-center justify-between text-xs text-[#888]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#aaa]">A Seguir:</span>
            {currentSetIndex + 1 < currentWorkoutExercise?.sets ? (
              <span>
                Série {currentSetIndex + 2} de {currentWorkoutExercise?.sets} ({currentExerciseData?.name})
              </span>
            ) : currentExerciseIndex + 1 < workout.exercises.length ? (
              <span className="text-indigo-400 font-semibold">
                {exercisesMap[workout.exercises[currentExerciseIndex + 1]?.exerciseId]?.name || 'Próximo exercício'}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">Finalização do Treino!</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-[#666]" />
        </div>
      </div>

      {/* Modal for Exercise Video/Image Tutorial */}
      {showMediaModal && currentExerciseData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-[#262626] rounded-[32px] p-5 max-w-lg w-full shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#222]">
              <div>
                <h3 className="font-black text-sm text-[#F0F0F0]">{currentExerciseData.name}</h3>
                <p className="text-[11px] text-[#888]">Técnica e Execução Correta</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="p-1.5 rounded-full text-[#888] hover:text-[#fff] hover:bg-[#202020]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ExerciseMediaViewer
              videoUrl={currentExerciseData.videoUrl}
              imageUrl={currentExerciseData.imageUrl}
              exerciseName={currentExerciseData.name}
            />

            {currentExerciseData.instruction && (
              <p className="text-xs text-[#aaa] mt-3 bg-[#181818] p-3 rounded-2xl border border-[#262626]">
                {currentExerciseData.instruction}
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowMediaModal(false)}
              className="mt-4 w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Voltar ao Treino
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Quit Workout */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-[#262626] rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-[#F0F0F0]">Interromper Treino?</h3>
            <p className="text-xs text-[#888] mt-1 mb-5">
              Se você sair agora, o progresso desta sessão em andamento será descartado.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                id="cancel-quit-btn"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-full border border-[#262626] text-[#ccc] font-semibold text-xs hover:bg-[#181818]"
              >
                Continuar
              </button>
              <button
                type="button"
                id="confirm-quit-btn"
                onClick={onCancelWorkout}
                className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

