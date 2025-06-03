import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleUser as UserCircle, Book, Clock, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import type { DashboardStats } from '@/hooks/useDashboardStats';

type DashboardStatsProps = {
  stats: DashboardStats;
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.statCard, styles.blueCard]}>
          <View style={styles.statHeader}>
            <UserCircle size={20} color="#2563EB" />
            <View style={[styles.changeIndicator, styles.increaseIndicator]}>
              <ArrowUpRight size={14} color="#059669" />
              <Text style={styles.changeText}>+2</Text>
            </View>
          </View>
          <Text style={styles.statValue}>{stats.activeStudents}</Text>
          <Text style={styles.statLabel}>Active Students</Text>
        </View>
        
        <View style={[styles.statCard, styles.greenCard]}>
          <View style={styles.statHeader}>
            <Book size={20} color="#059669" />
            <View style={[styles.changeIndicator, styles.increaseIndicator]}>
              <ArrowUpRight size={14} color="#059669" />
              <Text style={styles.changeText}>+5</Text>
            </View>
          </View>
          <Text style={styles.statValue}>{stats.lessonPlans}</Text>
          <Text style={styles.statLabel}>Lesson Plans</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.statCard, styles.orangeCard]}>
          <View style={styles.statHeader}>
            <Clock size={20} color="#F97316" />
            <View style={[styles.changeIndicator, styles.decreaseIndicator]}>
              <ArrowDownRight size={14} color="#DC2626" />
              <Text style={[styles.changeText, styles.decreaseText]}>-3h</Text>
            </View>
          </View>
          <Text style={styles.statValue}>{stats.timeSaved}h</Text>
          <Text style={styles.statLabel}>Time Saved</Text>
        </View>
        
        <View style={[styles.statCard, styles.purpleCard]}>
          <View style={styles.statHeader}>
            <Award size={20} color="#8B5CF6" />
            <View style={[styles.changeIndicator, styles.increaseIndicator]}>
              <ArrowUpRight size={14} color="#059669" />
              <Text style={styles.changeText}>+12</Text>
            </View>
          </View>
          <Text style={styles.statValue}>{stats.badgesEarned}</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  blueCard: {
    backgroundColor: '#EFF6FF',
  },
  greenCard: {
    backgroundColor: '#ECFDF5',
  },
  orangeCard: {
    backgroundColor: '#FFF7ED',
  },
  purpleCard: {
    backgroundColor: '#F5F3FF',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  increaseIndicator: {
    backgroundColor: '#D1FAE5',
  },
  decreaseIndicator: {
    backgroundColor: '#FEE2E2',
  },
  changeText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 2,
    fontFamily: 'Inter_500Medium',
  },
  decreaseText: {
    color: '#DC2626',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
});