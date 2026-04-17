import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;

/* ── Static Data ── */
const STATES = [
  { en: 'Telangana', te: 'తెలంగాణ' },
  { en: 'Andhra Pradesh', te: 'ఆంధ్రప్రదేశ్' },
];

const DISTRICTS: Record<string, { en: string; te: string }[]> = {
  Telangana: [
    { en: 'Karimnagar', te: 'కరీంనగర్' },
    { en: 'Hyderabad', te: 'హైదరాబాద్' },
    { en: 'Warangal', te: 'వరంగల్' },
    { en: 'Nizamabad', te: 'నిజామాబాద్' },
  ],
  'Andhra Pradesh': [
    { en: 'Visakhapatnam', te: 'విశాఖపట్నం' },
    { en: 'Vijayawada', te: 'విజయవాడ' },
    { en: 'Guntur', te: 'గుంటూరు' },
  ],
};

const MANDALS: Record<string, { en: string; te: string }[]> = {
  Hyderabad: [
    { en: 'Hyderabad', te: 'హైదరాబాద్' },
    { en: 'Secunderabad', te: 'సికింద్రాబాద్' },
  ],
  Karimnagar: [
    { en: 'Karimnagar', te: 'కరీంనగర్' },
    { en: 'Huzurabad', te: 'హుజూరాబాద్' },
  ],
  Warangal: [
    { en: 'Warangal', te: 'వరంగల్' },
    { en: 'Hanamkonda', te: 'హనమకొండ' },
  ],
  Nizamabad: [
    { en: 'Nizamabad', te: 'నిజామాబాద్' },
  ],
  Visakhapatnam: [
    { en: 'Visakhapatnam', te: 'విశాఖపట్నం' },
  ],
  Vijayawada: [
    { en: 'Vijayawada', te: 'విజయవాడ' },
  ],
  Guntur: [
    { en: 'Guntur', te: 'గుంటూరు' },
  ],
};

type Step = 'state' | 'district' | 'mandal';

export default function SelectRegionScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('state');
  const [selectedState, setSelectedState] = useState<{ en: string; te: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ en: string; te: string } | null>(null);

  const stepTitle: Record<Step, string> = {
    state: 'State',
    district: 'District',
    mandal: 'Mandal',
  };

  const handleBack = () => {
    if (step === 'mandal') {
      setStep('district');
      setSelectedDistrict(null);
    } else if (step === 'district') {
      setStep('state');
      setSelectedState(null);
    } else {
      navigation.goBack();
    }
  };

  const handleStateSelect = (item: { en: string; te: string }) => {
    setSelectedState(item);
    setStep('district');
  };

  const handleDistrictSelect = (item: { en: string; te: string }) => {
    setSelectedDistrict(item);
    setStep('mandal');
  };

  const handleMandalSelect = (_item: { en: string; te: string }) => {
    navigation.goBack();
  };

  const listData =
    step === 'state'
      ? STATES
      : step === 'district'
      ? DISTRICTS[selectedState?.en ?? ''] ?? []
      : MANDALS[selectedDistrict?.en ?? ''] ?? [];

  const onSelect =
    step === 'state'
      ? handleStateSelect
      : step === 'district'
      ? handleDistrictSelect
      : handleMandalSelect;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 10 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Select your{' '}
          <Text style={styles.headerHighlight}>{stepTitle[step]}</Text>
        </Text>
      </View>

      {/* Selected Chips */}
      {(selectedState || selectedDistrict) && (
        <View style={styles.chipsRow}>
          {selectedState && (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => {
                setStep('state');
                setSelectedState(null);
                setSelectedDistrict(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.chipText}>{selectedState.te}</Text>
              <Ionicons name="close" size={14} color="#FFFFFF" style={styles.chipIcon} />
            </TouchableOpacity>
          )}
          {selectedDistrict && (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => {
                setStep('district');
                setSelectedDistrict(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.chipText}>{selectedDistrict.te}</Text>
              <Ionicons name="close" size={14} color="#FFFFFF" style={styles.chipIcon} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* List */}
      <FlatList
        data={listData}
        keyExtractor={(item) => item.en}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => onSelect(item)}
              activeOpacity={0.6}
            >
              <Text style={styles.itemEn}>{item.en}</Text>
              <Text style={styles.itemTe}>{item.te}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#F5F5F5',
    gap: 12,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerHighlight: {
    color: '#F5A623',
    fontWeight: '700',
  },

  /* Chips */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#F5F5F5',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 8,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  chipIcon: {
    marginLeft: 2,
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
  },

  /* List */
  listItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  itemEn: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemTe: {
    fontSize: 13,
    color: '#555555',
  },
});
