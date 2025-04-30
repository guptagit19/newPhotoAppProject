import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * DynamicBoxGrid with HintButton-style adaptive boxes
 * - Always two empty boxes per row
 * - Filled boxes shrink-wrap to text + padding
 * - Very long text spans full width
 */
export default function DynamicBoxGrid({label, value, onChange, boxCount, InstruText}) {
  const [values, setValues] = useState(Array(boxCount).fill(''));
  const [editingIndex, setEditingIndex] = useState(null);

  // sync when parent value changes
  useEffect(() => {
    // fill up to boxCount; pad with '' if needed
    const arr = Array(boxCount)
      .fill('')
      .map((_, i) => (value[i] != null ? value[i] : ''));
    setValues(arr);
  }, [value, boxCount]);

  const finishEditing = () => setEditingIndex(null);

  const handleTextChange = (text, idx) => {
    const newArr = [...values];
    newArr[idx] = text;
    setValues(newArr);
    onChange && onChange(newArr.filter(v => v)); // remove empty
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.legend}>{label}</Text>
 
      <View style={styles.container}>
        {/* Instruction Text yaha pe rakho */}
        <Text style={styles.instruction}>
          {InstruText}
        </Text>

        {values.map((val, idx) => {
          const isEditing = editingIndex === idx;
          const isFilled = !!val;
          const longText = isFilled && val.length > 30;

          let widthStyle = {};
          if (longText) widthStyle = {width: '100%'};

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={1}
              style={[styles.box, widthStyle, isFilled && styles.filledBox]}
              onPress={() => setEditingIndex(idx)}>
              {isEditing ? (
                <TextInput
                style={styles.input}
                value={val}
                onChangeText={text => handleTextChange(text.trim(), idx)}
                onBlur={finishEditing}
                autoFocus
                placeholder="Enter"
                placeholderTextColor="#aaa"
              />
              ) : isFilled ? (
                <Text
                  style={styles.hintText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {val.trim()}
                </Text>
              ) : (
                <MaterialCommunityIcons name="plus" size={24} color="#aaa" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingHorizontal: 2,
  },
  instruction: {
    width: '100%', // box ke upar full width le lega
    textAlign: 'center', // beech me aayega
    fontSize: 14,
    fontWeight:'600',
    color: '#ffff',
    textDecorationLine:'underline',
    marginBottom: 10,
  },

  legend: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    zIndex: 1,
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  box: {
    minHeight: 42,
    marginLeft: 9,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#bbb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  filledBox: {
    backgroundColor: '#e3eceb',
    borderStyle: 'solid',
    borderColor: '#f4efe9',
    marginRight: 8,
  },
  input: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
  hintText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
