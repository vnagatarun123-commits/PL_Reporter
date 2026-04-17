import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || ' '}</Text>
  </View>
);

export default function ProfileScreen({ navigation }: any) {
  const { user } = useUser();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.profile}</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar + Edit */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="alert-circle" size={50} color={Colors.primary} />
            </View>
            <View style={styles.badge}>
              <Ionicons name="pencil" size={11} color={Colors.white} />
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>{t.editProfile}</Text>
          </TouchableOpacity>
        </View>

        {/* Followers / Following */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.followers}</Text>
            <Text style={styles.statLabel}>{t.followers}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>{t.following}</Text>
          </View>
        </View>

        {/* Profile Fields */}
        <InfoRow label={t.fullName} value={user.fullName} />
        <InfoRow label={t.mobileNumber} value={user.mobile} />
        <InfoRow label={t.email} value={user.email} />
        <InfoRow label={t.address} value={user.address} />
        <InfoRow label={t.userId} value={user.id} />
        <InfoRow label={t.reporterLicence} value={user.reporterLicence} />
        <InfoRow label={t.yearOfExperience} value={user.yearsOfExperience} />
        <InfoRow label={t.artStyle} value={user.artStyle} />
        <InfoRow label={t.bio} value={user.bio} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  headerDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    gap: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  editBtn: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  editBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.grey,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
});
