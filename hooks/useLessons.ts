import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  year_level: string;
  strand: string;
  topic: string;
  duration: string | null;
  activities: any | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLessons(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const createLesson = async (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([lesson])
        .select()
        .single();

      if (error) throw error;
      setLessons(prev => [data, ...prev]);
      return data;
    } catch (e) {
      throw e;
    }
  };

  const updateLesson = async (id: string, updates: Partial<Lesson>) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setLessons(prev => prev.map(lesson => lesson.id === id ? data : lesson));
      return data;
    } catch (e) {
      throw e;
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
    } catch (e) {
      throw e;
    }
  };

  return {
    lessons,
    loading,
    error,
    createLesson,
    updateLesson,
    deleteLesson,
    refreshLessons: fetchLessons
  };
}