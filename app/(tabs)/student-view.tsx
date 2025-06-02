import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Trophy, Star, Award, Activity, BookOpen, CircleCheck as CheckCircle, MapPin } from 'lucide-react-native';
import QuestCard from '../../components/student/QuestCard';
import BadgeDisplay from '../../components/student/BadgeDisplay';
import ProgressGraph from '../../components/student/ProgressGraph';
import { useQuests } from '@/hooks/useQuests';
import { useBadges } from '@/hooks/useBadges';
import { useProfile } from '@/hooks/useProfile';

export default function StudentViewScreen() {
  const [activeTab, setActiveTab] = useState('quests');
  const { profile, loading: profileLoading } = useProfile();
  const { 
    quests, 
    questProgress, 
    loading: questsLoading, 
    error: questsError,
    updateQuestProgress 
  } = useQuests();
  const { 
    badges, 
    studentBadges, 
    loading: badgesLoading, 
    error: badgesError 
  } = useBadges();

  const loading = profileLoading || questsLoading || badgesLoading;
  const error = questsError || badgesError;

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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Calculate total points from completed quests and earned badges
  const totalPoints = studentBadges.reduce((sum, sb) => {
    const badge = badges.find(b => b.id === sb.badge_id);
    return sum + (badge?.points || 0);
  }, 0);

  // Calculate completion stats
  const completedQuests = questProgress.filter(qp => qp.status === 'completed').length;
  const inProgressQuests = questProgress.filter(qp => qp.status === 'in_progress').length;
  const earnedBadges = studentBadges.length;

  // Get current quest (most recently started incomplete quest)
  const currentQuest = questProgress
    .filter(qp => qp.status === 'in_progress')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  const currentQuestDetails = currentQuest 
    ? quests.find(q => q.id === currentQuest.quest_id)
    : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBanner}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/7432493/pexels-photo-7432493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
          style={styles.bannerImage}
        />
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Hi, {profile?.full_name?.split(' ')[0] || 'Student'}!</Text>
          <Text style={styles.subText}>
            Year {profile?.year_level} - {profile?.school || 'Update your school'}
          </Text>
          
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>
              Level {Math.floor(totalPoints / 100) + 1} Explorer
            </Text>
            <Star size={14} color="#FFB800" />
          </View>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Trophy size={20} color="#F97316" />
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={20} color="#2563EB" />
          <Text style={styles.statValue}>{earnedBadges}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.statValue}>{completedQuests}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
      
      {currentQuestDetails && (
        <View style={styles.currentQuest}>
          <View style={styles.questHeader}>
            <MapPin size={18} color="#2563EB" />
            <Text style={styles.currentQuestText}>Current Quest</Text>
          </View>
          <View style={styles.questContent}>
            <Text style={styles.questTitle}>{currentQuestDetails.title}</Text>
            <View style={styles.questProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${currentQuest.progress}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>{currentQuest.progress}% complete</Text>
            </View>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => {/* Navigate to quest details */}}
            >
              <Text style={styles.continueText}>Continue Quest</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'quests' && styles.activeTab]}
          onPress={() => setActiveTab('quests')}
        >
          <BookOpen size={16} color={activeTab === 'quests' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'quests' && styles.activeTabText]}>
            My Quests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Award size={16} color={activeTab === 'badges' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
            My Badges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
          onPress={() => setActiveTab('progress')}
        >
          <Activity size={16} color={activeTab === 'progress' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
            My Progress
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'quests' && (
        <View style={styles.questsContainer}>
          {quests.map(quest => (
            <QuestCard 
              key={quest.id} 
              quest={quest}
              progress={questProgress.find(qp => qp.quest_id === quest.id)}
              onProgress={updateQuestProgress}
            />
          ))}
        </View>
      )}
      
      {activeTab === 'badges' && (
        <BadgeDisplay 
          badges={badges}
          earnedBadges={studentBadges}
        />
      )}
      
      {activeTab === 'progress' && (
        <ProgressGraph 
          questProgress={questProgress}
          quests={quests}
        />
      )}
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
  headerBanner: {
    height: 150,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    position: 'absolute',
  },
  headerContent: {
    height: '100%',
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  currentQuest: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
  },
  currentQuestText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  questContent: {
    padding: 16,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  questProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64748B',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  questsContainer: {
    padding: 16,
  },
});