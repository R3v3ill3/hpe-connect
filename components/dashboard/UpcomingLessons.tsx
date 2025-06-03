import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, ChevronRight } from 'lucide-react-native';

export default function UpcomingLessons() {
  const lessons = [
    {
      id: '1',
      title: 'Healthy Food Choices',
      date: 'Today, 10:30 AM',
      strand: 'Personal, Social and Community Health',
      status: 'ready',
    },
    {
      id: '2',
      title: 'Movement Skills Practice',
      date: 'Tomorrow, 9:15 AM',
      strand: 'Movement and Physical Activity',
      status: 'ready',
    },
    {
      id: '3',
      title: 'Keeping Safe in Water',
      date: 'Friday, 11:00 AM',
      strand: 'Personal, Social and Community Health',
      status: 'draft',
    },
  ];

  return (
    <View style={styles.container}>
      {lessons.map(lesson => (
        <TouchableOpacity key={lesson.id} style={styles.lessonItem}>
          <View style={styles.lessonHeader}>
            <View 
              style={[
                styles.strandIndicator, 
                lesson.strand.includes('Personal') ? styles.personalStrand : styles.movementStrand
              ]} 
            />
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
          </View>
          
          <View style={styles.lessonDetails}>
            <View style={styles.dateContainer}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.dateText}>{lesson.date}</Text>
            </View>
            
            <Text style={styles.strandText}>{lesson.strand}</Text>
            
            <View style={styles.lessonFooter}>
              <View 
                style={[
                  styles.statusBadge,
                  lesson.status === 'ready' ? styles.readyStatus : styles.draftStatus
                ]}
              >
                <Text 
                  style={[
                    styles.statusText,
                    lesson.status === 'ready' ? styles.readyStatusText : styles.draftStatusText
                  ]}
                >
                  {lesson.status === 'ready' ? 'Ready' : 'Draft'}
                </Text>
              </View>
              
              <ChevronRight size={16} color="#64748B" />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  lessonItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  strandIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  personalStrand: {
    backgroundColor: '#2563EB',
  },
  movementStrand: {
    backgroundColor: '#F97316',
  },
  lessonTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  lessonDetails: {
    marginLeft: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  strandText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  readyStatus: {
    backgroundColor: '#ECFDF5',
  },
  draftStatus: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  readyStatusText: {
    color: '#059669',
  },
  draftStatusText: {
    color: '#64748B',
  },
});