
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  FlatList, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  TextInput,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
}

export default function ChatsScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock chat data
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Security Team Alpha',
      lastMessage: 'Route confirmed for shipment #4521',
      timestamp: '10:30 AM',
      unread: 2,
      avatar: '🛡️',
      online: true,
    },
    {
      id: '2',
      name: 'Driver - John Smith',
      lastMessage: 'Arrived at checkpoint 3',
      timestamp: '9:45 AM',
      unread: 0,
      avatar: '🚛',
      online: true,
    },
    {
      id: '3',
      name: 'Operations Center',
      lastMessage: 'All clear on route N1',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: '🏢',
      online: false,
    },
    {
      id: '4',
      name: 'Emergency Response',
      lastMessage: 'Standing by',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: '🚨',
      online: true,
    },
    {
      id: '5',
      name: 'Fleet Manager',
      lastMessage: 'Schedule updated for tomorrow',
      timestamp: '2 days ago',
      unread: 0,
      avatar: '📋',
      online: false,
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Pressable
      style={[styles.chatItem, { backgroundColor: colors.card }]}
      onPress={() => console.log('Open chat:', item.name)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{item.avatar}</Text>
        </View>
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {item.timestamp}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text 
            style={[styles.lastMessage, { color: colors.textSecondary }]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search chats..."
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
            title: "Chats",
            headerLargeTitle: true,
          }}
        />
      )}
      {Platform.OS !== 'ios' && (
        <View style={[styles.customHeader, { backgroundColor: colors.card }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Chats</Text>
        </View>
      )}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
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
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.card,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    fontSize: 13,
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 15,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
