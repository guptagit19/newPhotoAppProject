import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
//import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Color Palette and Styling Constants ---
const COLORS = {
  primary: '#5A3EBE',
  secondary: '#3B2B8A',
  background: '#F0F2F5',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  redCheckmark: '#FF0033',
  lockedIcon: '#808080',
  descriptionText: '#606060',
  featureText: '#404040',
  priceText: '#202020',

  // Plan-specific
  default: { bg: '#FFFFFF', text: '#3B2B8A', accent: '#5A3EBE' },
  silver: { bg: '#FCE4EC', text: '#D81B60', accent: '#F48FB1' },
  gold:   { bgStart: '#FFECB3', bgEnd: '#FFDA63', text: '#C5A32E', accent: '#FBC02D' },
  platinum: { bg: '#FFFFFF', text: '#3B2B8A', accent: '#5A3EBE' },
};

const SPACING = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  cardPadding: 20,
};

const TYPOGRAPHY = {
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.secondary },
  heading: { fontSize: 28, fontWeight: '800', color: COLORS.secondary, marginBottom: SPACING.xlarge },
  planName: { fontSize: 24, fontWeight: '700', marginBottom: SPACING.small, textTransform: 'uppercase' },
  description: { fontSize: 15, textAlign: 'center', lineHeight: 22, color: COLORS.descriptionText, marginBottom: SPACING.medium },
  featureText: { fontSize: 14, marginLeft: SPACING.small, flexShrink: 1, color: COLORS.featureText },
  price: { fontSize: 28, fontWeight: '800', color: COLORS.priceText },
  priceDuration: { fontSize: 16, fontWeight: '600', color: '#707070' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: COLORS.cardBackground },
};

const CARD_WIDTH = SCREEN_WIDTH * 0.95;
const CARD_MARGIN_HORIZONTAL = SPACING.small / 2;
const CONTENT_PADDING_HORIZONTAL = (SCREEN_WIDTH - CARD_WIDTH - CARD_MARGIN_HORIZONTAL * 1) / 2;

const ALL_POSSIBLE_FEATURES = [
  'Unlimited Likes',
  'See Who Likes You',
  'Priority Likes',
  'Unlimited Rewinds',
  '1 Free Boost per month',
  '2 Free Super Likes per week',
  '3 Free First Impressions per week',
  'Unlimited Passport™ Mode',
];

// Return plan-specific style or default
const getPlanStyles = (name) => {
  switch (name?.toUpperCase()) {
    case 'SILVER':   return COLORS.silver;
    case 'GOLD':     return COLORS.gold;
    case 'PLATINUM': return COLORS.platinum;
    default:         return COLORS.default;
  }
};

// Return background info (gradient for gold, solid for others)
const getCardBackgroundStyle = (planName) => {
  const name = planName?.toUpperCase();
  if (name === 'GOLD') {
    return {
      gradient: true,
      colors: [COLORS.gold.bgStart, COLORS.gold.bgEnd],
      start: { x: 0, y: 0 },
      end:   { x: 0, y: 1 },
    };
  }
  // fallback
  const { bg } = getPlanStyles(name);
  return { gradient: false, bg };
};

