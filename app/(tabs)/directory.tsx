
import React, { useState } from "react";
import { 
  FlatList, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
}

export default function DirectoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock employee data
  const employees: Employee[] = [
    {
      id: '1',
      name: 'Michael Johnson',
      role: 'Security Team Lead',
      department: 'Operations',
      phone: '+27112345678',
      status: 'online',
      avatar: '👮',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      role: 'Fleet Manager',
      department: 'Logistics',
      phone: '+27112345679',
      status: 'online',
      avatar: '👩‍💼',
    },
    {
      id: '3',
      name: 'John Smith',
      role: 'Driver',
      department: 'Transport',
      phone: '+27112345680',
      status: 'busy',
      avatar: '🚛',
    },
    {
      id: '4',
      name: 'Emma Davis',
      role: 'Operations Manager',
      department: 'Operations',
      phone: '+27112345681',
      status: 'online',
      avatar: '👩‍💻',
    },
    {
      id: '5',
      name: 'David Brown',
      role: 'Security Officer',
      department: 'Security',
      phone: '+27112345682',
      status: 'offline',
      avatar: '🛡️',
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      role: 'Emergency Response',
      department: 'Emergency',
      phone: '+27112345683',
      status: 'online',
      avatar: '🚨',
    },
    {
      id: '7',
      name: 'Robert Taylor',
      role: 'Driver',
      department: 'Transport',
      phone: '+27112345684',
      status: 'busy',
      avatar: '🚚',
    },
    {
      id: '8',
      name: 'Jennifer Wilson',
      role: 'Dispatcher',
      department: 'Operations',
      phone: '+27112345685',
      status: 'online',
      avatar: '📡',
    },
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return colors.online;
      case 'busy':
        return colors.accent;
      case 'offline':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const handleCall = (employee: Employee) => {
    Alert.alert(
      'Call ' + employee.name,
      'Would you like to call ' + employee.phone + '?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Call', 
          onPress: () => {
            const phoneUrl = `tel:${employee.phone}`;
            Linking.canOpenURL(phoneUrl)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(phoneUrl);
                } else {
                  Alert.alert('Error', 'Phone calls are not supported on this device');
                  console.log('Phone calls not supported');
                }
              })
              .catch((err) => {
                console.error('Error opening phone dialer:', err);
                Alert.alert('Error', 'Failed to open phone dialer');
              });
          }
        },
      ]
    );
  };

  const handleMessage = (employee: Employee) => {
    console.log('Opening chat with:', employee.name);
    // Navigate to a chat screen - for now we'll use a generic chat
    router.push('/chat/1');
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <View style={[styles.employeeItem, { backgroundColor: colors.card }]}>
      <View style={styles.employeeInfo}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{item.avatar}</Text>
          </View>
          <View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: getStatusColor(item.status) }
            ]} 
          />
        </View>
        
        <View style={styles.employeeDetails}>
          <Text style={[styles.employeeName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.employeeRole, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.role}
          </Text>
          <Text style={[styles.employeeDepartment, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.department}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => handleMessage(item)}
        >
          <IconSymbol name="message.fill" size={18} color="#ffffff" />
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.success }]}
          onPress={() => handleCall(item)}
        >
          <IconSymbol name="phone.fill" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search employees..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      edges={['top']}
    >
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Directory",
            headerLargeTitle: true,
          }}
        />
      )}
      {Platform.OS !== 'ios' && (
        <View style={[styles.customHeader, { backgroundColor: colors.card }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Directory</Text>
        </View>
      )}
      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS !== 'ios' && styles.listContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    paddingVertical: 8,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  employeeInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.card,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 14,
    marginBottom: 2,
  },
  employeeDepartment: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
