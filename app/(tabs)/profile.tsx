import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, User, Book, Award, Bell, CloudOff, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile, loading, error, updateProfile } = useProfile();
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        <Text style={styles.errorText}>Error loading profile: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Image 
          source={{ 
            uri: profile?.avatar_url || 'https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{profile?.full_name || 'Update Your Profile'}</Text>
        <Text style={styles.userRole}>
          {profile?.role === 'teacher' ? 'Teacher' : 'Student'}
          {profile?.year_level ? ` - Year ${profile.year_level}` : ''}
        </Text>
        <Text style={styles.userSchool}>{profile?.school || 'Add Your School'}</Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>28</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <User size={20} color="#2563EB" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Personal Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Book size={20} color="#059669" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>My Curriculum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Award size={20} color="#F97316" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Achievements</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.toggleItem}>
          <View style={styles.toggleInfo}>
            <Bell size={20} color="#2563EB" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Notifications</Text>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={notifications ? '#2563EB' : '#F1F5F9'}
          />
        </View>
        <View style={styles.toggleItem}>
          <View style={styles.toggleInfo}>
            <CloudOff size={20} color="#059669" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Offline Mode</Text>
          </View>
          <Switch 
            value={offlineMode} 
            onValueChange={setOfflineMode}
            trackColor={{ false: '#CBD5E1', true: '#D1FAE5' }}
            thumbColor={offlineMode ? '#059669' : '#F1F5F9'}
          />
        </View>
        <View style={styles.toggleItem}>
          <View style={styles.toggleInfo}>
            <Settings size={20} color="#64748B" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Dark Mode</Text>
          </View>
          <Switch 
            value={darkMode} 
            onValueChange={setDarkMode}
            trackColor={{ false: '#CBD5E1', true: '#CBD5E1' }}
            thumbColor={darkMode ? '#64748B' : '#F1F5F9'}
          />
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.menuItem}>
          <HelpCircle size={20} color="#2563EB" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Help & Documentation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Shield size={20} color="#059669" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Privacy & Data</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleSignOut}
      >
        <LogOut size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>WA HPE Connect v1.0.0</Text>
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
    fontFamily: 'Inter_400Regular',
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
    fontFamily: 'Inter_500Medium',
  },
  headerSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
    fontFamily: 'Inter_400Regular',
  },
  userSchool: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#2563EB',
    fontFamily: 'Inter_500Medium',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  sectionContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 8,
    color: '#DC2626',
    fontFamily: 'Inter_500Medium',
  },
  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
});