import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

export default function FilterModal({ visible, onClose, onApply, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters || {
    yearLevel: [],
    strand: [],
    topic: []
  });
  
  const yearLevels = ['K', '1', '2', '3', '4', '5', '6'];
  const strands = ['Personal, Social and Community Health', 'Movement and Physical Activity'];
  const topics = [
    'Healthy Eating', 
    'Personal Safety', 
    'Relationships', 
    'Movement Skills', 
    'Active Play',
    'Water Safety',
    'Emotional Health',
    'Growth and Development'
  ];
  
  const toggleYearLevel = (year) => {
    setFilters(prev => {
      if (prev.yearLevel.includes(year)) {
        return {
          ...prev,
          yearLevel: prev.yearLevel.filter(y => y !== year)
        };
      } else {
        return {
          ...prev,
          yearLevel: [...prev.yearLevel, year]
        };
      }
    });
  };
  
  const toggleStrand = (strand) => {
    setFilters(prev => {
      if (prev.strand.includes(strand)) {
        return {
          ...prev,
          strand: prev.strand.filter(s => s !== strand)
        };
      } else {
        return {
          ...prev,
          strand: [...prev.strand, strand]
        };
      }
    });
  };
  
  const toggleTopic = (topic) => {
    setFilters(prev => {
      if (prev.topic.includes(topic)) {
        return {
          ...prev,
          topic: prev.topic.filter(t => t !== topic)
        };
      } else {
        return {
          ...prev,
          topic: [...prev.topic, topic]
        };
      }
    });
  };
  
  const handleApply = () => {
    onApply(filters);
  };
  
  const clearAllFilters = () => {
    setFilters({
      yearLevel: [],
      strand: [],
      topic: []
    });
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Lessons</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Year Level</Text>
              <View style={styles.optionsRow}>
                {yearLevels.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      filters.yearLevel.includes(year) && styles.selectedOption
                    ]}
                    onPress={() => toggleYearLevel(year)}
                  >
                    <Text 
                      style={[
                        styles.yearText,
                        filters.yearLevel.includes(year) && styles.selectedOptionText
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Strands</Text>
              {strands.map(strand => (
                <TouchableOpacity 
                  key={strand}
                  style={[
                    styles.strandOption,
                    filters.strand.includes(strand) && styles.selectedStrandOption
                  ]}
                  onPress={() => toggleStrand(strand)}
                >
                  <Text 
                    style={[
                      styles.strandText,
                      filters.strand.includes(strand) && styles.selectedOptionText
                    ]}
                  >
                    {strand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Topics</Text>
              <View style={styles.topicsContainer}>
                {topics.map(topic => (
                  <TouchableOpacity 
                    key={topic}
                    style={[
                      styles.topicOption,
                      filters.topic.includes(topic) && styles.selectedTopicOption
                    ]}
                    onPress={() => toggleTopic(topic)}
                  >
                    <Text 
                      style={[
                        styles.topicText,
                        filters.topic.includes(topic) && styles.selectedTopicText
                      ]}
                    >
                      {topic}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  content: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  yearOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  yearText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
  selectedOptionText: {
    color: 'white',
  },
  strandOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStrandOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  strandText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTopicOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  topicText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
  selectedTopicText: {
    color: '#2563EB',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#64748B',
    fontFamily: 'Inter_500Medium',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontFamily: 'Inter_500Medium',
  },
});