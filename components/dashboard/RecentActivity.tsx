import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText, Users, Clock, Award } from 'lucide-react-native';

export default function RecentActivity() {
  const activities = [
    {
      id: '1',
      type: 'lesson',
      title: 'Created "Healthy Food Choices" lesson',
      time: '2 hours ago',
      icon: <FileText size={16} color="#2563EB" />,
    },
    {
      id: '2',
      type: 'students',
      title: 'Assigned quest to Year 2 class',
      time: '4 hours ago',
      icon: <Users size={16} color="#059669" />,
    },
    {
      id: '3',
      type: 'time',
      title: 'Modified "Active Play" lesson',
      time: 'Yesterday',
      icon: <Clock size={16} color="#F97316" />,
    },
    {
      id: '4',
      type: 'badge',
      title: 'Tommy earned "Nutrition Expert" badge',
      time: 'Yesterday',
      icon: <Award size={16} color="#8B5CF6" />,
    },
  ];

  return (
    <View style={styles.container}>
      {activities.map(activity => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={styles.iconContainer}>
            {activity.icon}
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
});