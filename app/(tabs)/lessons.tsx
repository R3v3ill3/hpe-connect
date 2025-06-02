import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Filter, Search, CirclePlus as PlusCircle, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import LessonCard from '../../components/lessons/LessonCard';
import FilterModal from '../../components/lessons/FilterModal';
import { useLessons } from '@/hooks/useLessons';
import { useProfile } from '@/hooks/useProfile';

export default function LessonsScreen() {
  const router = useRouter();
  const { lessons, loading, error, refreshLessons } = useLessons();
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [activeFilters, setActiveFilters] = useState({
    yearLevel: [],
    strand: [],
    topic: []
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredLessons(lessons);
      return;
    }
    
    const filtered = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(text.toLowerCase()) ||
      lesson.strand.toLowerCase().includes(text.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLessons(filtered);
  };

  const applyFilters = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
    
    let filtered = [...lessons];
    
    if (filters.yearLevel.length > 0) {
      filtered = filtered.filter(lesson => filters.yearLevel.includes(lesson.year_level));
    }
    
    if (filters.strand.length > 0) {
      filtered = filtered.filter(lesson => filters.strand.includes(lesson.strand));
    }
    
    if (filters.topic.length > 0) {
      filtered = filtered.filter(lesson => filters.topic.includes(lesson.topic));
    }
    
    setFilteredLessons(filtered);
    setFilterVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading lessons: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={refreshLessons}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search lessons..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>
      
      {profile?.role === 'teacher' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.newLessonButton}
            onPress={() => router.push('/lessons/new')}
          >
            <PlusCircle size={16} color="white" />
            <Text style={styles.buttonText}>New Lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={() => router.push('/lessons/generate')}
          >
            <Zap size={16} color="white" />
            <Text style={styles.buttonText}>Generate Plan</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {Object.values(activeFilters).some(arr => arr.length > 0) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipContainer}>
            {activeFilters.yearLevel.map(year => (
              <View key={`year-${year}`} style={styles.filterChip}>
                <Text style={styles.filterChipText}>Year {year}</Text>
              </View>
            ))}
            {activeFilters.strand.map(strand => (
              <View key={`strand-${strand}`} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{strand}</Text>
              </View>
            ))}
            {activeFilters.topic.map(topic => (
              <View key={`topic-${topic}`} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{topic}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity 
            onPress={() => {
              setActiveFilters({yearLevel: [], strand: [], topic: []});
              setFilteredLessons(lessons);
            }}
          >
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.lessonsList}>
        {filteredLessons.length > 0 ? (
          filteredLessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson}
              isTeacher={profile?.role === 'teacher'}
              onEdit={() => router.push(`/lessons/${lesson.id}/edit`)}
              onDelete={refreshLessons}
            />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No lessons match your search</Text>
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => {
                setSearchQuery('');
                setFilteredLessons(lessons);
              }}
            >
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <FilterModal 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
        initialFilters={activeFilters}
      />
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
  },
  newLessonButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 6,
  },
  activeFiltersContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  activeFiltersTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  filterChipContainer: {
    flex: 1,
  },
  filterChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: '#0369A1',
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#2563EB',
    marginLeft: 8,
  },
  lessonsList: {
    flex: 1,
    padding: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  clearSearchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  clearSearchText: {
    color: '#2563EB',
  },
});