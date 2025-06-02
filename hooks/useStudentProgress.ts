import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type StudentProgress = {
  id: string;
  student_id: string;
  completed_quests: number;
  current_quests: number;
  total_points: number;
  average_completion_rate: number;
  created_at: string;
  updated_at: string;
};

export function useStudentProgress(studentId: string) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    fetchProgress();
  }, [studentId]);

  async function fetchProgress() {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      setProgress(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    progress,
    loading,
    error,
    refreshProgress: fetchProgress
  };
}