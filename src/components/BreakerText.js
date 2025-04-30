// components/BreakerText.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BreakerText = ({ text, color = '#666', fontSize = 14, marginVertical = 10 }) => {
  return (
    <View style={[styles.container, { marginVertical }]}>
      <View style={[styles.line, { backgroundColor: color }]} />
      <Text style={[styles.text, { color, fontSize }]}>{text}</Text>
      <View style={[styles.line, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BreakerText;