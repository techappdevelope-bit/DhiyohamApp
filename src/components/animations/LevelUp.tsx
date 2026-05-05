import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface LevelUpProps {
  level: number;
  onComplete?: () => void;
}

const LevelUp: React.FC<LevelUpProps> = ({ level, onComplete }) => {
  const colors = useThemedColors();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete?.();
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: FONT_SIZE.xxxl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: FONT_SIZE.lg,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    level: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.primary,
      marginTop: SPACING.md,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <Icon name="trophy" size={50} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Level Up!</Text>
        <Text style={styles.subtitle}>You reached</Text>
        <Text style={styles.level}>Level {level}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default LevelUp;
