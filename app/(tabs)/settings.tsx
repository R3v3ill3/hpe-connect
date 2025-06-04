import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Bell, CloudOff, Moon, Lock, Shield, CircleHelp as HelpCircle, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color="#2563EB" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive updates about your lessons and students
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={notifications ? '#2563EB' : '#F1F5F9'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <CloudOff size={20} color="#059669" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Offline Mode</Text>
              <Text style={styles.settingDescription}>
                Work without an internet connection
              </Text>
            </View>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: '#CBD5E1', true: '#D1FAE5' }}
            thumbColor={offlineMode ? '#059669' : '#F1F5F9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Moon size={20} color="#64748B" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch to dark theme
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#CBD5E1', true: '#CBD5E1' }}
            thumbColor={darkMode ? '#64748B' : '#F1F5F9'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <TouchableOpacity style={styles.settingButton}>
          <Lock size={20} color="#2563EB" />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingDescription}>
              Update your account password
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>
          <Shield size={20} color="#059669" />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Privacy Settings</Text>
            <Text style={styles.settingDescription}>
              Manage your data and privacy preferences
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.settingButton}>
          <HelpCircle size={20} color="#2563EB" />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Help Center</Text>
            <Text style={styles.settingDescription}>
              Get help and find answers to questions
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.dangerButton}>
          <Trash2 size={20} color="#DC2626" />
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </TouchableOpacity>
        <Text style={styles.dangerDescription}>
          This action cannot be undone. All your data will be permanently deleted.
        </Text>
      </View>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    fontFamily: 'Inter_500Medium',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'Inter_500Medium',
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dangerSection: {
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  dangerButtonText: {
    color: '#DC2626',
    marginLeft: 8,
    fontFamily: 'Inter_500Medium',
  },
  dangerDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginVertical: 24,
    fontFamily: 'Inter_400Regular',
  },
});