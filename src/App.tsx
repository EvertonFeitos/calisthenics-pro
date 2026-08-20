import React, { useState, useEffect, useMemo } from 'react';
import {
  LevelId,
  LevelInfo,
  Workout,
  WorkoutScheduleDay,
  Exercise,
  WorkoutSession,
  UserGoals,
  UserSettings,
  AIAnalysisResult,
} from './types';
import { workoutRepository } from './services/storage/repository';
import { soundService } from './services/soundService';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { LevelSelector } from './components/LevelSelector';
import { ScheduleView } from './components/ScheduleView';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { WorkoutEditorModal } from './components/WorkoutEditorModal';
import { ExerciseEditorModal } from './components/ExerciseEditorModal';
import { ExercisesDirectoryView } from './components/ExercisesDirectoryView';
import { ScheduleEditorModal } from './components/ScheduleEditorModal';
import { ActiveWorkoutView } from './components/ActiveWorkoutView';
import { PostWorkoutSummary } from './components/PostWorkoutSummary';
import { HistoryView } from './components/HistoryView';
import { ProgressView } from './components/ProgressView';
import { AICoachView } from './components/AICoachView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavTab>('schedule');
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>('basico');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [schedule, setSchedule] = useState<WorkoutScheduleDay[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoals>({
    primaryGoal: 'Dominar o peso corporal e ganhar força',
    experienceMonths: 0,
    weeklyTargetDays: 4,
    focusNotes: '',
  });
  const [userSettings, setUserSettings] = useState<UserSettings>({
    soundEnabled: true,
    defaultRestDuration: 120,
    autoStartRestTimer: true,
    vibrationEnabled: true,
  });
  const [aiAnalyses, setAIAnalyses] = useState<AIAnalysisResult[]>([]);

  // Active workout execution and modal states
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [postWorkoutSummary, setPostWorkoutSummary] = useState<WorkoutSession | null>(null);
  const [selectedWorkoutForDetail, setSelectedWorkoutForDetail] = useState<Workout | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isCreatingExercise, setIsCreatingExercise] = useState<boolean>(false);
  const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data from Repository on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [
          loadedLevels,
          savedLevelId,
          loadedExercises,
          loadedWorkouts,
          loadedSessions,
          savedGoals,
          savedSettings,
          savedAnalyses,
        ] = await Promise.all([
          workoutRepository.getLevels(),
          workoutRepository.getCurrentLevel(),
          workoutRepository.getExercises(),
          workoutRepository.getWorkouts(),
          workoutRepository.getWorkoutSessions(),
          workoutRepository.getUserGoals(),
          workoutRepository.getUserSettings(),
          workoutRepository.getAIAnalyses(),
        ]);

        setLevels(loadedLevels);
        setCurrentLevelId(savedLevelId);
        setExercises(loadedExercises);
        setWorkouts(loadedWorkouts);
        setSessions(loadedSessions);
        setUserGoals(savedGoals);
        setUserSettings(savedSettings);
        setAIAnalyses(savedAnalyses);
        soundService.setEnabled(savedSettings.soundEnabled);

        const loadedSchedule = await workoutRepository.getSchedule(savedLevelId);
        setSchedule(loadedSchedule);
      } catch (err) {
        console.error('Erro ao carregar dados do banco local:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Quick lookup maps
  const exercisesMap = useMemo(() => {
    const map: Record<string, Exercise> = {};
    exercises.forEach((ex) => {
      map[ex.id] = ex;
    });
    return map;
  }, [exercises]);

  const workoutsMap = useMemo(() => {
    const map: Record<string, Workout> = {};
    workouts.forEach((w) => {
      map[w.id] = w;
    });
    return map;
  }, [workouts]);

  const levelsMap = useMemo(() => {
    const map: Record<string, LevelInfo> = {};
    levels.forEach((l) => {
      map[l.id] = l;
    });
    return map;
  }, [levels]);

  const currentLevelInfo = useMemo(() => {
    return (
      levels.find((l) => l.id === currentLevelId) ||
      levels[0] || {
        id: 'basico',
        name: 'Básico',
        order: 1,
        badge: 'Nível 1',
        description: 'Fundamentos corporais e base isométrica.',
        idealFor: 'Iniciantes absolutos.',
      }
    );
  }, [levels, currentLevelId]);

  // Handle level change
  const handleSelectLevel = async (newLevelId: LevelId) => {
    setCurrentLevelId(newLevelId);
    await workoutRepository.setCurrentLevel(newLevelId);
    const newSchedule = await workoutRepository.getSchedule(newLevelId);
    setSchedule(newSchedule);
  };

  // Handle sound toggle
  const handleToggleSound = async () => {
    const newEnabled = !userSettings.soundEnabled;
    const updated = { ...userSettings, soundEnabled: newEnabled };
    setUserSettings(updated);
    soundService.setEnabled(newEnabled);
    await workoutRepository.saveUserSettings(updated);
  };

  // Handle settings update
  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    soundService.setEnabled(newSettings.soundEnabled);
    await workoutRepository.saveUserSettings(newSettings);
  };

  // Handle goals save
  const handleSaveGoals = async (newGoals: UserGoals) => {
    setUserGoals(newGoals);
    await workoutRepository.saveUserGoals(newGoals);
  };

  // Handle schedule save from editor modal
  const handleSaveSchedule = async (newSchedule: WorkoutScheduleDay[]) => {
    setSchedule(newSchedule);
    await workoutRepository.saveSchedule(currentLevelId, newSchedule);
  };

  // Handle schedule reset to default
  const handleResetSchedule = async () => {
    const reset = await workoutRepository.resetScheduleToDefault(currentLevelId);
    setSchedule(reset);
  };

  // Handle Save / Update Exercise
  const handleSaveExercise = async (exercise: Exercise) => {
    await workoutRepository.saveExercise(exercise);
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === exercise.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = exercise;
        return copy;
      }
      return [exercise, ...prev];
    });
    setEditingExercise(null);
    setIsCreatingExercise(false);
  };

  // Handle Delete Exercise
  const handleDeleteExercise = async (exerciseId: string) => {
    await workoutRepository.deleteExercise(exerciseId);
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    setEditingExercise(null);
  };

  // Handle Save Workout
  const handleSaveWorkout = async (updatedWorkout: Workout) => {
    await workoutRepository.saveWorkout(updatedWorkout);
    setWorkouts((prev) => {
      const idx = prev.findIndex((w) => w.id === updatedWorkout.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedWorkout;
        return copy;
      }
      return [...prev, updatedWorkout];
    });
    if (selectedWorkoutForDetail?.id === updatedWorkout.id) {
      setSelectedWorkoutForDetail(updatedWorkout);
    }
    setEditingWorkout(null);
  };

  // Start workout handler
  const handleStartWorkout = (workout: Workout) => {
    setSelectedWorkoutForDetail(null);
    setActiveWorkout(workout);
    setPostWorkoutSummary(null);
  };

  // Complete and save workout
  const handleFinishWorkout = async (session: WorkoutSession) => {
    await workoutRepository.saveWorkoutSession(session);
    setSessions((prev) => [session, ...prev]);
    setActiveWorkout(null);
    setPostWorkoutSummary(session);
  };

  // Cancel workout
  const handleCancelWorkout = () => {
    setActiveWorkout(null);
  };

  // Delete session from history
  const handleDeleteSession = async (sessionId: string) => {
    await workoutRepository.deleteWorkoutSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Save new AI analysis
  const handleSaveNewAnalysis = async (analysis: AIAnalysisResult) => {
    await workoutRepository.saveAIAnalysis(analysis);
    setAIAnalyses((prev) => [analysis, ...prev]);
  };

  // Clear all data
  const handleClearAllData = async () => {
    await workoutRepository.clearAllData();
  };

  // Filter workouts for current level in editor
  const availableWorkoutsForCurrentLevel = useMemo(() => {
    const direct = workouts.filter((w) => w.levelId === currentLevelId);
    return direct.length > 0 ? direct : workouts;
  }, [workouts, currentLevelId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F0F0F0] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-[#888] tracking-widest uppercase">
          Carregando Calistenia Pro...
        </p>
      </div>
    );
  }

  // Active workout execution modal (Fullscreen takeover)
  if (activeWorkout) {
    return (
      <ActiveWorkoutView
        workout={activeWorkout}
        currentLevelId={currentLevelId}
        exercisesMap={exercisesMap}
        defaultRestDuration={userSettings.defaultRestDuration}
        soundEnabled={userSettings.soundEnabled}
        onFinishWorkout={handleFinishWorkout}
        onCancelWorkout={handleCancelWorkout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F0F0F0] font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        currentLevelInfo={currentLevelInfo}
        levels={levels}
        onSelectLevel={handleSelectLevel}
        soundEnabled={userSettings.soundEnabled}
        onToggleSound={handleToggleSound}
        completedWorkoutsCount={sessions.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 pb-24">
        {/* Post-Workout Summary Celebratory View */}
        {postWorkoutSummary ? (
          <PostWorkoutSummary
            session={postWorkoutSummary}
            levelInfo={currentLevelInfo}
            onGoToHistory={() => {
              setPostWorkoutSummary(null);
              setCurrentTab('history');
            }}
            onGoToSchedule={() => {
              setPostWorkoutSummary(null);
              setCurrentTab('schedule');
            }}
          />
        ) : (
          <>
            {/* Level Quick Switcher Banner (shown in schedule tab) */}
            {currentTab === 'schedule' && (
              <LevelSelector
                levels={levels}
                currentLevelId={currentLevelId}
                onSelectLevel={handleSelectLevel}
              />
            )}

            {/* Current Active Tab */}
            {currentTab === 'schedule' && (
              <ScheduleView
                currentLevel={currentLevelInfo}
                schedule={schedule}
                workoutsMap={workoutsMap}
                exercisesMap={exercisesMap}
                onSelectWorkoutForDetail={(w) => setSelectedWorkoutForDetail(w)}
                onStartWorkout={handleStartWorkout}
                onOpenScheduleEditor={() => setIsScheduleEditorOpen(true)}
                onOpenWorkoutEditor={(w) => setEditingWorkout(w)}
              />
            )}

            {currentTab === 'exercises' && (
              <ExercisesDirectoryView
                exercises={exercises}
                levels={levels}
                currentLevelId={currentLevelId}
                onOpenCreateExercise={() => setIsCreatingExercise(true)}
                onOpenEditExercise={(ex) => setEditingExercise(ex)}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                sessions={sessions}
                levelsMap={levelsMap}
                onDeleteSession={handleDeleteSession}
                onStartNewWorkout={() => setCurrentTab('schedule')}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressView sessions={sessions} exercisesMap={exercisesMap} />
            )}

            {currentTab === 'coach' && (
              <AICoachView
                currentLevel={currentLevelInfo}
                userGoals={userGoals}
                onSaveGoals={handleSaveGoals}
                sessions={sessions}
                schedule={schedule}
                workouts={availableWorkoutsForCurrentLevel}
                pastAnalyses={aiAnalyses}
                onSaveNewAnalysis={handleSaveNewAnalysis}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={userSettings}
                onUpdateSettings={handleUpdateSettings}
                currentLevel={currentLevelInfo}
                onResetCurrentSchedule={handleResetSchedule}
                onClearAllData={handleClearAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Workout Detail Modal */}
      {selectedWorkoutForDetail && (
        <WorkoutDetailModal
          workout={selectedWorkoutForDetail}
          exercisesMap={exercisesMap}
          onClose={() => setSelectedWorkoutForDetail(null)}
          onStartWorkout={handleStartWorkout}
          onEditWorkout={(w) => {
            setSelectedWorkoutForDetail(null);
            setEditingWorkout(w);
          }}
          onEditExercise={(ex) => {
            setEditingExercise(ex);
          }}
        />
      )}

      {/* Workout Editor Modal */}
      {editingWorkout && (
        <WorkoutEditorModal
          workout={editingWorkout}
          allExercises={exercises}
          exercisesMap={exercisesMap}
          levelName={currentLevelInfo.name}
          onClose={() => setEditingWorkout(null)}
          onSaveWorkout={handleSaveWorkout}
          onOpenNewExerciseModal={() => setIsCreatingExercise(true)}
          onEditExercise={(ex) => setEditingExercise(ex)}
        />
      )}

      {/* Exercise Create / Edit Modal */}
      {(editingExercise || isCreatingExercise) && (
        <ExerciseEditorModal
          exercise={editingExercise}
          initialLevelId={currentLevelId}
          onClose={() => {
            setEditingExercise(null);
            setIsCreatingExercise(false);
          }}
          onSave={handleSaveExercise}
          onDelete={editingExercise ? handleDeleteExercise : undefined}
        />
      )}

      {/* Schedule Editor Modal */}
      {isScheduleEditorOpen && (
        <ScheduleEditorModal
          levelId={currentLevelId}
          levelName={currentLevelInfo.name}
          schedule={schedule}
          availableWorkouts={availableWorkoutsForCurrentLevel}
          onClose={() => setIsScheduleEditorOpen(false)}
          onSaveSchedule={handleSaveSchedule}
          onResetDefault={handleResetSchedule}
        />
      )}

      {/* Fixed Bottom Navigation */}
      {!activeWorkout && !postWorkoutSummary && (
        <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
      )}
    </div>
  );
}
