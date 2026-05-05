// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView,
//   TouchableOpacity, Alert, RefreshControl, ActivityIndicator,
// } from 'react-native';
// import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import firestore from '@react-native-firebase/firestore';
// import { useAuthStore } from '../../store';
//
// interface PendingTask {
//   id: string;
//   choreName: string;
//   kidId: string;
//   kidName: string;
//   pointsAwarded: number;
//   completedAt: Date;
// }
//
// const PendingApprovalsScreen = ({ navigation }: any) => {
//   const { user } = useAuthStore();
//   const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [processingId, setProcessingId] = useState<string | null>(null);
//
//   const loadPendingTasks = async () => {
//     if (!user?.id) return;
//     try {
//       const kidsSnap = await firestore()
//         .collection('kids')
//         .where('parentId', '==', user.id)
//         .get();
//
//       const kidIds = kidsSnap.docs.map(d => d.id);
//       const kidMap: Record<string, string> = {};
//       kidsSnap.docs.forEach(d => { kidMap[d.id] = d.data().name || 'Kid'; });
//
//       if (kidIds.length === 0) { setPendingTasks([]); setIsLoading(false); return; }
//
//       const tasksSnap = await firestore()
//         .collection('tasks')
//         .where('status', '==', 'completed')
//         .get();
//
//       const tasks: PendingTask[] = tasksSnap.docs
//         .filter(d => kidIds.includes(d.data().kidId))
//         .map(d => {
//           const data = d.data();
//           return {
//             id: d.id,
//             choreName: data.choreName || 'Task',
//             kidId: data.kidId || '',
//             kidName: kidMap[data.kidId] || 'Kid',
//             pointsAwarded: data.pointsAwarded || 0,
//             completedAt: data.completedAt?.toDate?.() ?? new Date(),
//           };
//         });
//
//       setPendingTasks(tasks);
//     } catch (error) {
//       console.error('Error loading pending tasks:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   useEffect(() => { loadPendingTasks(); }, [user?.id]);
//   const onRefresh = async () => { setRefreshing(true); await loadPendingTasks(); setRefreshing(false); };
//
//   const handleApprove = (task: PendingTask) => {
//     Alert.alert(
//       'Approve Task?',
//       `Approve "${task.choreName}" for ${task.kidName} and award ${task.pointsAwarded} points?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Approve',
//           onPress: async () => {
//             try {
//               setProcessingId(task.id);
//               // Update task
//               await firestore().collection('tasks').doc(task.id).update({
//                 status: 'approved',
//                 approvedAt: firestore.Timestamp.now(),
//               });
//               // Add points to kid
//               const kidRef = firestore().collection('kids').doc(task.kidId);
//               const kidDoc = await kidRef.get();
//               const currentPoints = kidDoc.data()?.points || 0;
//               await kidRef.update({ points: currentPoints + task.pointsAwarded });
//               // Update UI
//               setPendingTasks(prev => prev.filter(t => t.id !== task.id));
//               Alert.alert('Approved!', `${task.pointsAwarded} points added to ${task.kidName}!`);
//             } catch (err: any) {
//               Alert.alert('Error', err?.message || 'Failed to approve.');
//             } finally {
//               setProcessingId(null);
//             }
//           },
//         },
//       ]
//     );
//   };
//
//   const handleReject = (task: PendingTask) => {
//     Alert.alert(
//       'Reject Task?',
//       `Reject "${task.choreName}" for ${task.kidName}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Reject',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setProcessingId(task.id);
//               await firestore().collection('tasks').doc(task.id).update({
//                 status: 'rejected',
//                 rejectionComment: 'Please try again.',
//               });
//               setPendingTasks(prev => prev.filter(t => t.id !== task.id));
//             } catch (err: any) {
//               Alert.alert('Error', err?.message || 'Failed to reject.');
//             } finally {
//               setProcessingId(null);
//             }
//           },
//         },
//       ]
//     );
//   };
//
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#667eea" />
//         <Text style={styles.loadingText}>Loading tasks...</Text>
//       </View>
//     );
//   }
//
//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-left" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Pending Approvals</Text>
//         <Text style={styles.headerSub}>{pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} waiting</Text>
//       </LinearGradient>
//
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {pendingTasks.length === 0 ? (
//           <View style={styles.empty}>
//             <Icon name="check-circle-outline" size={64} color="#D1D5DB" />
//             <Text style={styles.emptyTitle}>All caught up!</Text>
//             <Text style={styles.emptySub}>No tasks waiting for approval</Text>
//           </View>
//         ) : (
//           pendingTasks.map((task) => (
//             <View key={task.id} style={styles.taskCard}>
//               <View style={styles.taskTop}>
//                 <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.kidAvatar}>
//                   <Text style={styles.kidInitial}>{task.kidName.charAt(0).toUpperCase()}</Text>
//                 </LinearGradient>
//                 <View style={styles.taskInfo}>
//                   <Text style={styles.taskName}>{task.choreName}</Text>
//                   <Text style={styles.kidNameText}>{task.kidName}</Text>
//                   <Text style={styles.taskMeta}>
//                     ⭐ {task.pointsAwarded} pts • {task.completedAt.toLocaleDateString()}
//                   </Text>
//                 </View>
//               </View>
//
//               {processingId === task.id ? (
//                 <View style={styles.processingRow}>
//                   <ActivityIndicator size="small" color="#667eea" />
//                   <Text style={styles.processingText}>Processing...</Text>
//                 </View>
//               ) : (
//                 <View style={styles.actions}>
//                   <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(task)} activeOpacity={0.7}>
//                     <Icon name="close" size={20} color="#EF4444" />
//                     <Text style={styles.rejectBtnText}>Reject</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={{ flex: 1 }} onPress={() => handleApprove(task)} activeOpacity={0.7}>
//                     <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.approveBtn}>
//                       <Icon name="check" size={20} color="#FFF" />
//                       <Text style={styles.approveBtnText}>Approve</Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           ))
//         )}
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container:      { flex: 1, backgroundColor: '#F5F5F5' },
//   centered:       { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
//   loadingText:    { fontSize: FONT_SIZE.md, color: '#6B7280' },
//   header:         { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
//   backBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
//   headerTitle:    { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
//   headerSub:      { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
//   content:        { flex: 1, padding: SPACING.xl },
//   empty:          { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, marginTop: SPACING.xl, ...SHADOWS.sm },
//   emptyTitle:     { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginTop: SPACING.lg },
//   emptySub:       { fontSize: FONT_SIZE.md, color: '#9CA3AF', marginTop: SPACING.xs },
//   taskCard:       { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md },
//   taskTop:        { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
//   kidAvatar:      { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
//   kidInitial:     { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
//   taskInfo:       { flex: 1 },
//   taskName:       { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: 2 },
//   kidNameText:    { fontSize: FONT_SIZE.sm, color: '#667eea', fontWeight: FONT_WEIGHT.semibold, marginBottom: 2 },
//   taskMeta:       { fontSize: FONT_SIZE.sm, color: '#6B7280' },
//   processingRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
//   processingText: { fontSize: FONT_SIZE.md, color: '#667eea', fontWeight: FONT_WEIGHT.medium },
//   actions:        { flexDirection: 'row', gap: SPACING.md },
//   rejectBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
//   rejectBtnText:  { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444' },
//   approveBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg },
//   approveBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#FFF' },
// });
//
// export default PendingApprovalsScreen;

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, RefreshControl, ActivityIndicator, Image,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../../store';

interface PendingTask {
  id: string;
  choreName: string;
  kidId: string;
  kidName: string;
  pointsAwarded: number;
  completedAt: Date;
  photoUrl?: string;        // ← Added
  requirePhoto?: boolean;   // ← Added
}

const PendingApprovalsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  const loadPendingTasks = async () => {
    if (!user?.id) return;
    try {
      const kidsSnap = await firestore()
        .collection('kids')
        .where('parentId', '==', user.id)
        .get();

      const kidIds = kidsSnap.docs.map(d => d.id);
      const kidMap: Record<string, string> = {};
      kidsSnap.docs.forEach(d => { kidMap[d.id] = d.data().name || 'Kid'; });

      if (kidIds.length === 0) { setPendingTasks([]); setIsLoading(false); return; }

      const tasksSnap = await firestore()
        .collection('tasks')
        .where('status', '==', 'completed')
        .get();

      const tasks: PendingTask[] = tasksSnap.docs
        .filter(d => kidIds.includes(d.data().kidId))
        .map(d => {
          const data = d.data();
          return {
            id: d.id,
            choreName: data.choreName || 'Task',
            kidId: data.kidId || '',
            kidName: kidMap[data.kidId] || 'Kid',
            pointsAwarded: data.pointsAwarded || 0,
            completedAt: data.completedAt?.toDate?.() ?? new Date(),
            photoUrl: data.photoUrl || undefined,       // ← Added
            requirePhoto: data.requirePhoto || false,   // ← Added
          };
        });

      setPendingTasks(tasks);
    } catch (error) {
      console.error('Error loading pending tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPendingTasks(); }, [user?.id]);
  const onRefresh = async () => { setRefreshing(true); await loadPendingTasks(); setRefreshing(false); };

  const handleApprove = (task: PendingTask) => {
    Alert.alert(
      'Approve Task?',
      `Approve "${task.choreName}" for ${task.kidName} and award ${task.pointsAwarded} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              setProcessingId(task.id);
              await firestore().collection('tasks').doc(task.id).update({
                status: 'approved',
                approvedAt: firestore.Timestamp.now(),
              });
              const kidRef = firestore().collection('kids').doc(task.kidId);
              const kidDoc = await kidRef.get();
              const currentPoints = kidDoc.data()?.points || 0;
              await kidRef.update({ points: currentPoints + task.pointsAwarded });
              setPendingTasks(prev => prev.filter(t => t.id !== task.id));
              Alert.alert('Approved!', `${task.pointsAwarded} points added to ${task.kidName}!`);
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to approve.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = (task: PendingTask) => {
    Alert.alert(
      'Reject Task?',
      `Reject "${task.choreName}" for ${task.kidName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingId(task.id);
              await firestore().collection('tasks').doc(task.id).update({
                status: 'rejected',
                rejectionComment: 'Please try again.',
              });
              setPendingTasks(prev => prev.filter(t => t.id !== task.id));
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to reject.');
            } finally {
              setProcessingId(null);
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
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
        <Text style={styles.headerSub}>{pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} waiting</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {pendingTasks.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="check-circle-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No tasks waiting for approval</Text>
          </View>
        ) : (
          pendingTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskTop}>
                <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.kidAvatar}>
                  <Text style={styles.kidInitial}>{task.kidName.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.choreName}</Text>
                  <Text style={styles.kidNameText}>{task.kidName}</Text>
                  <Text style={styles.taskMeta}>
                    ⭐ {task.pointsAwarded} pts • {task.completedAt.toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Photo Proof Section */}
              {task.requirePhoto && (
                <View style={styles.photoSection}>
                  <View style={styles.photoHeader}>
                    <Icon name="camera" size={16} color="#667eea" />
                    <Text style={styles.photoLabel}>Photo Proof</Text>
                  </View>
                  {task.photoUrl ? (
                    <TouchableOpacity
                      onPress={() => setExpandedPhoto(
                        expandedPhoto === task.id ? null : task.id
                      )}
                      activeOpacity={0.9}
                    >
                      <Image
                        source={{ uri: task.photoUrl }}
                        style={[
                          styles.photoThumb,
                          expandedPhoto === task.id && styles.photoExpanded
                        ]}
                        resizeMode="cover"
                      />
                      <Text style={styles.photoHint}>
                        {expandedPhoto === task.id ? 'Tap to collapse' : 'Tap to expand'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.noPhoto}>
                      <Icon name="image-off" size={24} color="#9CA3AF" />
                      <Text style={styles.noPhotoText}>No photo submitted</Text>
                    </View>
                  )}
                </View>
              )}

              {processingId === task.id ? (
                <View style={styles.processingRow}>
                  <ActivityIndicator size="small" color="#667eea" />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              ) : (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(task)} activeOpacity={0.7}>
                    <Icon name="close" size={20} color="#EF4444" />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => handleApprove(task)} activeOpacity={0.7}>
                    <LinearGradient colors={['#43e97b', '#38f9d7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.approveBtn}>
                      <Icon name="check" size={20} color="#FFF" />
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F5F5F5' },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText:    { fontSize: FONT_SIZE.md, color: '#6B7280' },
  header:         { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
  backBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  headerTitle:    { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  headerSub:      { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
  content:        { flex: 1, padding: SPACING.xl },
  empty:          { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, marginTop: SPACING.xl, ...SHADOWS.sm },
  emptyTitle:     { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginTop: SPACING.lg },
  emptySub:       { fontSize: FONT_SIZE.md, color: '#9CA3AF', marginTop: SPACING.xs },
  taskCard:       { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md },
  taskTop:        { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  kidAvatar:      { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  kidInitial:     { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  taskInfo:       { flex: 1 },
  taskName:       { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: 2 },
  kidNameText:    { fontSize: FONT_SIZE.sm, color: '#667eea', fontWeight: FONT_WEIGHT.semibold, marginBottom: 2 },
  taskMeta:       { fontSize: FONT_SIZE.sm, color: '#6B7280' },
  photoSection:   { backgroundColor: '#F9FAFB', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: '#E5E7EB' },
  photoHeader:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.sm },
  photoLabel:     { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: '#667eea' },
  photoThumb:     { width: '100%', height: 150, borderRadius: BORDER_RADIUS.md },
  photoExpanded:  { height: 300 },
  photoHint:      { fontSize: FONT_SIZE.xs, color: '#9CA3AF', textAlign: 'center', marginTop: SPACING.xs },
  noPhoto:        { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, justifyContent: 'center', paddingVertical: SPACING.md },
  noPhotoText:    { fontSize: FONT_SIZE.sm, color: '#9CA3AF' },
  processingRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
  processingText: { fontSize: FONT_SIZE.md, color: '#667eea', fontWeight: FONT_WEIGHT.medium },
  actions:        { flexDirection: 'row', gap: SPACING.md },
  rejectBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  rejectBtnText:  { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444' },
  approveBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  approveBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#FFF' },
});

export default PendingApprovalsScreen;