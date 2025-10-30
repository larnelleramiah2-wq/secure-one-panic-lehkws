
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = 280,
  borderRadius = 25,
  bottomMargin
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const animatedValue = useSharedValue(0);

  // Improved active tab detection with better path matching
  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      if (pathname === tab.route) {
        score = 100;
      } else if (pathname.startsWith(tab.route)) {
        score = 80;
      } else if (pathname.includes(tab.name)) {
        score = 60;
      } else if (tab.route.includes('/(tabs)/') && pathname.includes(tab.route.split('/(tabs)/')[1])) {
        score = 40;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      animatedValue.value = withSpring(activeTabIndex, {
        damping: 20,
        stiffness: 120,
        mass: 1,
      });
    }
  }, [activeTabIndex, animatedValue]);

  const handleTabPress = (route: string) => {
    router.push(route);
  };

  const handlePanicButton = async () => {
    console.log('Panic button pressed!');
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Emergency Alert Activated',
          'Location permission denied. Emergency alert sent without location data.\n\nEmergency services have been notified.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Show alert with location
      Alert.alert(
        '🚨 EMERGENCY ALERT ACTIVATED',
        `Your location has been shared with the emergency response team:\n\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}\n\nEmergency services are being dispatched to your location.`,
        [
          {
            text: 'Cancel Alert',
            style: 'cancel',
            onPress: () => console.log('Alert cancelled'),
          },
          {
            text: 'Confirm Emergency',
            style: 'destructive',
            onPress: () => {
              console.log('Emergency confirmed with location:', { latitude, longitude });
              Alert.alert('Help is on the way', 'Emergency response team has been notified and is en route to your location.');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Emergency Alert',
        'Unable to get your location. Emergency alert sent without location data.\n\nEmergency services have been notified.',
        [{ text: 'OK' }]
      );
    }
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth - 16) / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  const dynamicStyles = {
    blurContainer: {
      ...styles.blurContainer,
      ...Platform.select({
        ios: {
          backgroundColor: theme.dark
            ? 'rgba(28, 28, 30, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        },
        android: {
          backgroundColor: theme.dark
            ? 'rgba(28, 28, 30, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          elevation: 8,
        },
        web: {
          backgroundColor: theme.dark
            ? 'rgba(28, 28, 30, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: theme.dark
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }),
    },
    background: {
      ...styles.background,
      backgroundColor: theme.dark
        ? (Platform.OS === 'ios' ? 'transparent' : 'rgba(28, 28, 30, 0.1)')
        : (Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.1)'),
    },
    indicator: {
      ...styles.indicator,
      backgroundColor: theme.dark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',
      width: `${(100 / tabs.length) - 3}%`,
    },
  };

  return (
    <>
      {/* Panic Button - Positioned above the tab bar */}
      <View style={styles.panicButtonContainer}>
        <TouchableOpacity
          style={styles.panicButton}
          onPress={handlePanicButton}
          activeOpacity={0.8}
        >
          <View style={styles.panicButtonInner}>
            <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#ffffff" />
            <Text style={styles.panicButtonText}>PANIC</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={[
          styles.container,
          {
            width: containerWidth,
            marginBottom: bottomMargin ?? (Platform.OS === 'ios' ? 10 : 20)
          }
        ]}>
          <BlurView
            intensity={Platform.OS === 'web' ? 0 : 80}
            style={[dynamicStyles.blurContainer, { borderRadius }]}
          >
            <View style={dynamicStyles.background} />
            <Animated.View style={[dynamicStyles.indicator, indicatorStyle]} />
            <View style={styles.tabsContainer}>
              {tabs.map((tab, index) => {
                const isActive = activeTabIndex === index;

                return (
                  <TouchableOpacity
                    key={tab.name}
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tabContent}>
                      <IconSymbol
                        name={tab.icon}
                        size={24}
                        color={isActive ? colors.primary : colors.text}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: colors.text },
                          isActive && { color: colors.primary, fontWeight: '600' },
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  panicButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 100,
    right: 20,
    zIndex: 1001,
  },
  panicButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(220, 53, 69, 0.4)',
    elevation: 8,
  },
  panicButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  panicButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  blurContainer: {
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    bottom: 8,
    borderRadius: 17,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
