import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Confetti from './Confetti';

const { width } = Dimensions.get('window');

interface CelebrationModalProps {
  visible: boolean;
  title: string;
  message: string;
  iconName?: string;
  onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  title,
  message,
  iconName = 'star',
  onClose,
}) => {
  const colors = useThemedColors();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: width - SPACING.xl * 2,
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xxl,
      alignItems: 'center',
      ...SHADOWS.lg,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    message: {
      fontSize: FONT_SIZE.md,
      color: colors.textLight,
      textAlign: 'center',
      marginBottom: SPACING.xl,
      lineHeight: 24,
    },
    button: {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Confetti />
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CelebrationModal;
