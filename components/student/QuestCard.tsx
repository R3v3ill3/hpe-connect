import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Calendar, Award, ChevronRight, MapPin } from 'lucide-react-native';
import type { Quest, QuestProgress } from '@/hooks/useQuests';

type QuestCardProps = {
  quest: Quest;
  progress?: QuestProgress;
  onProgress: (questId: string, progress: number) => Promise<void>;
};

export default function QuestCard({ quest, progress, onProgress }: QuestCardProps) {
  const handleContinue = async () => {
    // Simulate progress update (in a real app, this would be based on actual completion)
    const currentProgress = progress?.progress || 0;
    const newProgress = Math.min(currentProgress + 20, 100);
    await onProgress(quest.id, newProgress);
  };

  const getStatusColor = () => {
    if (progress?.status === 'completed') return '#059669';
    if (progress?.status === 'in_progress') return '#2563EB';
    return '#64748B';
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: quest.image_url || 'https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg' }} 
          style={styles.questImage}
        />
        <View 
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + '20' }
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {progress?.status === 'completed' ? 'Completed' : 
             progress?.status === 'in_progress' ? 'In Progress' : 
             'Not Started'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{quest.title}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.infoText}>
              {new Date(quest.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.infoText}>{quest.duration || 'Flexible'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Award size={14} color="#F97316" />
            <Text style={[styles.infoText, styles.pointsText]}>{quest.points} pts</Text>
          </View>
        </View>
        
        {progress?.status === 'in_progress' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progress.progress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{progress.progress}% complete</Text>
          </View>
        )}
        
        {quest.description && (
          <View style={styles.descriptionContainer}>
            <MapPin size={14} color="#2563EB" />
            <Text style={styles.descriptionText}>
              {quest.description}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        {progress?.status === 'completed' ? (
          <View style={styles.completedContainer}>
            <Award size={16} color="#059669" />
            <Text style={styles.completedText}>Earned {quest.points} points</Text>
          </View>
        ) : progress?.status === 'in_progress' ? (
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue Quest</Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => onProgress(quest.id, 0)}
          >
            <Text style={styles.startText}>Start Quest</Text>
          </TouchableOpacity>
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
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  descriptionText: {
    flex: 1,
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
  startButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  startText: {
    color: '#2563EB',
    fontWeight: '500',
  },
});