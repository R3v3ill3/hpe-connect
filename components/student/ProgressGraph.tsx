import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { Quest, QuestProgress } from '@/hooks/useQuests';

type ProgressGraphProps = {
  questProgress: QuestProgress[];
  quests: Quest[];
};

export default function ProgressGraph({ questProgress, quests }: ProgressGraphProps) {
  // Calculate monthly progress
  const monthlyProgress = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    
    const monthProgress = questProgress.filter(qp => {
      const progressDate = new Date(qp.updated_at);
      return progressDate.getMonth() === date.getMonth() &&
             progressDate.getFullYear() === date.getFullYear();
    });
    
    const avgProgress = monthProgress.length > 0
      ? monthProgress.reduce((sum, qp) => sum + qp.progress, 0) / monthProgress.length
      : 0;
    
    return { month, progress: Math.round(avgProgress) };
  }).reverse();

  // Calculate progress by topic
  const topicProgress = quests.reduce((acc, quest) => {
    const progress = questProgress.find(qp => qp.quest_id === quest.id);
    if (!acc[quest.title]) {
      acc[quest.title] = {
        completed: 0,
        total: 0,
        progress: 0,
      };
    }
    acc[quest.title].total++;
    if (progress?.status === 'completed') {
      acc[quest.title].completed++;
    }
    acc[quest.title].progress = (acc[quest.title].completed / acc[quest.title].total) * 100;
    return acc;
  }, {} as Record<string, { completed: number; total: number; progress: number }>);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Progress</Text>
        <View style={styles.graphContainer}>
          {monthlyProgress.map((data, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barLabel}>{data.month}</Text>
              </View>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: `${data.progress}%` },
                    data.progress > 80 ? styles.highBar : 
                    data.progress > 70 ? styles.mediumBar : 
                    styles.lowBar
                  ]} 
                />
              </View>
              <Text style={styles.barValue}>{data.progress}%</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress by Topic</Text>
        {Object.entries(topicProgress).map(([topic, data], index) => (
          <View key={topic} style={styles.topicContainer}>
            <View style={styles.topicHeader}>
              <Text style={styles.topicName}>{topic}</Text>
              <Text style={styles.topicValue}>{Math.round(data.progress)}%</Text>
            </View>
            <View style={styles.topicBar}>
              <View 
                style={[
                  styles.topicProgress, 
                  { width: `${data.progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.completionText}>
              {data.completed} of {data.total} completed
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  graphContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barLabelContainer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  barWrapper: {
    height: '100%',
    width: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  highBar: {
    backgroundColor: '#059669',
  },
  mediumBar: {
    backgroundColor: '#2563EB',
  },
  lowBar: {
    backgroundColor: '#F97316',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  topicContainer: {
    marginBottom: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  topicName: {
    fontSize: 14,
    fontWeight: '500',
  },
  topicValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  topicBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  topicProgress: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  completionText: {
    fontSize: 12,
    color: '#64748B',
  },
});