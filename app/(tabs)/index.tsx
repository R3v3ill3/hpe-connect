import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, Users, ChartBar as BarChart2, CircleAlert as AlertCircle, CloudOff } from 'lucide-react-native';
import DashboardStats from '../../components/dashboard/DashboardStats';
import RecentActivity from '../../components/dashboard/RecentActivity';
import UpcomingLessons from '../../components/dashboard/UpcomingLessons';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProfile } from '@/hooks/useProfile';

export default function TeacherDashboard() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  const { stats, loading, error } = useDashboardStats();
  const { profile } = useProfile();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading dashboard: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isOffline && (
        <View style={styles.offlineWarning}>
          <CloudOff size={16} color="#fff" />
          <Text style={styles.offlineText}>Offline Mode - Changes will sync when connection restored</Text>
        </View>
      )}
      
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <Image 
            source={{ uri: profile?.avatar_url || 'https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
            style={styles.teacherAvatar}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome, {profile?.full_name || 'Teacher'}</Text>
            <Text style={styles.welcomeSubtitle}>
              {profile?.role === 'teacher' ? 'Teacher' : 'Student'} - {profile?.school || 'Update your school'}
            </Text>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#EFF6FF' }]}
            onPress={() => router.push('/lessons')}
          >
            <Calendar size={24} color="#2563EB" />
            <Text style={styles.quickActionText}>Plan Lesson</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#ECFDF5' }]}
            onPress={() => router.push('/students')}
          >
            <Users size={24} color="#059669" />
            <Text style={styles.quickActionText}>Class Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#FFF7ED' }]}
            onPress={() => router.push('/student-view')}
          >
            <Clock size={24} color="#F97316" />
            <Text style={styles.quickActionText}>Student View</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <DashboardStats stats={stats} />
      
      <View style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <AlertCircle size={20} color="#DC2626" />
          <Text style={styles.reminderTitle}>Reminder</Text>
        </View>
        <Text style={styles.reminderText}>
          Term assessment for Movement & Physical Activity due in 2 weeks
        </Text>
        <TouchableOpacity style={styles.reminderButton}>
          <Text style={styles.reminderButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Lessons</Text>
          <TouchableOpacity onPress={() => router.push('/lessons')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <UpcomingLessons lessons={stats.upcomingLessons} />
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <BarChart2 size={20} color="#64748B" />
        </View>
        <RecentActivity activities={stats.recentActivity} />
      </View>
      
      <View style={styles.offlineNotice}>
        <TouchableOpacity 
          style={styles.offlineButton}
          onPress={() => setIsOffline(!isOffline)}
        >
          <Text style={styles.offlineButtonText}>
            {isOffline ? "Go Online" : "Switch to Offline Mode"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.offlineInfoText}>
          Offline mode lets you work without an internet connection. Data will sync when you're back online.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
  offlineWarning: {
    backgroundColor: '#F97316',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
  welcomeSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teacherAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  reminderCard: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginLeft: 8,
  },
  reminderText: {
    fontSize: 14,
    marginBottom: 12,
  },
  reminderButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  reminderButtonText: {
    color: '#DC2626',
    fontWeight: '500',
    fontSize: 12,
  },
  sectionContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#2563EB',
    fontSize: 14,
  },
  offlineNotice: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  offlineButton: {
    backgroundColor: isOffline => isOffline ? '#2563EB' : '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  offlineButtonText: {
    color: isOffline => isOffline ? 'white' : '#64748B',
    fontWeight: '500',
  },
  offlineInfoText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});