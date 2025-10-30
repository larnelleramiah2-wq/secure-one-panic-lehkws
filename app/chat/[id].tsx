
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatData {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Mock chat data based on ID
  const chatData: Record<string, ChatData> = {
    '1': {
      id: '1',
      name: 'Security Team Alpha',
      avatar: '🛡️',
      phone: '+27112345678',
      online: true,
    },
    '2': {
      id: '2',
      name: 'Driver - John Smith',
      avatar: '🚛',
      phone: '+27112345679',
      online: true,
    },
    '3': {
      id: '3',
      name: 'Operations Center',
      avatar: '🏢',
      phone: '+27112345680',
      online: false,
    },
    '4': {
      id: '4',
      name: 'Emergency Response',
      avatar: '🚨',
      phone: '+27112345681',
      online: true,
    },
    '5': {
      id: '5',
      name: 'Fleet Manager',
      avatar: '📋',
      phone: '+27112345682',
      online: false,
    },
  };

  const currentChat = chatData[id as string] || chatData['1'];

  // Mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hello, this is ' + currentChat.name,
        timestamp: '10:00 AM',
        isSent: false,
      },
      {
        id: '2',
        text: 'Hi! How can I help you today?',
        timestamp: '10:01 AM',
        isSent: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'I need an update on the current shipment status',
        timestamp: '10:02 AM',
        isSent: false,
      },
      {
        id: '4',
        text: 'Let me check that for you right away',
        timestamp: '10:03 AM',
        isSent: true,
        status: 'delivered',
      },
    ];
    setMessages(mockMessages);
  }, [id]);

  const handleSendMessage = () => {
    if (messageText.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isSent: true,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Message received. Processing your request...',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        isSent: false,
      };
      setMessages((prev) => [...prev, responseMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const handlePhoneCall = () => {
    Alert.alert(
      'Call ' + currentChat.name,
      'Would you like to call ' + currentChat.phone + '?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            const phoneUrl = `tel:${currentChat.phone}`;
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
          },
        },
      ]
    );
  };

  const handleVideoCall = () => {
    Alert.alert('Video Call', 'Video call feature coming soon!');
    console.log('Video call requested with:', currentChat.name);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isSent
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: item.isSent ? '#ffffff' : colors.text },
          ]}
        >
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTimestamp,
              { color: item.isSent ? 'rgba(255,255,255,0.7)' : colors.textSecondary },
            ]}
          >
            {item.timestamp}
          </Text>
          {item.isSent && item.status && (
            <IconSymbol
              name={
                item.status === 'read'
                  ? 'checkmark.circle.fill'
                  : item.status === 'delivered'
                  ? 'checkmark.circle'
                  : 'checkmark'
              }
              size={14}
              color="rgba(255,255,255,0.7)"
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: currentChat.name,
          headerBackTitle: 'Back',
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={handleVideoCall} style={styles.headerButton}>
                <IconSymbol name="video.fill" size={24} color={colors.primary} />
              </Pressable>
              <Pressable onPress={handlePhoneCall} style={styles.headerButton}>
                <IconSymbol name="phone.fill" size={24} color={colors.primary} />
              </Pressable>
            </View>
          ),
        }}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <Pressable style={styles.attachButton}>
            <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
          </Pressable>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[
              styles.sendButton,
              messageText.trim().length > 0 && { backgroundColor: colors.primary },
            ]}
            onPress={handleSendMessage}
            disabled={messageText.trim().length === 0}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={32}
              color={messageText.trim().length > 0 ? '#ffffff' : colors.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  messageTimestamp: {
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  attachButton: {
    padding: 4,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.highlight,
    borderRadius: 20,
  },
  sendButton: {
    padding: 4,
    marginBottom: 4,
  },
});
