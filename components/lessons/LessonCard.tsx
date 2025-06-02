import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FileText, Clock, Calendar, ChevronRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import type { Lesson } from '@/hooks/useLessons';

type LessonCardProps = {
  lesson: Lesson;
  isTeacher: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function LessonCard({ lesson, isTeacher, onEdit, onDelete }: LessonCardProps) {
  const handleDelete = async () => {
    Alert.alert(
      'Delete Lesson',
      'Are you sure you want to delete this lesson? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('lessons')
                .delete()
                .eq('id', lesson.id);

              if (error) throw error;
              onDelete();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete lesson');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View 
          style={[
            styles.strandIndicator,
            lesson.strand.includes('Personal') ? styles.personalStrand : styles.movementStrand
          ]}
        />
        <Text style={styles.title}>{lesson.title}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.infoText}>Year {lesson.year_level}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.infoText}>{lesson.duration || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <FileText size={14} color="#64748B" />
            <Text style={styles.infoText}>
              {lesson.activities ? Object.keys(lesson.activities).length : 0} activities
            </Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description || 'No description provided'}
        </Text>
        
        <View style={styles.tagsRow}>
          <View style={styles.strandTag}>
            <Text style={styles.strandTagText}>{lesson.strand}</Text>
          </View>
          <View style={styles.topicTag}>
            <Text style={styles.topicTagText}>{lesson.topic}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        {isTeacher && (
          <>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEdit}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.moreButton}>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  strandIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  personalStrand: {
    backgroundColor: '#2563EB',
  },
  movementStrand: {
    backgroundColor: '#F97316',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    padding: 16,
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
  description: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  strandTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  strandTagText: {
    fontSize: 12,
    color: '#2563EB',
  },
  topicTag: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  topicTagText: {
    fontSize: 12,
    color: '#64748B',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    padding: 12,
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewButtonText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  editButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  editButtonText: {
    color: '#059669',
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  moreButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});