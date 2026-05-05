// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { SPACING, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from '../../constants/theme';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
//
// const WelcomeScreen = ({ navigation }: any) => {
//   return (
//     <LinearGradient
//       colors={['#667eea', '#764ba2']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.container}
//     >
//       {/* Logo */}
//       <View style={styles.logoContainer}>
//         <LinearGradient
//           colors={['#f093fb', '#f5576c']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.logo}
//         >
//           <Icon name="star" size={64} color="#FFFFFF" />
//         </LinearGradient>
//       </View>
//
//       {/* Title */}
//       <Text style={styles.title}>Dhiyoham kids</Text>
//       <Text style={styles.tagline}>Turn learnings into Adventures!</Text>
//       <Text style={styles.description}>
//         Earn points • Level up • Get rewards
//       </Text>
//
//       {/* Buttons */}
//       <View style={styles.buttonsContainer}>
//         {/* Get Started - Goes to Parent Register */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('ParentRegister')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.primaryBtn}>
//             <Text style={styles.primaryBtnText}>Get Started</Text>
//           </View>
//         </TouchableOpacity>
//
//         {/* I Already Have an Account - Goes to Parent Login */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('ParentLogin')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.secondaryBtn}>
//             <Text style={styles.secondaryBtnText}>I Already Have an Account</Text>
//           </View>
//         </TouchableOpacity>
//
//         {/* Kid Login */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('KidLogin')}
//           activeOpacity={0.8}
//           style={styles.kidLoginBtn}
//         >
//           <Icon name="account-child" size={20} color="#FFFFFF" />
//           <Text style={styles.kidLoginText}>Kid Login</Text>
//         </TouchableOpacity>
//       </View>
//
//       {/* Footer */}
//       <Text style={styles.footer}>Made with ❤️ for Kids</Text>
//     </LinearGradient>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.xl,
//   },
//   logoContainer: {
//     marginBottom: SPACING.xxl,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 48,
//     fontWeight: FONT_WEIGHT.black,
//     color: '#FFFFFF',
//     marginBottom: SPACING.sm,
//     textAlign: 'center',
//   },
//   tagline: {
//     fontSize: FONT_SIZE.xl,
//     color: '#FFFFFF',
//     opacity: 0.95,
//     marginBottom: SPACING.md,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: FONT_SIZE.md,
//     color: '#FFFFFF',
//     opacity: 0.85,
//     marginBottom: SPACING.xxxl,
//     textAlign: 'center',
//   },
//   buttonsContainer: {
//     width: '100%',
//     maxWidth: 400,
//   },
//   primaryBtn: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: BORDER_RADIUS.lg,
//     paddingVertical: SPACING.lg,
//     paddingHorizontal: SPACING.xl,
//     alignItems: 'center',
//     marginBottom: SPACING.md,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   primaryBtnText: {
//     fontSize: FONT_SIZE.lg,
//     fontWeight: FONT_WEIGHT.black,
//     color: '#667eea',
//   },
//   secondaryBtn: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: BORDER_RADIUS.lg,
//     paddingVertical: SPACING.lg,
//     paddingHorizontal: SPACING.xl,
//     alignItems: 'center',
//     marginBottom: SPACING.md,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   secondaryBtnText: {
//     fontSize: FONT_SIZE.md,
//     fontWeight: FONT_WEIGHT.bold,
//     color: '#FFFFFF',
//   },
//   kidLoginBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: SPACING.sm,
//     paddingVertical: SPACING.md,
//     marginTop: SPACING.lg,
//   },
//   kidLoginText: {
//     fontSize: FONT_SIZE.md,
//     color: '#FFFFFF',
//     fontWeight: FONT_WEIGHT.semibold,
//     opacity: 0.9,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: SPACING.xl,
//     fontSize: FONT_SIZE.sm,
//     color: '#FFFFFF',
//     opacity: 0.7,
//     textAlign: 'center',
//   },
// });
//
// export default WelcomeScreen;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#f093fb', '#f5576c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}
        >
          <Icon name="star" size={64} color="#FFFFFF" />
        </LinearGradient>
      </View>

      {/* Title */}
      <Text style={styles.title}>Dhiyoham Kids</Text>
      <Text style={styles.tagline}>Turn Learnings into Adventures!</Text>
      <Text style={styles.description}>
        Earn points • Level up • Get rewards
      </Text>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>

        {/* Get Started - Parent Register */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ParentRegister')}
          activeOpacity={0.8}
        >
          <View style={styles.primaryBtn}>
            <Icon name="account-plus" size={20} color="#667eea" />
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </View>
        </TouchableOpacity>

        {/* I Already Have an Account - Parent Login */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ParentLogin')}
          activeOpacity={0.8}
        >
          <View style={styles.secondaryBtn}>
            <Icon name="login" size={20} color="#FFFFFF" />
            <Text style={styles.secondaryBtnText}>I Already Have an Account</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Kid Login - New styled button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('KidLogin')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.kidLoginBtn}
          >
            <Text style={styles.kidEmoji}>👧🧒</Text>
            <View style={styles.kidLoginTextContainer}>
              <Text style={styles.kidLoginTitle}>Let's Play!</Text>
              <Text style={styles.kidLoginSubtitle}>Login with your secret password</Text>
            </View>
            <Icon name="arrow-right-circle" size={32} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

      </View>

      {/* Footer */}
      <Text style={styles.footer}>Made with ❤️ for Kids</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontWeight: FONT_WEIGHT.semibold,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: SPACING.xxxl,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: SPACING.md,
  },
  primaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#667eea',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  kidLoginBtn: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  kidEmoji: {
    fontSize: 40,
  },
  kidLoginTextContainer: {
    flex: 1,
  },
  kidLoginTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  kidLoginSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    fontSize: FONT_SIZE.sm,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default WelcomeScreen;