import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import EditInfoRow from '../components/EditInfoRow';
import BreakerText from '../components/BreakerText';
import DynamicBoxGrid from '../components/DynamicBoxGrid';
import InfoRow from '../components/InfoRow';
import HintButton from '../components/HintButton';

const ProfileMandFields = ({values, onChange}) => {
  //if(values === null && !values) return(<View><Text>Null</Text></View>);
  return (
    <View style={styles.container}>


      {/* Basic Details */}
      <BreakerText text="💼 Basic Details" />
      <InfoRow
        label="👤 First Name"
        value={values.firstName}
        onChange={val => onChange('firstName', val.trim())}
      />
      <InfoRow
        label="👥 Last Name"
        value={values.lastName}
        onChange={val => onChange('lastName', val.trim())}
      />
      <InfoRow
        label="📧 Email"
        value={values.email}
        onChange={val => onChange('email', val.trim())}
      />
      <InfoRow
        label="📱 Phone Number"
        value={values.phoneNumber}
        onChange={val => onChange('phoneNumber', val.trim())}
      />
      <InfoRow
        label="🎂 Age"
        value={values.age}
        onChange={val => onChange('age', val.trim())}
      />
      <InfoRow
        label="⚥ Gender"
        value={values.gender}
        onChange={val => onChange('gender', val.trim())}
      />
      <InfoRow
        label="⭐ Trust"
        value={values.trust}
        onChange={val => onChange('trust', val.trim())}
      />
      <InfoRow
        label="🔒 Profile Verified"
        value={values.profileVerified}
        onChange={val => onChange('profileVerified', val.trim())}
      />
      <InfoRow
        label="✅ Terms Accepted"
        value={values.termsCondition}
        onChange={val => onChange('termsCondition', val.trim())}
      />

      {/* Bio Section */}
      <BreakerText text="📝 Your BIO" />
      <View style={styles.bioContainer}>
        <EditInfoRow
          label="🎓 University"
          value={values.university}
          onChange={val => onChange('university', val.trim())}
        />
        <EditInfoRow
          label="🏫 College"
          value={values.college}
          onChange={val => onChange('college', val.trim())}
        />

        <EditInfoRow
          label="🎓 Graduated From"
          value={values.graduatePlace}
          onChange={val => onChange('graduatePlace', val.trim())}
        />
        <EditInfoRow
          label="🏢 Company Name"
          value={values.companyName}
          onChange={val => onChange('companyName', val.trim())}
        />
        <EditInfoRow
          label="💼 Profession"
          value={values.profession}
          onChange={val => onChange('profession', val.trim())}
        />

        <EditInfoRow
          label="📏 Height"
          value={values.height} // raw number only
          suffix=" Inches" // display suffix
          keyboardType="numeric" // numeric keyboard
          onChange={val => onChange('height', val.trim())}
        />
        <EditInfoRow
          label="🏠 Current Living In"
          value={values.currentLivingPlace}
          onChange={val => onChange('currentLivingPlace', val.trim())}
        />
      </View>
    </View>
  );
};

export default ProfileMandFields;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    //backgroundColor: '#fff',
  },
  wrapper: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ddd',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 20,
  },
  natureText: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bioContainer: {
    marginTop: 0,
    //backgroundColor: '#e8f0fe',
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
});
