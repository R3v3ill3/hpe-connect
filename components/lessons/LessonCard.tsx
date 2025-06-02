import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Clock, Calendar, Tag, ChevronRight } from 'lucide-react-native';

export default function LessonCard({ lesson }) {
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
            <Text style={styles.infoText}>Year {lesson.yearLevel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.infoText}>{lesson.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <FileText size={14} color="#64748B" />
            <Text style={styles.infoText}>{lesson.activities} activities</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description}
        </Text>
        
        <View style={styles.tagsRow}>
          <View style={styles.strandTag}>
            <Text style={styles.strandTagText}>{lesson.strand}</Text>
          </View>
          {lesson.topics && lesson.topics.map((topic, index) => (
            <View key={index} style={styles.topicTag}>
              <Text style={styles.topicTagText}>{topic}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignButton}>
          <Text style={styles.assignButtonText}>Assign</Text>
        </TouchableOpacity>
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
  assignButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  assignButtonText: {
    color: '#059669',
    fontWeight: '500',
  },
  moreButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});