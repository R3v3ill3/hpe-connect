import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export type Quest = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  duration: string | null;
  status: 'draft' | 'active' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type QuestProgress = {
  id: string;
  student_id: string;
  quest_id: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useQuests() {
  const { session } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchQuests();
    fetchQuestProgress();
  }, [session]);

  async function fetchQuests() {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuests(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
  }

  async function fetchQuestProgress() {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('quest_progress')
        .select('*')
        .eq('student_id', session.user.id);

      if (error) throw error;
      setQuestProgress(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const updateQuestProgress = async (questId: string, progress: number) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('quest_progress')
        .upsert({
          student_id: session.user.id,
          quest_id: questId,
          progress,
          status: progress >= 100 ? 'completed' : 'in_progress',
          completed_at: progress >= 100 ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      setQuestProgress(prev => {
        const index = prev.findIndex(p => p.quest_id === questId);
        if (index >= 0) {
          return [...prev.slice(0, index), data, ...prev.slice(index + 1)];
        }
        return [...prev, data];
      });
      return data;
    } catch (e) {
      throw e;
    }
  };

  return {
    quests,
    questProgress,
    loading,
    error,
    updateQuestProgress,
    refreshQuests: fetchQuests,
    refreshQuestProgress: fetchQuestProgress,
  };
}