import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const platforms = [
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Twitter/X', icon: 'twitter' },
  { name: 'Snapchat', icon: 'snapchat' },
  { name: 'LinkedIn', icon: 'linkedin' },
  { name: 'TikTok', icon: 'music-note' },
];

/**
 * SocialMediaLinker
 * Props:
 * - value: object mapping platform names to links (controlled)
 * - onChange: callback(updatedLinks) when links change
 */
export default function SocialMediaLinker({ value = {}, onChange }) {
  const [links, setLinks] = useState(value);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [scales] = useState(platforms.map(() => new Animated.Value(1)));

  // Sync internal links when controlled value changes
  useEffect(() => {
    setLinks(value || {});
  }, [value]);

  const handleLinkChange = (platform, text) => {
    const updated = { ...links, [platform]: text };
    setLinks(updated);
    onChange && onChange(updated);
  };

  const finishEditing = () => setEditingPlatform(null);

  const animatePress = (index) => {
    Animated.sequence([
      Animated.timing(scales[index], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scales[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Link your Social Media Profiles</Text>

      <View style={styles.boxContainer}>
        {platforms.map((platformObj, idx) => {
          const { name, icon } = platformObj;
          const isEditing = editingPlatform === name;
          const hasLink = !!links[name];

          return (
            <Animated.View key={name} style={{ transform: [{ scale: scales[idx] }] }}>
              <TouchableOpacity
                style={[styles.box, hasLink && styles.filledBox]}
                onPress={() => {
                  setEditingPlatform(name);
                  animatePress(idx);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.iconRow}>
                  <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color={hasLink ? '#000' : '#aaa'}
                    style={{ marginRight: 6 }}
                  />

                  {isEditing ? (
                    <TextInput
                      placeholder={`Paste ${name} link`}
                      placeholderTextColor="#aaa"
                      value={links[name] || ''}
                      onChangeText={(text) => handleLinkChange(name, text.trim())}
                      onBlur={finishEditing}
                      autoFocus
                      style={styles.input}
                    />
                  ) : (
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                      {name}
                    </Text>
                  )}

                  {hasLink && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color="#4CAF50"
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#eee',
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  box: {
    minHeight: 42,
    margin: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  filledBox: {
    backgroundColor: '#e3eceb',
    borderStyle: 'solid',
    borderColor: '#f4efe9',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 220,
  },
  text: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  input: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
    paddingHorizontal: 4,
    flexShrink: 1,
  },
});
