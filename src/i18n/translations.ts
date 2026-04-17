export type Language = 'English' | 'Telugu';

export interface Translations {
  // Home
  tabPublished: string;
  tabInReview: string;
  tabDrafts: string;
  tabRejected: string;
  tabReported: string;
  filterMostRecent: string;
  filterPopular: string;
  filterMostLiked: string;
  menuTranscribe: string;
  menuShare: string;
  menuEdit: string;
  menuDelete: string;
  emptyState: string;
  rejectedReason: string;

  // Profile Menu
  myAccount: string;
  profileInformation: string;
  selectRegion: string;
  appLanguages: string;
  privacyPolicy: string;
  termsConditions: string;
  signOut: string;

  // Profile Screen
  profile: string;
  editProfile: string;
  followers: string;
  following: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  userId: string;
  reporterLicence: string;
  yearOfExperience: string;
  artStyle: string;
  bio: string;

  // My Account
  password: string;
  change: string;

  // App Languages
  languages: string;
  selectAppLanguage: string;
  continueBtn: string;

  // Select Region
  selectRegionTitle: string;
  selectState: string;
  selectDistrict: string;
  selectMandal: string;

  // Shared
  subscribe: string;
  back: string;
  termsAndConditions: string;
}

const en: Translations = {
  // Home
  tabPublished: 'Published',
  tabInReview: 'In Review',
  tabDrafts: 'Drafts',
  tabRejected: 'Rejected',
  tabReported: 'Reported',
  filterMostRecent: 'Most Recent',
  filterPopular: 'Popular',
  filterMostLiked: 'Most Liked',
  menuTranscribe: 'Transcribe',
  menuShare: 'Share',
  menuEdit: 'Edit',
  menuDelete: 'Delete',
  emptyState: "Click on the '+' button to upload the video",
  rejectedReason: 'Reason',

  // Profile Menu
  myAccount: 'My Account',
  profileInformation: 'Profile Information',
  selectRegion: 'Select Region',
  appLanguages: 'App Languages',
  privacyPolicy: 'Privacy Policy',
  termsConditions: 'Terms & conditions',
  signOut: 'SIGN OUT',

  // Profile Screen
  profile: 'Profile',
  editProfile: 'Edit Profile',
  followers: 'Followers',
  following: 'Following',
  fullName: 'Full Name',
  mobileNumber: 'Mobile Number',
  email: 'Email',
  address: 'Address',
  userId: 'User ID',
  reporterLicence: 'Reporter Licence',
  yearOfExperience: 'Year Of Experience',
  artStyle: 'Art Style',
  bio: 'Bio',

  // My Account
  password: 'Password',
  change: 'Change',

  // App Languages
  languages: 'Languages',
  selectAppLanguage: 'Select your app Language',
  continueBtn: 'Continue',

  // Select Region
  selectRegionTitle: 'Select your',
  selectState: 'State',
  selectDistrict: 'District',
  selectMandal: 'Mandal',

  // Shared
  subscribe: 'Subscribe',
  back: 'Back',
  termsAndConditions: 'Terms and Conditions',
};

const te: Translations = {
  // Home
  tabPublished: 'ప్రచురించబడింది',
  tabInReview: 'సమీక్షలో',
  tabDrafts: 'డ్రాఫ్ట్‌లు',
  tabRejected: 'తిరస్కరించబడింది',
  tabReported: 'నివేదించబడింది',
  filterMostRecent: 'అత్యంత ఇటీవలి',
  filterPopular: 'ప్రజాదరణ పొందిన',
  filterMostLiked: 'అత్యంత ఇష్టమైన',
  menuTranscribe: 'లిప్యంతరీకరణ',
  menuShare: 'భాగస్వామ్యం చేయి',
  menuEdit: 'సవరించు',
  menuDelete: 'తొలగించు',
  emptyState: "వీడియో అప్‌లోడ్ చేయడానికి '+' బటన్ నొక్కండి",
  rejectedReason: 'కారణం',

  // Profile Menu
  myAccount: 'నా ఖాతా',
  profileInformation: 'ప్రొఫైల్ సమాచారం',
  selectRegion: 'ప్రాంతం ఎంచుకోండి',
  appLanguages: 'యాప్ భాషలు',
  privacyPolicy: 'గోప్యతా విధానం',
  termsConditions: 'నిబంధనలు & షరతులు',
  signOut: 'సైన్ అవుట్',

  // Profile Screen
  profile: 'ప్రొఫైల్',
  editProfile: 'ప్రొఫైల్ సవరించు',
  followers: 'అనుచరులు',
  following: 'అనుసరిస్తున్నారు',
  fullName: 'పూర్తి పేరు',
  mobileNumber: 'మొబైల్ నంబర్',
  email: 'ఇమెయిల్',
  address: 'చిరునామా',
  userId: 'యూజర్ ఐడి',
  reporterLicence: 'రిపోర్టర్ లైసెన్స్',
  yearOfExperience: 'అనుభవం సంవత్సరాలు',
  artStyle: 'కళా శైలి',
  bio: 'జీవిత చరిత్ర',

  // My Account
  password: 'పాస్‌వర్డ్',
  change: 'మార్చు',

  // App Languages
  languages: 'భాషలు',
  selectAppLanguage: 'మీ యాప్ భాషను ఎంచుకోండి',
  continueBtn: 'కొనసాగించు',

  // Select Region
  selectRegionTitle: 'మీ',
  selectState: 'రాష్ట్రం',
  selectDistrict: 'జిల్లా',
  selectMandal: 'మండలం',

  // Shared
  subscribe: 'చందా చేసుకోండి',
  back: 'వెనక్కి',
  termsAndConditions: 'నిబంధనలు మరియు షరతులు',
};

export const translations: Record<Language, Translations> = { English: en, Telugu: te };
