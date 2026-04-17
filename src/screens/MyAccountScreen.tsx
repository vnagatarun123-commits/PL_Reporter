import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

interface AccountRowProps {
  label: string;
  value?: string;
  changeLabel?: string;
  onPress?: () => void;
}

const AccountRow = ({ label, value, changeLabel = 'Change', onPress }: AccountRowProps) => (
  <>
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      <TouchableOpacity onPress={onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.changeText}>{changeLabel}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.divider} />
  </>
);

export default function MyAccountScreen() {
  const { user } = useUser();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Text style={styles.title}>{t.myAccount}</Text>
      <View style={styles.titleDivider} />

      <AccountRow label={t.email} value={user.email || undefined} changeLabel={t.change} />
      <AccountRow label={t.password} value="············" changeLabel={t.change} />
      <AccountRow label={t.mobileNumber} value={user.mobile.replace('+', '')} changeLabel={t.change} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: STATUS_BAR_HEIGHT + 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  titleDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  rowLeft: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  rowValue: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  changeText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
});
