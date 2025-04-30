import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Threshold for deciding when to switch to vertical layout
const LONG_VALUE_THRESHOLD = 15;

const InfoRow = ({ icon, label, value, onChange }) => {
  const isLong = value?.length > LONG_VALUE_THRESHOLD;

  // Vertical layout for long values
  if (isLong) {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View style={[styles.container, styles.containerLong]}>          
          <View style={styles.header}>
            {icon && <MaterialCommunityIcons name={icon} size={20} color="#555" />}
            <Text style={[styles.label, !icon && styles.noIconLabel]}>{label}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.body}>
            <Text style={styles.value}>{value}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default inline layout
  return (
    <TouchableOpacity
      onPress={onChange ? () => onChange(value) : null}
      activeOpacity={onChange ? 0.7 : 1}
    >
      <View style={styles.container}>
        <View style={styles.left}>
          {icon && (
            <MaterialCommunityIcons name={icon} size={20} color="#555" />
          )}
          <Text style={[styles.label, !icon && styles.noIconLabel]}>
            {label}
          </Text>
        </View>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Vertical container override
  containerLong: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    alignSelf: 'stretch',
    marginVertical: 8,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  noIconLabel: {
    marginLeft: 0,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    flexShrink: 1,
  },
});

export default InfoRow;
