import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * TrustRating Component
 * Props:
 *  - label: label text (default: 'Your Trust')
 *  - rating: numeric rating, supports half-stars (e.g., 3.5)
 *  - max: maximum rating value (default: 5)
 *  - onPress: optional callback when component is pressed
 */
export default function TrustRating({
  label = 'Your Trust',
  rating = 0,
  max = 5,
  onPress,
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);
  const stars = [];

  // full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <MaterialCommunityIcons
        key={`full-${i}`}
        name="star"
        size={44}
        color="#FFD700"
        style={styles.star}
      />
    );
  }
  // half star
  if (hasHalf) {
    stars.push(
      <MaterialCommunityIcons
        key="half"
        name="star-half-full"
        size={44}
        color="#FFD700"
        style={styles.star}
      />
    );
  }
  // empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <MaterialCommunityIcons
        key={`empty-${i}`}
        name="star-outline"
        size={44}
        color="#FFD700"
        style={styles.star} 
      />
    );
  }

  // choose thumbs icon
  const thumbsName = rating >= 2.5 ? 'thumb-up-outline' : 'thumb-down-outline';
  const thumbsColor = rating >= 2.5 ? '#4CAF50' : '#E53935';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.wrapper}
    >
      <View style={styles.header}>
        {/* <MaterialCommunityIcons
          name="shield-check-outline"
          size={24}
          color="#555"
        /> */}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.body}>
        <MaterialCommunityIcons
          name={thumbsName}
          size={28}
          color={thumbsColor}
          style={styles.thumb}
        />
        <View style={styles.starRow}>{stars}</View>
        <Text style={styles.value}>{`${rating}/${max}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    marginRight: 12,
  },
  starRow: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
  value: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '900',
    color: '#555',
  },
});
