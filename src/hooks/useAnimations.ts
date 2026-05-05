import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { ANIMATION } from '../constants/theme';

export const useAnimations = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(
    (duration = ANIMATION.normal) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  const fadeOut = useCallback(
    (duration = ANIMATION.normal) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  const scaleIn = useCallback(
    (duration = ANIMATION.normal) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    },
    [scaleAnim]
  );

  const scaleOut = useCallback(
    (duration = ANIMATION.normal) => {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [scaleAnim]
  );

  const slideUp = useCallback(
    (duration = ANIMATION.normal) => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    },
    [slideAnim]
  );

  const slideDown = useCallback(
    (duration = ANIMATION.normal) => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    },
    [slideAnim]
  );

  const pulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  return {
    fadeAnim,
    scaleAnim,
    slideAnim,
    fadeIn,
    fadeOut,
    scaleIn,
    scaleOut,
    slideUp,
    slideDown,
    pulse,
  };
};
