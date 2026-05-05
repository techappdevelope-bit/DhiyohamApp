# ChoreQuest - Kids Chore Chart & Allowance Tracker

Version 1.0.0

## 📱 Description

ChoreQuest is a complete React Native app for managing kids' chores, tracking allowances, and rewarding good behavior. Features a gamified experience for kids and powerful management tools for parents.

## ✨ Features

### Parent Features
- ✅ Create and assign chores to multiple kids
- ✅ Approve/reject completed tasks with photo proof
- ✅ Manage rewards store
- ✅ Track allowances and payments
- ✅ View detailed analytics
- ✅ Customizable point values
- ✅ Weekly/daily/one-time chore scheduling

### Kid Features
- ✅ View assigned chores
- ✅ Complete tasks with photo upload
- ✅ Earn points and level up
- ✅ Unlock achievements
- ✅ Request rewards
- ✅ Track allowance balance
- ✅ Streak tracking

### Technical Features
- ✅ Firebase Authentication (Email + PIN for kids)
- ✅ Firestore Database
- ✅ Cloudinary Image Storage (FREE)
- ✅ Dark Mode Support
- ✅ Offline Capability
- ✅ Push Notifications
- ✅ TypeScript
- ✅ Clean Architecture
- ✅ Reusable Components
- ✅ Smooth Animations

## 🛠️ Tech Stack

- React Native 0.73+
- TypeScript
- Firebase (Auth + Firestore)
- Cloudinary (Image Storage)
- Zustand (State Management)
- React Navigation 6
- React Native Vector Icons
- Lottie Animations
- React Native Toast Message

## 📦 Installation

### 1. Prerequisites
```bash
Node.js 18+
React Native CLI
Android Studio / Xcode
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com
2. Add Android/iOS apps to your Firebase project
3. Download `google-services.json` (Android) and place in `android/app/`
4. Download `GoogleService-Info.plist` (iOS) and place in `ios/`
5. Enable Email/Password authentication in Firebase Console

### 4. Configure Cloudinary
1. Create free account at https://cloudinary.com
2. Get your cloud name and upload preset
3. Update values in `src/services/cloudinary.ts`

### 5. Run the App
```bash
# Android
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## 📁 Project Structure
```
src/
├── components/      # Reusable UI components
├── screens/         # All app screens
├── navigation/      # Navigation setup
├── services/        # API & Firebase services
├── store/          # Zustand state management
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
├── constants/      # App constants & config
└── types/          # TypeScript types
```

## 🎨 Customization

### Colors
Edit `src/constants/colors.ts` to change app colors

### Chore Templates
Edit `src/constants/choreTemplates.ts` to add/modify chore templates

### Reward Templates
Edit `src/constants/rewardTemplates.ts` to add/modify reward templates

### Achievements
Edit `src/constants/achievements.ts` to customize achievements

## 🚀 Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```
APK will be in `android/app/build/outputs/apk/release/`

### iOS
1. Open `ios/ChoreQuest.xcworkspace` in Xcode
2. Select "Product" → "Archive"
3. Follow App Store upload process

## 📊 Firebase Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /kids/{kidId} {
      allow read, write: if request.auth != null;
    }
    
    match /chores/{choreId} {
      allow read, write: if request.auth != null;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    match /rewards/{rewardId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔐 Environment Variables

Create `.env` file:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_preset
```

## 📱 App Features Breakdown

### Authentication System
- Parent registration with email/password
- Kid login with 4-digit PIN
- Forgot password functionality
- Auto-login persistence

### Chore Management
- Create custom chores
- 50+ pre-built templates
- Category organization
- Difficulty levels
- Point rewards
- Photo proof requirements
- Daily/weekly/one-time scheduling

### Task System
- Auto-generation of daily tasks
- Photo upload for completion
- Parent approval workflow
- Bonus points system
- Rejection with feedback

### Rewards Store
- Customizable rewards
- Point-based redemption
- Request approval system
- Multiple categories
- Availability toggle

### Gamification
- Experience points
- Level progression
- Achievement system
- Streak tracking
- Celebration animations

### Analytics
- Completion rates
- Points earned
- Allowance tracking
- Kid performance comparison

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean build
cd android && ./gradlew clean && cd ..
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

### Firebase Issues
- Verify `google-services.json` is in correct location
- Check package name matches Firebase console
- Ensure Authentication is enabled in Firebase

### Image Upload Issues
- Verify Cloudinary credentials
- Check upload preset is "unsigned"
- Ensure internet permission in AndroidManifest.xml

## 📄 License

Regular License - Single End Product
Extended License - Multiple End Products

## 💬 Support

For support, please contact: your-email@example.com

## 🎯 Future Updates (Coming Soon)

- [ ] Family sharing across devices
- [ ] Export reports to PDF
- [ ] Calendar view for chores
- [ ] Recurring allowances
- [ ] Goal savings tracker
- [ ] Parent/kid chat
- [ ] Weekly challenges
- [ ] Custom avatar creator

## ⭐ Credits

- Icons: MaterialCommunityIcons
- Animations: Lottie
- Backend: Firebase
- Image Storage: Cloudinary

---

Made with ❤️ for families worldwide
