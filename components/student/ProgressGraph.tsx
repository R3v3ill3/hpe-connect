import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProgressGraph() {
  // Simulated data for the graph
  const monthlyProgress = [
    { month: 'Jan', progress: 65 },
    { month: 'Feb', progress: 72 },
    { month: 'Mar', progress: 68 },
    { month: 'Apr', progress: 78 },
    { month: 'May', progress: 85 },
    { month: 'Jun', progress: 82 },
  ];
  
  const strandProgress = [
    { strand: 'Personal Health', progress: 82, color: '#2563EB' },
    { strand: 'Social Health', progress: 65, color: '#059669' },
    { strand: 'Community Health', progress: 48, color: '#F97316' },
    { strand: 'Movement Skills', progress: 76, color: '#8B5CF6' },
    { strand: 'Physical Activity', progress: 89, color: '#EC4899' },
  ];
  
  const questProgress = [
    { quest: 'Healthy Eating', completed: true, date: '2 weeks ago' },
    { quest: 'Active Play', completed: true, date: '1 month ago' },
    { quest: 'Water Safety', completed: false, progress: 67 },
    { quest: 'Team Games', completed: false, progress: 25 },
    { quest: 'Personal Safety', completed: true, date: '3 weeks ago' },
  ];

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
        <Text style={styles.sectionTitle}>Progress by Strand</Text>
        {strandProgress.map((data, index) => (
          <View key={index} style={styles.strandContainer}>
            <View style={styles.strandHeader}>
              <Text style={styles.strandName}>{data.strand}</Text>
              <Text style={styles.strandValue}>{data.progress}%</Text>
            </View>
            <View style={styles.strandBar}>
              <View 
                style={[
                  styles.strandProgress, 
                  { width: `${data.progress}%`, backgroundColor: data.color }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quest Completion</Text>
        {questProgress.map((quest, index) => (
          <View key={index} style={styles.questContainer}>
            <View style={styles.questInfo}>
              <Text style={styles.questName}>{quest.quest}</Text>
              {quest.completed ? (
                <Text style={styles.completedText}>Completed {quest.date}</Text>
              ) : (
                <View style={styles.questProgressContainer}>
                  <View style={styles.questProgressBar}>
                    <View 
                      style={[styles.questProgressFill, { width: `${quest.progress}%` }]} 
                    />
                  </View>
                  <Text style={styles.questProgressText}>{quest.progress}%</Text>
                </View>
              )}
            </View>
            <View 
              style={[
                styles.questStatus,
                quest.completed ? styles.questCompleted : styles.questInProgress
              ]}
            />
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
  strandContainer: {
    marginBottom: 16,
  },
  strandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  strandName: {
    fontSize: 14,
    fontWeight: '500',
  },
  strandValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  strandBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  strandProgress: {
    height: '100%',
  },
  questContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#059669',
  },
  questProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  questProgressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  questProgressText: {
    fontSize: 12,
    color: '#64748B',
  },
  questStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  questCompleted: {
    backgroundColor: '#059669',
  },
  questInProgress: {
    backgroundColor: '#2563EB',
  },
});