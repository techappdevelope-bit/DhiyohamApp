// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
// import { useTasksStore } from '../../store';
// import { Task } from '../../types';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import FirestoreService from '../../services/firebase/firestore';
//
// const TaskDetailScreen = ({ route, navigation }: any) => {
//   // Get taskId from params - NOT the whole task object
//   const taskId = route?.params?.taskId;
//   const { tasks, completeTask } = useTasksStore();
//
//   const [task, setTask] = useState<Task | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isCompleting, setIsCompleting] = useState(false);
//
//   useEffect(() => {
//     loadTask();
//   }, [taskId, tasks]);
//
//   const loadTask = async () => {
//     if (!taskId) {
//       setIsLoading(false);
//       return;
//     }
//     try {
//       // Try store first
//       const found = tasks.find(t => t.id === taskId);
//       if (found) {
//         setTask({ ...found });
//         setIsLoading(false);
//         return;
//       }
//       // Fallback to Firestore
//       const fetched = await FirestoreService.getTask(taskId);
//       setTask(fetched);
//     } catch (e) {
//       console.error('Error loading task:', e);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const handleComplete = () => {
//     if (!task) return;
//     Alert.alert(
//       'Complete Task?',
//       `Did you finish "${task.choreName || 'this task'}"?`,
//       [
//         { text: 'Not yet', style: 'cancel' },
//         {
//           text: 'Yes, Done!',
//           onPress: async () => {
//             try {
//               setIsCompleting(true);
//               await completeTask(task.id);
//               setTask(prev => prev ? { ...prev, status: 'completed' } : null);
//               Alert.alert(
//                 'Amazing!',
//                 `You earned ${task.pointsAwarded} points!`,
//                 [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
//               );
//             } catch {
//               Alert.alert('Error', 'Failed. Try again!');
//             } finally {
//               setIsCompleting(false);
//             }
//           },
//         },
//       ]
//     );
//   };
//
//   // Loading state
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#667eea" />
//         <Text style={styles.grayText}>Loading task...</Text>
//       </View>
//     );
//   }
//
//   // Not found state
//   if (!task) {
//     return (
//       <View style={styles.centered}>
//         <Icon name="alert-circle-outline" size={64} color="#9CA3AF" />
//         <Text style={styles.grayText}>Task not found</Text>
//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backBtnText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//
//   // Safe status access - only AFTER null check
//   const isCompleted = task.status !== 'pending';
//
//   const statusMap: Record<string, { color: string; label: string; icon: string }> = {
//     pending:   { color: '#F59E0B', label: 'To Do',             icon: 'clock-outline' },
//     completed: { color: '#3B82F6', label: 'Waiting Approval',  icon: 'clock-check-outline' },
//     approved:  { color: '#10B981', label: 'Approved!',         icon: 'check-circle' },
//     rejected:  { color: '#EF4444', label: 'Rejected',          icon: 'close-circle' },
//   };
//
//   const status = statusMap[task.status] ?? statusMap.pending;
//
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={isCompleted ? ['#43e97b', '#38f9d7'] : ['#4facfe', '#00f2fe']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.header}
//       >
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-left" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//
//         <Icon
//           name={isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
//           size={60}
//           color="#FFFFFF"
//           style={{ marginBottom: SPACING.lg }}
//         />
//         <Text style={styles.headerTitle}>{task.choreName || 'Task'}</Text>
//         <Text style={styles.headerSub}>⭐ {task.pointsAwarded} points</Text>
//       </LinearGradient>
//
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Status Badge */}
//         <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
//           <Icon name={status.icon} size={18} color={status.color} />
//           <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
//         </View>
//
//         {/* Info Card */}
//         <View style={styles.card}>
//           <View style={styles.infoRow}>
//             <LinearGradient colors={['#667eea', '#764ba2']} style={styles.infoIcon}>
//               <Icon name="star" size={20} color="#FFF" />
//             </LinearGradient>
//             <View>
//               <Text style={styles.infoLabel}>Points Reward</Text>
//               <Text style={styles.infoValue}>{task.pointsAwarded} points</Text>
//             </View>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.infoIcon}>
//               <Icon name="calendar" size={20} color="#FFF" />
//             </LinearGradient>
//             <View>
//               <Text style={styles.infoLabel}>Due Date</Text>
//               <Text style={styles.infoValue}>
//                 {task.dueDate
//                   ? new Date(task.dueDate).toLocaleDateString('en-US', {
//                       weekday: 'long', month: 'long', day: 'numeric',
//                     })
//                   : 'Today'}
//               </Text>
//             </View>
//           </View>
//         </View>
//
//         {/* Rejection */}
//         {task.status === 'rejected' && task.rejectionComment && (
//           <View style={styles.rejCard}>
//             <Icon name="close-circle" size={24} color="#EF4444" />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.rejTitle}>Rejected</Text>
//               <Text style={styles.rejText}>{task.rejectionComment}</Text>
//             </View>
//           </View>
//         )}
//
//         {/* Approved */}
//         {task.status === 'approved' && (
//           <View style={styles.appCard}>
//             <Icon name="check-circle" size={24} color="#10B981" />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.appTitle}>Task Approved!</Text>
//               <Text style={styles.appText}>You earned {task.pointsAwarded} points!</Text>
//             </View>
//           </View>
//         )}
//
//         {/* Complete Button */}
//         {task.status === 'pending' && (
//           <TouchableOpacity
//             onPress={handleComplete}
//             disabled={isCompleting}
//             activeOpacity={0.8}
//             style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }}
//           >
//             <LinearGradient
//               colors={['#43e97b', '#38f9d7']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.doneBtn}
//             >
//               {isCompleting
//                 ? <ActivityIndicator color="#FFF" size="small" />
//                 : <Icon name="check-circle" size={28} color="#FFF" />
//               }
//               <Text style={styles.doneBtnText}>
//                 {isCompleting ? 'Completing...' : 'Mark as Done!'}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}
//       </ScrollView>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container:  { flex: 1, backgroundColor: '#F5F5F5' },
//   centered:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.lg, backgroundColor: '#F5F5F5' },
//   grayText:   { fontSize: FONT_SIZE.lg, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
//   backBtn:    { backgroundColor: '#667eea', paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.lg },
//   backBtnText:{ color: '#FFF', fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.md },
//   header: {
//     paddingTop: SPACING.xxxl,
//     paddingBottom: SPACING.xxxl,
//     paddingHorizontal: SPACING.xl,
//     alignItems: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     top: SPACING.xxxl,
//     left: SPACING.xl,
//     width: 40, height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF', textAlign: 'center', marginBottom: SPACING.sm },
//   headerSub:   { fontSize: FONT_SIZE.lg, color: '#FFF', opacity: 0.9, fontWeight: FONT_WEIGHT.semibold },
//   content:    { flex: 1, padding: SPACING.xl },
//   badge: {
//     flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
//     paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg,
//     borderRadius: BORDER_RADIUS.round, alignSelf: 'center', marginBottom: SPACING.xl,
//   },
//   badgeText:  { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
//   card:       { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, ...SHADOWS.md, marginBottom: SPACING.lg },
//   infoRow:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
//   infoIcon:   { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
//   infoLabel:  { fontSize: FONT_SIZE.sm, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
//   infoValue:  { fontSize: FONT_SIZE.md, color: '#111827', fontWeight: FONT_WEIGHT.bold },
//   divider:    { height: 1, backgroundColor: '#F3F4F6', marginVertical: SPACING.sm },
//   rejCard:    { backgroundColor: '#FEF2F2', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', gap: SPACING.md, borderWidth: 1, borderColor: '#FECACA', marginBottom: SPACING.lg },
//   rejTitle:   { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444', marginBottom: SPACING.xs },
//   rejText:    { fontSize: FONT_SIZE.sm, color: '#B91C1C' },
//   appCard:    { backgroundColor: '#ECFDF5', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', gap: SPACING.md, borderWidth: 1, borderColor: '#A7F3D0', marginBottom: SPACING.lg },
//   appTitle:   { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#10B981', marginBottom: SPACING.xs },
//   appText:    { fontSize: FONT_SIZE.sm, color: '#065F46' },
//   doneBtn:    { borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: SPACING.md, ...SHADOWS.lg },
//   doneBtnText:{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
// });
//
// export default TaskDetailScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useTasksStore } from '../../store';
import { Task } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import FirestoreService from '../../services/firebase/firestore';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import CloudinaryService from '../../services/cloudinary';

