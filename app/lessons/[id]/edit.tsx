import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLessons } from '@/hooks/useLessons';

export default function EditLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { lessons, updateLesson } = useLessons();
  const [isLoading, setIsLoading] = useState(false);
  const [lesson, setLesson] = useState(lessons.find(l => l.id === id));

  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [yearLevel, setYearLevel] = useState(lesson?.year_level || '');
  const [strand, setStrand] = useState(lesson?.strand || '');
  const [topic, setTopic] = useState(lesson?.topic || '');
  const [duration, setDuration] = useState(lesson?.duration || '');

  useEffect(() => {
    if (!lesson) {
      Alert.alert('Error', 'Lesson not found');
      router.back();
    }
  }, [lesson]);

  const handleUpdate = async () => {
    if (!title || !yearLevel || !strand || !topic) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await updateLesson(id as string, {
        title,
        description,
        year_level: yearLevel,
        strand,
        topic,
        duration,
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update lesson');
    } finally {
      setIsLoading(false);
    }
  };

  if (!lesson) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter lesson title"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter lesson description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Year Level *</Text>
          <TextInput
            style={styles.input}
            value={yearLevel}
            onChangeText={setYearLevel}
            placeholder="Enter year level"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Strand *</Text>
          <TextInput
            style={styles.input}
            value={strand}
            onChangeText={setStrand}
            placeholder="Enter strand"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Topic *</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="Enter topic"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration (e.g., 45 mins)"
          />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
          onPress={handleUpdate}
          disabled={isLoading}
        >
          <Text style={styles.updateButtonText}>
            {isLoading ? 'Updating...' : 'Update Lesson'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1F2937',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});