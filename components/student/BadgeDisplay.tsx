import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Lock } from 'lucide-react-native';
import type { Badge, StudentBadge } from '@/hooks/useBadges';

type BadgeDisplayProps = {
  badges: Badge[];
  earnedBadges: StudentBadge[];
};

export default function BadgeDisplay({ badges, earnedBadges }: BadgeDisplayProps) {
  // Split badges into earned and locked
  const earnedBadgeIds = earnedBadges.map(sb => sb.badge_id);
  const earnedBadgesData = badges.filter(badge => earnedBadgeIds.includes(badge.id));
  const lockedBadges = badges.filter(badge => !earnedBadgeIds.includes(badge.id));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.badgesContainer}>
        <Text style={styles.sectionTitle}>Earned Badges</Text>
        <View style={styles.badgeGrid}>
          {earnedBadgesData.map(badge => {
            const studentBadge = earnedBadges.find(sb => sb.badge_id === badge.id);
            return (
              <TouchableOpacity key={badge.id} style={styles.badgeCard}>
                <Image 
                  source={{ uri: badge.image_url || 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg' }} 
                  style={styles.badgeImage}
                />
                <View style={styles.badgeContent}>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDescription} numberOfLines={2}>
                    {badge.description}
                  </Text>
                  <Text style={styles.earnedDate}>
                    Earned {new Date(studentBadge?.awarded_at || '').toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={styles.sectionTitle}>Badges to Earn</Text>
        <View style={styles.badgeGrid}>
          {lockedBadges.map(badge => (
            <View key={badge.id} style={[styles.badgeCard, styles.lockedBadge]}>
              <View style={styles.lockedImageContainer}>
                <Image 
                  source={{ uri: badge.image_url || 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg' }} 
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
                <Text style={styles.requirementText}>
                  {badge.points} points required
                </Text>
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