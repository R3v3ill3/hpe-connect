import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Calendar, Award, ChevronRight, MapPin } from 'lucide-react-native';

export default function QuestCard({ quest }) {
  // Calculate status color
  const getStatusColor = () => {
    if (quest.status === 'completed') return '#059669';
    if (quest.status === 'active') return '#2563EB';
    return '#64748B';
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: quest.image }} 
          style={styles.questImage}
        />
        <View 
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + '20' } // Adding transparency
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {quest.status === 'completed' ? 'Completed' : 
             quest.status === 'active' ? 'Active' : 
             'Coming Soon'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{quest.title}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.infoText}>{quest.dueDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.infoText}>{quest.duration}</Text>
          </View>
          {quest.points > 0 && (
            <View style={styles.infoItem}>
              <Award size={14} color="#F97316" />
              <Text style={[styles.infoText, styles.pointsText]}>{quest.points} pts</Text>
            </View>
          )}
        </View>
        
        {quest.status === 'active' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${quest.progress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{quest.progress}% complete</Text>
          </View>
        )}
        
        {quest.status === 'active' && (
          <View style={styles.currentActivity}>
            <MapPin size={14} color="#2563EB" />
            <Text style={styles.currentActivityText}>
              Current: {quest.currentActivity}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        {quest.status === 'completed' ? (
          <View style={styles.completedContainer}>
            <Award size={16} color="#059669" />
            <Text style={styles.completedText}>Earned {quest.points} points</Text>
          </View>
        ) : quest.status === 'active' ? (
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue Quest</Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        ) : (
          <Text style={styles.lockedText}>Unlocks {quest.unlocksOn}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    position: 'relative',
  },
  questImage: {
    width: '100%',
    height: 120,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  pointsText: {
    color: '#F97316',
    fontWeight: '500',
  },
  progressContainer: {
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
  progressText: {
    fontSize: 12,
    color: '#64748B',
  },
  currentActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  currentActivityText: {
    fontSize: 12,
    color: '#2563EB',
    marginLeft: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    padding: 16,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#059669',
    fontWeight: '500',
    marginLeft: 6,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: 'white',
    fontWeight: '500',
    marginRight: 4,
  },
  lockedText: {
    textAlign: 'center',
    color: '#64748B',
    fontStyle: 'italic',
  },
});