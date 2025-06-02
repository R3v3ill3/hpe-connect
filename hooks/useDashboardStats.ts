import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type DashboardStats = {
  activeStudents: number;
  lessonPlans: number;
  timeSaved: number;
  badgesEarned: number;
  recentActivity: Array<{
    id: string;
    type: 'lesson' | 'students' | 'time' | 'badge';
    title: string;
    time: string;
  }>;
  upcomingLessons: Array<{
    id: string;
    title: string;
    date: string;
    strand: string;
    status: 'ready' | 'draft';
  }>;
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    activeStudents: 0,
    lessonPlans: 0,
    timeSaved: 0,
    badgesEarned: 0,
    recentActivity: [],
    upcomingLessons: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Fetch active students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Fetch lessons count
      const { count: lessonsCount, error: lessonsError } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      if (lessonsError) throw lessonsError;

      // Fetch total badges earned
      const { count: badgesCount, error: badgesError } = await supabase
        .from('student_badges')
        .select('*', { count: 'exact', head: true });

      if (badgesError) throw badgesError;

      // Fetch recent activity
      const { data: recentActivity, error: activityError } = await supabase
        .from('lessons')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityError) throw activityError;

      // Fetch upcoming lessons
      const { data: upcomingLessons, error: upcomingError } = await supabase
        .from('lessons')
        .select('id, title, strand')
        .order('created_at', { ascending: false })
        .limit(3);

      if (upcomingError) throw upcomingError;

      // Transform the data
      const formattedActivity = recentActivity.map(activity => ({
        id: activity.id,
        type: 'lesson' as const,
        title: `Created "${activity.title}" lesson`,
        time: new Date(activity.created_at).toLocaleDateString(),
      }));

      const formattedLessons = upcomingLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        date: 'Today',
        strand: lesson.strand,
        status: 'ready' as const,
      }));

      setStats({
        activeStudents: studentsCount || 0,
        lessonPlans: lessonsCount || 0,
        timeSaved: 14, // This would be calculated based on actual usage metrics
        badgesEarned: badgesCount || 0,
        recentActivity: formattedActivity,
        upcomingLessons: formattedLessons,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
}