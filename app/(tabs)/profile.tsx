
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const theme = useTheme();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logging out...') },
      ]
    );
  };

  const renderSettingItem = (icon: string, title: string, onPress: () => void, danger?: boolean) => (
    <Pressable
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <IconSymbol 
          name={icon} 
          size={22} 
          color={danger ? colors.danger : colors.primary} 
        />
        <Text style={[
          styles.settingText, 
          { color: danger ? colors.danger : colors.text }
        ]}>
          {title}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
    </Pressable>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      edges={['top']}
    >
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Profile",
            headerLargeTitle: true,
          }}
        />
      )}
      {Platform.OS !== 'ios' && (
        <View style={[styles.customHeader, { backgroundColor: colors.card }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeEmoji}>👤</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>James Anderson</Text>
          <Text style={[styles.role, { color: colors.textSecondary }]}>Security Officer</Text>
          <Text style={[styles.employeeId, { color: colors.textSecondary }]}>ID: SO-2024-1547</Text>
          
          <Pressable
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={handleEditProfile}
          >
            <IconSymbol name="pencil" size={16} color="#ffffff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>+27 11 234 5690</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IconSymbol name="envelope.fill" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>james.anderson@secureone.co.za</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IconSymbol name="building.2.fill" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Department</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>Security Operations</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          {renderSettingItem('bell.fill', 'Notifications', handleSettings)}
          {renderSettingItem('lock.fill', 'Privacy & Security', handleSettings)}
          {renderSettingItem('gear', 'App Settings', handleSettings)}
          {renderSettingItem('questionmark.circle.fill', 'Help & Support', handleSettings)}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          {renderSettingItem('arrow.right.square.fill', 'Logout', handleLogout, true)}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            SecureOne Messenger
          </Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeEmoji: {
    fontSize: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  appInfoText: {
    fontSize: 13,
  },
});
