import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;

const LANGUAGES: Language[] = ['English', 'Telugu'];

export default function AppLanguagesScreen({ navigation }: any) {
  const { language, setLanguage, t } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);

  const handleContinue = () => {
    setLanguage(selected);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 8 }]}>
        <Text style={styles.headerTitle}>{t.languages}</Text>
      </View>
      <View style={styles.headerDivider} />

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.subTitle}>{t.selectAppLanguage}</Text>

        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.langRow}
            onPress={() => setSelected(lang)}
            activeOpacity={0.7}
          >
            <Text style={styles.langLabel}>{lang}</Text>
            <View style={[styles.radioOuter, selected === lang && styles.radioOuterSelected]}>
              {selected === lang && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleContinue}
        activeOpacity={0.85}
      >
        <Text style={styles.continueText}>{t.continueBtn}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  subTitle: {
    fontSize: 22,
    color: '#1A1A1A',
    fontWeight: '400',
    marginBottom: 32,
  },

  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  langLabel: {
    fontSize: 16,
    color: '#333333',
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#E53935',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E53935',
  },

  continueBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
