import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Award, ChevronRight } from 'lucide-react-native';
import type { Profile } from '@/hooks/useProfile';
import { useStudentProgress } from '@/hooks/useStudentProgress';

type StudentCardProps = {
  student: Profile;
};

export default function StudentCard({ student }: StudentCardProps) {
  const { progress, loading } = useStudentProgress(student.id);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ 
            uri: student.avatar_url || 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }} 
          style={styles.avatar} 
        />
        <View style={styles.studentInfo}>
          <Text style={styles.name}>{student.full_name || 'Unnamed Student'}</Text>
          <Text style={styles.details}>
            ID: {student.id.slice(0, 8)} • Year {student.year_level || 'N/A'}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Learning Progress</Text>
          <Text style={styles.progressPercentage}>
            {progress?.average_completion_rate || 0}%
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress?.average_completion_rate || 0}%` },
              (progress?.average_completion_rate || 0) < 60 ? styles.lowProgress : 
              (progress?.average_completion_rate || 0) < 80 ? styles.mediumProgress : 
              styles.highProgress
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.completed_quests || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.current_quests || 0}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.badgeContainer}>
            <Award size={16} color="#F97316" />
            <Text style={styles.statValue}>{progress?.total_points || 0}</Text>
          </View>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignButton}>
          <Text style={styles.assignButtonText}>Assign Quest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: '#64748B',
  },
  progressSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  lowProgress: {
    backgroundColor: '#DC2626',
  },
  mediumProgress: {
    backgroundColor: '#F97316',
  },
  highProgress: {
    backgroundColor: '#059669',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewButtonText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  assignButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  assignButtonText: {
    color: '#059669',
    fontWeight: '500',
  },
  moreButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});