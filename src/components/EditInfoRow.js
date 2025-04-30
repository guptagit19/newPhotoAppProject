import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LONG_VALUE_THRESHOLD = 13;

const EditInfoRow = ({ icon, label, value, onChange, suffix, keyboardType = 'default' }) => {
  const [isEditing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const isLong = !isEditing && value?.length >= LONG_VALUE_THRESHOLD;

  const handleSave = () => {
    setEditing(false);
    onChange && onChange(tempValue);
  };

  // --- Render vertical "long" layout ---
  if (isLong) {
    return (
      <View style={[styles.container, styles.containerLong]}>
        <View style={styles.header}>
          {icon && <MaterialCommunityIcons name={icon} size={20} color="#555" />}
          <Text style={[styles.label, !icon && styles.noIconLabel]}>{label}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.body}>
          <Text style={styles.value}>{value}</Text>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Render default inline layout (short value) ---
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {icon && <MaterialCommunityIcons name={icon} size={20} color="#555" />}
        <Text style={[styles.label, !icon && styles.noIconLabel]}>{label}</Text>
      </View>

      {isEditing ? (
        <TextInput
          value={tempValue}
          onChangeText={setTempValue}
          onBlur={handleSave}
          autoFocus
          keyboardType={keyboardType}
          style={styles.input}
        />
      ) : (
        <View style={styles.right}>
          <Text style={styles.value} >
            {value}{suffix}
          </Text>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // common container
  container: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // override for long values
  containerLong: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  // top row for long layout
  header: {
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    alignSelf: 'stretch',
    marginVertical: 8,
  },

  // left side for inline layout
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
    marginRight: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    paddingHorizontal: 4,
    minWidth: 100,
    maxWidth: 150,
  },

  // bottom row for long layout & right side for inline
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '50%',
  },

  value: {
    marginLeft:9,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  editButton: {
    marginLeft: 8,
  },
});

export default EditInfoRow;
