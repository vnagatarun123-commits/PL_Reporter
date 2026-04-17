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
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

interface MenuItemProps {
  label: string;
  onPress?: () => void;
}

const MenuItem = ({ label, onPress }: MenuItemProps) => (
  <>
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#BBBBBB" />
    </TouchableOpacity>
    <View style={styles.divider} />
  </>
);

export default function ProfileMenuScreen({ navigation }: any) {
  const { user } = useUser();
  const { t } = useLanguage();

  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userId}>User ID-{user.id}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem label={t.myAccount} onPress={() => navigation.navigate('MyAccount')} />
        <MenuItem label={t.profileInformation} onPress={() => navigation.navigate('Profile')} />
        <MenuItem label={t.selectRegion} onPress={() => navigation.navigate('SelectRegion')} />
        <MenuItem label={t.appLanguages} onPress={() => navigation.navigate('AppLanguages')} />
        <MenuItem label={t.privacyPolicy} onPress={() => navigation.navigate('PrivacyPolicy')} />
        <MenuItem label={t.termsConditions} onPress={() => navigation.navigate('Terms')} />
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.85}>
        <Text style={styles.signOutText}>{t.signOut}</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <Text style={styles.versionText}>
        {'Version 1.1_live\nDevice: SM-S711B, 16'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: 48,
  },

  /* User Header */
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#A0522D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  userInfo: {
    flexDirection: 'column',
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  userId: {
    fontSize: 14,
    color: '#444444',
  },

  /* Menu */
  menuContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  menuLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 0,
  },

  /* Sign Out */
  signOutBtn: {
    alignSelf: 'center',
    width: 160,
    marginTop: 48,
    paddingVertical: 14,
    borderRadius: 6,
    backgroundColor: '#E53935',
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  /* Version */
  versionText: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 13,
    marginTop: 28,
    lineHeight: 22,
  },
});
