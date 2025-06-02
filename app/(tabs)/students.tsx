import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Search, Filter, UserPlus, Award, ChevronRight } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';
import StudentCard from '../../components/students/StudentCard';
import { students } from '../../data/students';

export default function StudentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState(students);
  
  const filterStudents = (query, tab) => {
    let filtered = [...students];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tab === 'needHelp') {
      filtered = filtered.filter(student => student.progressPercentage < 60);
    } else if (tab === 'topPerformers') {
      filtered = filtered.filter(student => student.progressPercentage >= 90);
    }
    
    setFilteredStudents(filtered);
  };
  
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterStudents(text, activeTab);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterStudents(searchQuery, tab);
  };
  
  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Find student..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => handleTabChange('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Students</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'needHelp' && styles.activeTab]}
          onPress={() => handleTabChange('needHelp')}
        >
          <Text style={[styles.tabText, activeTab === 'needHelp' && styles.activeTabText]}>Need Help</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'topPerformers' && styles.activeTab]}
          onPress={() => handleTabChange('topPerformers')}
        >
          <Text style={[styles.tabText, activeTab === 'topPerformers' && styles.activeTabText]}>Top Performers</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.addButton}>
          <UserPlus size={16} color="white" />
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignButton}>
          <Award size={16} color="white" />
          <Text style={styles.buttonText}>Assign Quests</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>28</Text>
          <Text style={styles.summaryLabel}>Total Students</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>72%</Text>
          <Text style={styles.summaryLabel}>Avg. Progress</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>7</Text>
          <Text style={styles.summaryLabel}>Need Help</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.classProgressButton}>
        <Text style={styles.classProgressText}>View Class Progress Report</Text>
        <ChevronRight size={16} color="#2563EB" />
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Student List</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredStudents}
        renderItem={({ item }) => <StudentCard student={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
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
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
  },
  addButton: {
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
  assignButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 6,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  classProgressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  classProgressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});