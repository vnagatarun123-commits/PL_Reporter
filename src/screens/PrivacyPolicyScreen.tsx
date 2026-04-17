import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;

const SECTIONS = [
  {
    title: 'Objective',
    content:
      'This Privacy Policy sets out how Puralocal and its affiliated companies ("Puralocal", "we", "our" or "us") collect, use, disclose and otherwise process personal information in connection with our website and video services.',
  },
  {
    title: 'Information We Collect',
    content:
      'We collect information you provide directly to us, such as when you create an account, upload content, or contact us for support. This includes name, email address, phone number, and any other information you choose to provide.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, and respond to your comments and questions.',
  },
  {
    title: 'Data Security',
    content:
      'We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.',
  },
];

export default function PrivacyPolicyScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* Red Header */}
      <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Logo + Subscribe Row */}
      <View style={styles.logoRow}>
        <Image
          source={require('../../assets/logo with black.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.subscribeBtn} activeOpacity={0.85}>
          <Text style={styles.subscribeText}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>Privacy Policy</Text>

        {/* Intro */}
        <Text style={styles.introText}>
          This Privacy Policy explains how Puralocal collects, uses, stores, and protects your
          personal information when you use our website and video services. It outlines what data
          we collect, how we use it, your rights, and the safeguards we take to keep your
          information secure.
        </Text>

        {/* Accordion Sections */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.accordionWrapper}>
            {/* Dropdown trigger */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setExpanded(expanded === section.title ? null : section.title)}
              activeOpacity={0.7}
            >
              <Text style={styles.accordionLabel}>{section.title}</Text>
              <Ionicons
                name={expanded === section.title ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#555555"
              />
            </TouchableOpacity>

            {/* Section heading + content */}
            <Text style={styles.sectionHeading}>
              {`${SECTIONS.indexOf(section) + 1}. ${section.title}`}
            </Text>
            {expanded === section.title && (
              <Text style={styles.sectionContent}>{section.content}</Text>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 14,
  },
  backBtn: { padding: 2 },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  logo: { width: 130, height: 38 },
  subscribeBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
  },
  subscribeText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },

  scroll: { flex: 1, paddingHorizontal: 20 },

  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 18,
  },
  introText: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },

  accordionWrapper: { marginBottom: 24 },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  accordionLabel: { fontSize: 15, color: '#333333' },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 24,
  },
});
