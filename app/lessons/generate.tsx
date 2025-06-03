import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, ChevronLeft, BookOpen, Clock, LayoutGrid as Layout } from 'lucide-react-native';
import { useLessonPlanning } from '@/hooks/useLessonPlanning';

type LessonTemplate = {
  id: string;
  title: string;
  description: string | null;
};

export default function GenerateLessonScreen() {
  const router = useRouter();
  const { generateLessonPlan, getTemplates, loading, error } = useLessonPlanning();
  const [templates, setTemplates] = useState<LessonTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [yearLevel, setYearLevel] = useState('');
  const [strand, setStrand] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !yearLevel || !strand || !topic) {
      return;
    }

    try {
      setIsGenerating(true);
      const lessonId = await generateLessonPlan({
        templateId: selectedTemplate,
        yearLevel,
        strand,
        topic,
        duration: duration || '45 mins',
      });

      router.replace(`/lessons/${lessonId}/edit`);
    } catch (error) {
      console.error('Failed to generate lesson:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Generate Lesson Plan</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Template</Text>
          <View style={styles.templateGrid}>
            {templates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate === template.id && styles.selectedTemplate
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <Layout 
                  size={24} 
                  color={selectedTemplate === template.id ? '#2563EB' : '#64748B'} 
                />
                <Text style={[
                  styles.templateTitle,
                  selectedTemplate === template.id && styles.selectedTemplateText
                ]}>
                  {template.title}
                </Text>
                {template.description && (
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lesson Details</Text>
          
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
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <BookOpen size={24} color="#2563EB" />
            <Text style={styles.featureTitle}>Curriculum Aligned</Text>
            <Text style={styles.featureDescription}>
              Automatically aligns with WA HPE curriculum standards
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Clock size={24} color="#059669" />
            <Text style={styles.featureTitle}>Time Saving</Text>
            <Text style={styles.featureDescription}>
              Generate complete lesson plans in seconds
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Zap size={24} color="#F97316" />
            <Text style={styles.featureTitle}>Smart Generation</Text>
            <Text style={styles.featureDescription}>
              AI-powered suggestions for activities and resources
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.generateButton,
            (!selectedTemplate || !yearLevel || !strand || !topic || isGenerating) && 
            styles.generateButtonDisabled
          ]}
          onPress={handleGenerate}
          disabled={!selectedTemplate || !yearLevel || !strand || !topic || isGenerating}
        >
          <Zap size={20} color="white" />
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating...' : 'Generate Lesson Plan'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedTemplate: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  templateTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedTemplateText: {
    color: '#2563EB',
  },
  templateDescription: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
    color: '#1F2937',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginLeft: 8,
  },
});