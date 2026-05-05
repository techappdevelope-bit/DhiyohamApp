import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'star-circle',
    title: 'Earn Points & Rewards',
    description: 'Complete chores, earn points, and unlock amazing rewards!',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: '2',
    icon: 'trophy',
    title: 'Level Up & Compete',
    description: 'Track your progress, build streaks, and climb the leaderboard!',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: '3',
    icon: 'account-group',
    title: 'Family Fun Together',
    description: 'Parents manage tasks while kids enjoy the adventure!',
    gradient: ['#4facfe', '#00f2fe'],
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('RoleSelection');
    }
  };

  const handleSkip = () => {
    navigation.replace('RoleSelection');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item, index }: any) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Icon name={item.icon} size={80} color="#FFFFFF" />
          </LinearGradient>

          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>

          <Text style={[styles.description, { color: colors.textLight }]}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    slide: {
      width,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.xxxl,
    },
    slideContent: {
      alignItems: 'center',
      width: '100%',
    },
    iconContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.xxxl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: FONT_SIZE.xxxl,
      fontWeight: FONT_WEIGHT.black,
      textAlign: 'center',
      marginBottom: SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    description: {
      fontSize: FONT_SIZE.lg,
      textAlign: 'center',
      lineHeight: 28,
      paddingHorizontal: SPACING.xl,
    },
    footer: {
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.xxl,
      backgroundColor: colors.background,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.xl,
      gap: SPACING.sm,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.border,
    },
    dotActive: {
      width: 30,
      height: 10,
      borderRadius: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    skipButton: {
      flex: 1,
      paddingVertical: SPACING.lg,
      borderRadius: BORDER_RADIUS.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
    },
    skipButtonText: {
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
      color: colors.text,
    },
    nextButton: {
      flex: 2,
      paddingVertical: SPACING.lg,
      borderRadius: BORDER_RADIUS.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    nextButtonText: {
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.black,
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 30, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              >
                <LinearGradient
                  colors={slides[currentIndex].gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, borderRadius: 5 }}
                />
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={slides[currentIndex].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
              <Icon
                name={currentIndex === slides.length - 1 ? "check" : "arrow-right"}
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