export default function SubscriptionScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  //const navigation = useNavigation();
  const listRef = useRef();

  const fetchPlans = () => {
    setLoading(true);
    fetch('http://192.168.0.159:8080/users/getSubscriptionDetails')
      .then(r => r.json())
      .then(json => setPlans(Array.isArray(json.data) ? json.data : []))
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Unable to load subscription plans');
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchPlans, []);

  const isFeatureLocked = (features, feat) => !Array.isArray(features) || !features.includes(feat);

  const buySubscription = (plan) => {
    Alert.alert(
      'Confirm Purchase',
      `Buy the ${plan.name} plan for ₹${parseFloat(plan.price).toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy', onPress: async () => {
            // TODO: replace with real user phone lookup
            const phoneNumber = 'USER_PHONE_HERE';
            if (!phoneNumber) return Alert.alert('Error', 'Phone number missing');
            try {
              const res = await fetch('http://192.168.0.159:8080/users/subscription/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, subscriptionId: plan.id }),
              });
              const json = await res.json();
              if (res.ok) Alert.alert('Success', json.message);
              else Alert.alert('Error', json.message || 'Purchase failed');
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Network error');
            }
          }}
      ]
    );
  };

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + CARD_MARGIN_HORIZONTAL*2));
    setActiveIndex(idx);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading plans...</Text>
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="cloud-off-outline" size={60} color={COLORS.secondary} />
        <Text>No subscription plans available.</Text>
        <TouchableOpacity onPress={fetchPlans} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subscription</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.mainHeading}>Choose Your Plan</Text>
      <FlatList
        ref={listRef}
        data={plans}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const planStyles = getPlanStyles(item.name);
          const bgStyle = getCardBackgroundStyle(item.name);
          const Wrapper = bgStyle.gradient ? LinearGradient : View;
          const wrapperProps = bgStyle.gradient
            ? { colors: bgStyle.colors, start: bgStyle.start, end: bgStyle.end }
            : { style: { backgroundColor: bgStyle.bg } };

          return (
            <View style={{ marginHorizontal: CARD_MARGIN_HORIZONTAL }}>
              <Wrapper {...wrapperProps} style={styles.card}>
                <Text style={[TYPOGRAPHY.planName, { color: planStyles.text }]}>{item.name}</Text>
                <Text style={[TYPOGRAPHY.description]}>{item.description}</Text>
                <View style={styles.featuresContainer}>
                  {ALL_POSSIBLE_FEATURES.map((f, i) => (
                    <View key={i} style={styles.featureItem}>
                      {isFeatureLocked(item.features, f)
                        ? <MaterialCommunityIcons name="lock" size={18} color={COLORS.lockedIcon} />
                        : <FontAwesome name="check" size={18} color={COLORS.redCheckmark} />
                      }
                      <Text style={[TYPOGRAPHY.featureText, { color: isFeatureLocked(item.features, f) ? COLORS.lockedIcon : COLORS.featureText }]}>{f}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[TYPOGRAPHY.price, { color: planStyles.text }]}>
                    ₹{item.price.toFixed(2)}
                  </Text>
                  <Text style={[TYPOGRAPHY.priceDuration]}> / month</Text>
                </View>
                <TouchableOpacity onPress={() => buySubscription(item)} style={styles.buyButton}>
                  <LinearGradient colors={[COLORS.primary, COLORS.secondary]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.buyButtonGradient}>
                    <Text style={TYPOGRAPHY.buttonText}>START ₹{item.price.toFixed(2)}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Wrapper>
            </View>
          );
        }}
      />
      <View style={styles.pagination}> 
        {plans.map((_, i) => <View key={i} style={[styles.dot, i===activeIndex?styles.dotActive:styles.dotInactive]} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingVertical: SPACING.large },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryButton: { marginTop: SPACING.small, padding: SPACING.small, backgroundColor: COLORS.primary, borderRadius: 6 },
  retryText: { color: COLORS.cardBackground, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.medium, marginBottom: SPACING.medium },
  headerTitle: { ...TYPOGRAPHY.headerTitle, textAlign: 'center', flex: 1 },
  mainHeading: { ...TYPOGRAPHY.heading, textAlign: 'center' },
  flatListContent: { paddingHorizontal: CONTENT_PADDING_HORIZONTAL },
  card: { width: CARD_WIDTH, borderRadius: 16, padding: SPACING.cardPadding, alignItems: 'center', overflow: 'hidden',
    ...Platform.select({ ios:{shadowColor:'#000',shadowOffset:{width:0,height:8},shadowOpacity:0.2,shadowRadius:12}, android:{elevation:12} }),
  },
  featuresContainer: { width: '100%', marginVertical: SPACING.medium },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xsmall },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: SPACING.large },
  buyButton: { width: '100%', borderRadius: 8, overflow: 'hidden' },
  buyButtonGradient: { paddingVertical: SPACING.medium, alignItems: 'center' },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.large },
  dot:{ width:8, height:8, borderRadius:4, marginHorizontal: SPACING.xsmall },
  dotActive:{ backgroundColor: COLORS.primary, width:10, height:10 },
  dotInactive:{ backgroundColor: COLORS.border },
});
