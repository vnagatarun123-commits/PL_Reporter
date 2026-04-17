import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44;

/* ── Mock Data ── */
const PUBLISHED = [
  { id: '1', title: 'సీఎం కేసీఆర్ బహిరంగసభ', type: 'Video', date: '29-OCT-2023', views: '103K వ్యక్తులు', thumb: null },
  { id: '2', title: 'యూట్యూబ్‌లో చూసి బాంబు...', type: 'Shorts', date: '29-OCT-2023', views: '103K వ్యక్తులు', thumb: null },
  { id: '3', title: 'మహిళ హత్య కేసును చేధిం...', type: 'Video', date: '29-OCT-2023', views: '103K వ్యక్తులు', thumb: null },
  { id: '4', title: 'వంపాపేటలో యువతి దారు...', type: 'Video', date: '29-OCT-2023', views: '103K వ్యక్తులు', thumb: null },
  { id: '5', title: 'కావలిలో బస్సు డైవర్‌పై దు...', type: 'Shorts', date: '29-OCT-2023', views: '103K వ్యక్తులు', thumb: null },
];

const IN_REVIEW = [
  { id: '1', title: 'సీఎం కేసీఆర్ బహిరంగసభ', type: 'Video', date: '29-OCT-2023', thumb: null },
  { id: '2', title: 'కావలిలో బస్సు డైవర్‌పై దు...', type: 'Shorts', date: '29-OCT-2023', thumb: null },
];

const DRAFTS = [
  { id: '1', title: 'సీఎం కేసీఆర్ బహిరంగసభ', type: 'Video', date: '29-OCT-2023', time: '2:30', thumb: null },
  { id: '2', title: 'సైబర్ నేరగాళ్ళ కొత్త అస్త్రం', type: 'Shorts', date: '29-OCT-2023', time: '2:30', thumb: null },
];

const REJECTED = [
  { id: '1', title: 'సీఎం కేసీఆర్ బహిరంగసభ', date: '29-OCT-2023', time: '2:30 PM', reason: 'Lack of Audio, Cringe video', thumb: null },
];

const REPORTED = [
  { id: '1', title: 'యూట్యూబ్‌లో చూసి బాంబు...', date: '29-OCT-2023', thumb: null },
];

type MenuType = { id: string; tab: string } | null;

