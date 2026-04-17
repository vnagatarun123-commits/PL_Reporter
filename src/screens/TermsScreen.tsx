import React from 'react';
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

export default function TermsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* Red Header */}
      <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
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
        <Text style={styles.pageTitle}>Terms & Conditions</Text>

        <Text style={styles.bodyText}>
          Welcome to Puralocal. These Terms & Conditions ("Terms") govern your access to and use of
          our website and video services. These Terms constitute a legally binding agreement between
          Puralocal, its affiliates, successors, and permitted assigns (collectively, "Company",
          "we", "us", or "our") and any natural or legal person ("User", "you", or "your")
          accessing, browsing, or otherwise utilising our website and video platform distributed via
          such platforms determined by the Company (collectively, the "Service").
        </Text>

        <Text style={styles.bodyText}>
          By accessing or using the Platform, you expressly agree to be bound by these Terms and all
          applicable laws, including the Information Technology Act, 2000, the Information Technology
          (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, international digital
          or data regulations, and all other applicable laws and regulations.
        </Text>

        <Text style={styles.bodyText}>
          If you do not agree to these Terms, you must immediately discontinue your use of the
          Platform. Puralocal reserves the right to update or modify these Terms at any time without
          prior notice. Your continued use of the Platform following any changes constitutes your
          acceptance of the revised Terms.
        </Text>

        <Text style={styles.sectionHeading}>1. Eligibility</Text>
        <Text style={styles.bodyText}>
          You must be at least 18 years of age to use the Platform. By using our services, you
          represent and warrant that you meet this requirement and have the legal capacity to enter
          into a binding agreement.
        </Text>

        <Text style={styles.sectionHeading}>2. User Accounts</Text>
        <Text style={styles.bodyText}>
          You are responsible for maintaining the confidentiality of your account credentials and for
          all activities that occur under your account. You agree to notify us immediately of any
          unauthorized use of your account.
        </Text>

        <Text style={styles.sectionHeading}>3. Content Policy</Text>
        <Text style={styles.bodyText}>
          Users may upload video content subject to our content guidelines. You retain ownership of
          your content but grant Puralocal a non-exclusive license to use, display, and distribute
          your content on the platform.
        </Text>

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
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 28,
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
});
