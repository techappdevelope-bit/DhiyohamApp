import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ConfettiProps {
  count?: number;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ count = 50, duration = 3000 }) => {
  const confettiPieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][
      Math.floor(Math.random() * 5)
    ],
    size: Math.random() * 10 + 5,
    rotation: useRef(new Animated.Value(0)).current,
    fall: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    const animations = confettiPieces.map((piece) =>
      Animated.parallel([
        Animated.timing(piece.fall, {
          toValue: height,
          duration: duration + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(piece.rotation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ),
      ])
    );

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece) => {
        const rotate = piece.rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.confettiPiece,
              {
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                left: piece.x,
                transform: [{ translateY: piece.fall }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export default Confetti;
