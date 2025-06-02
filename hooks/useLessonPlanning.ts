import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export type LessonTemplate = {
  id: string;
  title: string;
  description: string | null;
  structure: any;
  curriculum_links: any;
  created_at: string;
  created_by: string;
};

export type LessonPlanningOptions = {
  templateId: string;
  yearLevel: string;
  strand: string;
  topic: string;
  duration: string;
};

export function useLessonPlanning() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLessonPlan = async (options: LessonPlanningOptions) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: genError } = await supabase
        .rpc('generate_lesson_plan', {
          template_id: options.templateId,
          year_level: options.yearLevel,
          strand: options.strand,
          topic: options.topic,
          duration: options.duration
        });

      if (genError) throw genError;
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate lesson plan');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch templates');
      throw e;
    }
  };

  const getCurriculumStandards = async (yearLevel: string, strand: string) => {
    try {
      const { data, error } = await supabase
        .from('curriculum_standards')
        .select('*')
        .eq('year_level', yearLevel)
        .eq('strand', strand);

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch curriculum standards');
      throw e;
    }
  };

  return {
    generateLessonPlan,
    getTemplates,
    getCurriculumStandards,
    loading,
    error
  };
}