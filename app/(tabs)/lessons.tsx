import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Filter, Search, CirclePlus as PlusCircle, Zap } from 'lucide-react-native';
import LessonCard from '../../components/lessons/LessonCard';
import FilterModal from '../../components/lessons/FilterModal';
import { lessonPlans } from '../../data/lessonPlans';

export default function LessonsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredLessons, setFilteredLessons] = useState(lessonPlans);
  const [activeFilters, setActiveFilters] = useState({
    yearLevel: [],
    strand: [],
    topic: []
  });

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredLessons(lessonPlans);
      return;
    }
    
    const filtered = lessonPlans.filter(lesson => 
      lesson.title.toLowerCase().includes(text.toLowerCase()) ||
      lesson.strand.toLowerCase().includes(text.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLessons(filtered);
  };

  const applyFilters = (filters) => {
    setActiveFilters(filters);
    
    let filtered = [...lessonPlans];
    
    if (filters.yearLevel.length > 0) {
      filtered = filtered.filter(lesson => filters.yearLevel.includes(lesson.yearLevel));
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
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.newLessonButton}>
          <PlusCircle size={16} color="white" />
          <Text style={styles.buttonText}>New Lesson</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.generateButton}>
          <Zap size={16} color="white" />
          <Text style={styles.buttonText}>Generate Plan</Text>
        </TouchableOpacity>
      </View>
      
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
              setFilteredLessons(lessonPlans);
            }}
          >
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.lessonsList}>
        {filteredLessons.length > 0 ? (
          filteredLessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No lessons match your search</Text>
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => {
                setSearchQuery('');
                setFilteredLessons(lessonPlans);
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