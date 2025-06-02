import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStudents } from '@/hooks/useStudents';
import { useQuests } from '@/hooks/useQuests';
import { useRouter } from 'expo-router';
import { Award, ChevronRight } from 'lucide-react-native';

export default function AssignQuestsScreen() {
  const router = useRouter();
  const { students, loading: studentsLoading } = useStudents();
  const { quests, loading: questsLoading } = useQuests();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);

  const loading = studentsLoading || questsLoading;

  const handleAssign = async () => {
    // This would be implemented to assign the selected quest to selected students
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Students</Text>
        <FlatList
          data={students}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.studentItem,
                selectedStudents.includes(item.id) && styles.selectedItem
              ]}
              onPress={() => {
                setSelectedStudents(prev =>
                  prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
                );
              }}
            >
              <Text style={styles.studentName}>{item.full_name}</Text>
              <ChevronRight size={20} color="#64748B" />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Quest</Text>
        <FlatList
          data={quests}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.questItem,
                selectedQuest === item.id && styles.selectedItem
              ]}
              onPress={() => setSelectedQuest(item.id)}
            >
              <View style={styles.questInfo}>
                <Award size={20} color="#F97316" />
                <Text style={styles.questTitle}>{item.title}</Text>
              </View>
              <Text style={styles.questPoints}>{item.points} pts</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.assignButton,
          (!selectedQuest || selectedStudents.length === 0) && styles.assignButtonDisabled
        ]}
        onPress={handleAssign}
        disabled={!selectedQuest || selectedStudents.length === 0}
      >
        <Text style={styles.assignButtonText}>
          Assign Quest to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  questInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  questPoints: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
  assignButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  assignButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});