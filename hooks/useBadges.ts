import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export type Badge = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  requirements: any | null;
  created_at: string;
};

export type StudentBadge = {
  id: string;
  student_id: string;
  badge_id: string;
  awarded_at: string;
};

export function useBadges() {
  const { session } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [studentBadges, setStudentBadges] = useState<StudentBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchBadges();
    fetchStudentBadges();
  }, [session]);

  async function fetchBadges() {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
  }

  async function fetchStudentBadges() {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('student_badges')
        .select('*')
        .eq('student_id', session.user.id);

      if (error) throw error;
      setStudentBadges(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    badges,
    studentBadges,
    loading,
    error,
    refreshBadges: fetchBadges,
    refreshStudentBadges: fetchStudentBadges,
  };
}