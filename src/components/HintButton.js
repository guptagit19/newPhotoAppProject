// components/HintButton.js
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

const HintButton = ({text, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e3eceb',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#000000', // Pure black
    fontWeight: 'bold', // Bold text
  },
});

export default HintButton;
