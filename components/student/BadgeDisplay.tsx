import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Lock } from 'lucide-react-native';

export default function BadgeDisplay() {
  const earnedBadges = [
    {
      id: '1',
      title: 'Nutrition Expert',
      description: 'Completed all healthy eating quests',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      dateEarned: '2 weeks ago',
    },
    {
      id: '2',
      title: 'Activity Master',
      description: 'Completed 5 movement activities',
      image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      dateEarned: '1 month ago',
    },
    {
      id: '3',
      title: 'Safety Star',
      description: 'Learned all personal safety skills',
      image: 'https://images.pexels.com/photos/1796794/pexels-photo-1796794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      dateEarned: '3 weeks ago',
    },
    {
      id: '4',
      title: 'Team Player',
      description: 'Participated in 3 group activities',
      image: 'https://images.pexels.com/photos/8845654/pexels-photo-8845654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      dateEarned: '1 week ago',
    },
  ];
  
  const lockedBadges = [
    {
      id: '5',
      title: 'Water Safety Pro',
      description: 'Complete all water safety lessons',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      requirement: '2/3 lessons completed',
    },
    {
      id: '6',
      title: 'Fitness Champion',
      description: 'Log 10 movement activities',
      image: 'https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      requirement: '6/10 activities logged',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.badgesContainer}>
        <Text style={styles.sectionTitle}>Earned Badges</Text>
        <View style={styles.badgeGrid}>
          {earnedBadges.map(badge => (
            <TouchableOpacity key={badge.id} style={styles.badgeCard}>
              <Image 
                source={{ uri: badge.image }} 
                style={styles.badgeImage}
              />
              <View style={styles.badgeContent}>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDescription} numberOfLines={2}>
                  {badge.description}
                </Text>
                <Text style={styles.earnedDate}>Earned {badge.dateEarned}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Badges to Earn</Text>
        <View style={styles.badgeGrid}>
          {lockedBadges.map(badge => (
            <View key={badge.id} style={[styles.badgeCard, styles.lockedBadge]}>
              <View style={styles.lockedImageContainer}>
                <Image 
                  source={{ uri: badge.image }} 
                  style={[styles.badgeImage, styles.lockedImage]}
                />
                <View style={styles.lockOverlay}>
                  <Lock size={24} color="white" />
                </View>
              </View>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDescription} numberOfLines={2}>
                  {badge.description}
                </Text>
                <Text style={styles.requirementText}>{badge.requirement}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badgesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  badgeGrid: {
    marginBottom: 24,
  },
  badgeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  lockedBadge: {
    opacity: 0.8,
  },
  badgeImage: {
    width: '100%',
    height: 120,
  },
  lockedImageContainer: {
    position: 'relative',
  },
  lockedImage: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContent: {
    padding: 12,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  earnedDate: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  requirementText: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '500',
  },
});