export default function HomeScreen() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('published');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const [menuY, setMenuY] = useState(0);

  const TABS = [
    { key: 'published', label: t.tabPublished, count: 120 },
    { key: 'review', label: t.tabInReview, count: 2 },
    { key: 'drafts', label: t.tabDrafts, count: 2 },
    { key: 'rejected', label: t.tabRejected, count: 1 },
    { key: 'reported', label: t.tabReported, count: 0 },
  ];

  const FILTERS = [t.filterMostRecent, t.filterPopular, t.filterMostLiked];
  const currentFilter = activeFilter ?? t.filterMostRecent;

  const closeMenu = () => setOpenMenu(null);

  /* Thumbnail placeholder */
  const Thumb = () => (
    <View style={styles.thumb}>
      <MaterialIcons name="play-circle-outline" size={28} color="#FFFFFF" />
    </View>
  );

  /* Three-dot menu button — measures its screen position then opens the overlay */
  const MenuBtn = ({ id, tab }: { id: string; tab: string }) => {
    const btnRef = useRef<TouchableOpacity>(null);
    return (
      <TouchableOpacity
        ref={btnRef}
        style={styles.menuBtn}
        onPress={() => {
          if (openMenu?.id === id && openMenu?.tab === tab) {
            closeMenu();
            return;
          }
          btnRef.current?.measureInWindow((_x, y, _w, h) => {
            setMenuY(y + h + 4);
            setOpenMenu({ id, tab });
          });
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#888888" />
      </TouchableOpacity>
    );
  };

  /* Screen-level dropdown rendered in a Modal so it floats above all content */
  const OverlayDropdown = () => {
    if (!openMenu) return null;
    const { tab } = openMenu;
    return (
      <Modal transparent visible onRequestClose={closeMenu} statusBarTranslucent>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.dropdown, { top: menuY }]}>
                {tab === 'published' && (
                  <>
                    <TouchableOpacity style={styles.dropItem} onPress={closeMenu}>
                      <MaterialCommunityIcons name="account-voice" size={16} color="#555" />
                      <Text style={styles.dropLabel}>{t.menuTranscribe}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropItem} onPress={closeMenu}>
                      <Ionicons name="share-social-outline" size={16} color="#555" />
                      <Text style={styles.dropLabel}>{t.menuShare}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {tab === 'drafts' && (
                  <>
                    <TouchableOpacity style={styles.dropItem} onPress={closeMenu}>
                      <MaterialIcons name="edit" size={16} color="#555" />
                      <Text style={styles.dropLabel}>{t.menuEdit}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropItem} onPress={closeMenu}>
                      <MaterialIcons name="delete-outline" size={16} color="#E53935" />
                      <Text style={[styles.dropLabel, { color: '#E53935' }]}>{t.menuDelete}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {(tab === 'review' || tab === 'reported') && (
                  <>
                    <TouchableOpacity style={styles.dropItem} onPress={closeMenu}>
                      <Ionicons name="share-social-outline" size={16} color="#555" />
                      <Text style={styles.dropLabel}>{t.menuShare}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropItem} onPress={closeMenu}>
                      <MaterialIcons name="delete-outline" size={16} color="#E53935" />
                      <Text style={[styles.dropLabel, { color: '#E53935' }]}>{t.menuDelete}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderPublished = ({ item }: any) => (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.videoCard}>
        <Thumb />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.type} | పబ్లిష్డ్ అన్ {item.date} | {item.views}</Text>
        </View>
        <MenuBtn id={item.id} tab="published" />
      </View>
    </TouchableWithoutFeedback>
  );

  const renderReview = ({ item }: any) => (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.videoCard}>
        <Thumb />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.type} | అప్లోడెడ్ అన్ {item.date} | ...</Text>
        </View>
        <MenuBtn id={item.id} tab="review" />
      </View>
    </TouchableWithoutFeedback>
  );

  const renderDraft = ({ item }: any) => (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.videoCard}>
        <Thumb />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>అప్లోడెడ్ అన్ {item.date} | {item.time}...</Text>
        </View>
        <MenuBtn id={item.id} tab="drafts" />
      </View>
    </TouchableWithoutFeedback>
  );

  const renderRejected = ({ item }: any) => (
    <View style={styles.rejectedCard}>
      <View style={styles.videoCard}>
        <Thumb />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>అప్లోడెడ్ అన్ {item.date} | {item.time}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.rejectionBox}>
        <Text style={styles.rejectionText}>
          <Text style={styles.rejectionLabel}>{t.rejectedReason}:  </Text>
          {item.reason}
        </Text>
      </View>
    </View>
  );

  const renderReported = ({ item }: any) => (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.videoCard}>
        <Thumb />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>పబ్లిష్డ్ అన్ {item.date}</Text>
        </View>
        <MenuBtn id={item.id} tab="reported" />
      </View>
    </TouchableWithoutFeedback>
  );

  const emptyState = (
    <View style={styles.emptyState}>
      <MaterialIcons name="video-library" size={65} color="#C2C2C2" />
      <Text style={styles.emptyText}>{t.emptyState}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

        {/* Header */}
        <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 6 }]}>
          <Image
            source={require('../../assets/Pura local logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => { setActiveTab(tab.key); closeMenu(); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab.count} {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Published — search + filter */}
        {activeTab === 'published' && (
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.searchIcon}>
              <Ionicons name="search" size={20} color="#555" />
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, currentFilter === f && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, currentFilter === f && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <View style={{ flex: 1 }}>
          {activeTab === 'published' && (
            <FlatList data={PUBLISHED} keyExtractor={(i) => i.id} renderItem={renderPublished}
              ListEmptyComponent={emptyState} showsVerticalScrollIndicator={false}
              contentContainerStyle={PUBLISHED.length === 0 ? { flex: 1 } : { paddingBottom: 80 }} />
          )}
          {activeTab === 'review' && (
            <FlatList data={IN_REVIEW} keyExtractor={(i) => i.id} renderItem={renderReview}
              ListEmptyComponent={emptyState} showsVerticalScrollIndicator={false}
              contentContainerStyle={IN_REVIEW.length === 0 ? { flex: 1 } : { paddingBottom: 80 }} />
          )}
          {activeTab === 'drafts' && (
            <FlatList data={DRAFTS} keyExtractor={(i) => i.id} renderItem={renderDraft}
              ListEmptyComponent={emptyState} showsVerticalScrollIndicator={false}
              contentContainerStyle={DRAFTS.length === 0 ? { flex: 1 } : { paddingBottom: 80 }} />
          )}
          {activeTab === 'rejected' && (
            <FlatList data={REJECTED} keyExtractor={(i) => i.id} renderItem={renderRejected}
              ListEmptyComponent={emptyState} showsVerticalScrollIndicator={false}
              contentContainerStyle={REJECTED.length === 0 ? { flex: 1 } : { paddingBottom: 80 }} />
          )}
          {activeTab === 'reported' && (
            <FlatList data={REPORTED} keyExtractor={(i) => i.id} renderItem={renderReported}
              ListEmptyComponent={emptyState} showsVerticalScrollIndicator={false}
              contentContainerStyle={REPORTED.length === 0 ? { flex: 1 } : { paddingBottom: 80 }} />
          )}
        </View>

        {/* FAB */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Screen-level dropdown overlay */}
        <OverlayDropdown />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },

  /* Header */
  header: {
    backgroundColor: '#1a1a1a',
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
  logo: { height: 40, width: 180 },

  /* Tabs */
  tabsWrapper: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 0,
  },
  tabsScroll: {
    paddingHorizontal: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#E53935',
  },
  tabText: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Filter row */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchIcon: { marginRight: 8 },
  filterScroll: { gap: 8, paddingRight: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  filterChipActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  filterText: { fontSize: 13, color: '#444444' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },

  /* Video Card */
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    gap: 10,
  },
  thumb: {
    width: 100,
    height: 68,
    borderRadius: 4,
    backgroundColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardMeta: {
    fontSize: 11,
    color: '#888888',
    lineHeight: 16,
  },
  menuBtn: {
    padding: 6,
  },

  /* Modal overlay for dropdown */
  modalOverlay: {
    flex: 1,
  },

  /* Dropdown */
  dropdown: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 140,
    paddingVertical: 4,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  dropLabel: {
    fontSize: 14,
    color: '#333333',
  },

  /* Rejected card */
  rejectedCard: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  rejectionBox: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rejectionLabel: {
    fontWeight: '700',
    color: '#333333',
    fontSize: 13,
  },
  rejectionText: {
    fontSize: 13,
    color: '#555555',
  },

  /* Empty state */
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 60,
  },
  emptyText: {
    color: '#9A9A9A',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