const TaskDetailScreen = ({ route, navigation }: any) => {
  const taskId = route?.params?.taskId;
  const { tasks, completeTask } = useTasksStore();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadTask();
  }, [taskId, tasks]);

  const loadTask = async () => {
    if (!taskId) {
      setIsLoading(false);
      return;
    }
    try {
      const found = tasks.find(t => t.id === taskId);
      if (found) {
        setTask({ ...found });
        setIsLoading(false);
        return;
      }
      const fetched = await FirestoreService.getTask(taskId);
      setTask(fetched);
    } catch (e) {
      console.error('Error loading task:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickPhoto = () => {
    Alert.alert(
      'Upload Photo Proof',
      'Take a photo or choose from gallery',
      [
        {
          text: '📷 Camera',
          onPress: () => {
            launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.didCancel) return;
              if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Camera error');
                return;
              }
              const uri = response.assets?.[0]?.uri;
              if (uri) setSelectedPhoto(uri);
            });
          },
        },
        {
          text: '🖼️ Gallery',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.didCancel) return;
              if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Gallery error');
                return;
              }
              const uri = response.assets?.[0]?.uri;
              if (uri) setSelectedPhoto(uri);
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleComplete = () => {
    if (!task) return;

    // If photo required but not selected
    if (task.requirePhoto && !selectedPhoto) {
      Alert.alert('Photo Required', 'Please upload a photo proof first!');
      return;
    }

    Alert.alert(
      'Complete Task?',
      `Did you finish "${task.choreName || 'this task'}"?`,
      [
        { text: 'Not yet', style: 'cancel' },
        {
          text: 'Yes, Done!',
          onPress: async () => {
            try {
              setIsCompleting(true);

              let photoUrl: string | undefined;

              // Upload photo if selected
              if (selectedPhoto) {
                photoUrl = await CloudinaryService.uploadTaskPhoto(task.id, selectedPhoto);
              }

              await completeTask(task.id, photoUrl);
              setTask(prev => prev ? { ...prev, status: 'completed' } : null);
              Alert.alert(
                'Amazing! 🎉',
                `You earned ${task.pointsAwarded} points!`,
                [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
              );
            } catch {
              Alert.alert('Error', 'Failed. Try again!');
            } finally {
              setIsCompleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.grayText}>Loading task...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle-outline" size={64} color="#9CA3AF" />
        <Text style={styles.grayText}>Task not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompleted = task.status !== 'pending';

  const statusMap: Record<string, { color: string; label: string; icon: string }> = {
    pending:   { color: '#F59E0B', label: 'To Do',            icon: 'clock-outline' },
    completed: { color: '#3B82F6', label: 'Waiting Approval', icon: 'clock-check-outline' },
    approved:  { color: '#10B981', label: 'Approved!',        icon: 'check-circle' },
    rejected:  { color: '#EF4444', label: 'Rejected',         icon: 'close-circle' },
  };

  const status = statusMap[task.status] ?? statusMap.pending;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isCompleted ? ['#43e97b', '#38f9d7'] : ['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Icon
          name={isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={60}
          color="#FFFFFF"
          style={{ marginBottom: SPACING.lg }}
        />
        <Text style={styles.headerTitle}>{task.choreName || 'Task'}</Text>
        <Text style={styles.headerSub}>⭐ {task.pointsAwarded} points</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
          <Icon name={status.icon} size={18} color={status.color} />
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.infoIcon}>
              <Icon name="star" size={20} color="#FFF" />
            </LinearGradient>
            <View>
              <Text style={styles.infoLabel}>Points Reward</Text>
              <Text style={styles.infoValue}>{task.pointsAwarded} points</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.infoIcon}>
              <Icon name="calendar" size={20} color="#FFF" />
            </LinearGradient>
            <View>
              <Text style={styles.infoLabel}>Due Date</Text>
              <Text style={styles.infoValue}>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric',
                    })
                  : 'Today'}
              </Text>
            </View>
          </View>
        </View>

        {/* Photo Proof Section - only when requirePhoto is true and task is pending */}
        {task.requirePhoto && task.status === 'pending' && (
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <LinearGradient colors={['#f7971e', '#ffd200']} style={styles.infoIcon}>
                <Icon name="camera" size={20} color="#FFF" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Photo Proof Required</Text>
                <Text style={styles.infoValue}>Take a photo to complete</Text>
              </View>
            </View>

            {/* Show selected photo preview */}
            {selectedPhoto ? (
              <View style={{ marginTop: SPACING.md }}>
                <Image
                  source={{ uri: selectedPhoto }}
                  style={styles.photoPreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.changePhotoBtn}
                  onPress={handlePickPhoto}
                >
                  <Icon name="camera-retake" size={18} color="#667eea" />
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handlePickPhoto}
                activeOpacity={0.8}
              >
                <Icon name="camera-plus" size={32} color="#667eea" />
                <Text style={styles.uploadText}>Tap to Upload Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Show submitted photo if already completed */}
        {task.photoUrl && task.status !== 'pending' && (
          <View style={styles.card}>
            <Text style={[styles.infoLabel, { marginBottom: SPACING.sm }]}>
              📸 Submitted Photo
            </Text>
            <Image
              source={{ uri: task.photoUrl }}
              style={styles.photoPreview}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Rejection */}
        {task.status === 'rejected' && task.rejectionComment && (
          <View style={styles.rejCard}>
            <Icon name="close-circle" size={24} color="#EF4444" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rejTitle}>Rejected</Text>
              <Text style={styles.rejText}>{task.rejectionComment}</Text>
            </View>
          </View>
        )}

        {/* Approved */}
        {task.status === 'approved' && (
          <View style={styles.appCard}>
            <Icon name="check-circle" size={24} color="#10B981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.appTitle}>Task Approved!</Text>
              <Text style={styles.appText}>You earned {task.pointsAwarded} points!</Text>
            </View>
          </View>
        )}

        {/* Complete Button */}
        {task.status === 'pending' && (
          <TouchableOpacity
            onPress={handleComplete}
            disabled={isCompleting}
            activeOpacity={0.8}
            style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.doneBtn}
            >
              {isCompleting
                ? <ActivityIndicator color="#FFF" size="small" />
                : <Icon name="check-circle" size={28} color="#FFF" />
              }
              <Text style={styles.doneBtnText}>
                {isCompleting ? 'Uploading & Completing...' : 'Mark as Done!'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F5F5F5' },
  centered:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.lg, backgroundColor: '#F5F5F5' },
  grayText:   { fontSize: FONT_SIZE.lg, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
  backBtn:    { backgroundColor: '#667eea', paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.lg },
  backBtnText:{ color: '#FFF', fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.md },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.xxxl,
    left: SPACING.xl,
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF', textAlign: 'center', marginBottom: SPACING.sm },
  headerSub:   { fontSize: FONT_SIZE.lg, color: '#FFF', opacity: 0.9, fontWeight: FONT_WEIGHT.semibold },
  content:    { flex: 1, padding: SPACING.xl },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.round, alignSelf: 'center', marginBottom: SPACING.xl,
  },
  badgeText:  { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  card:       { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, ...SHADOWS.md, marginBottom: SPACING.lg },
  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
  infoIcon:   { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  infoLabel:  { fontSize: FONT_SIZE.sm, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
  infoValue:  { fontSize: FONT_SIZE.md, color: '#111827', fontWeight: FONT_WEIGHT.bold },
  divider:    { height: 1, backgroundColor: '#F3F4F6', marginVertical: SPACING.sm },
  rejCard:    { backgroundColor: '#FEF2F2', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', gap: SPACING.md, borderWidth: 1, borderColor: '#FECACA', marginBottom: SPACING.lg },
  rejTitle:   { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444', marginBottom: SPACING.xs },
  rejText:    { fontSize: FONT_SIZE.sm, color: '#B91C1C' },
  appCard:    { backgroundColor: '#ECFDF5', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', gap: SPACING.md, borderWidth: 1, borderColor: '#A7F3D0', marginBottom: SPACING.lg },
  appTitle:   { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#10B981', marginBottom: SPACING.xs },
  appText:    { fontSize: FONT_SIZE.sm, color: '#065F46' },
  doneBtn:    { borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: SPACING.md, ...SHADOWS.lg },
  doneBtnText:{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  uploadBtn:  { marginTop: SPACING.md, borderWidth: 2, borderColor: '#667eea', borderStyle: 'dashed', borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm },
  uploadText: { fontSize: FONT_SIZE.md, color: '#667eea', fontWeight: FONT_WEIGHT.semibold },
  photoPreview: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.lg },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm, justifyContent: 'center' },
  changePhotoText: { color: '#667eea', fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.sm },
});

export default TaskDetailScreen;