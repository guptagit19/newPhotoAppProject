import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import PhotoPicker from './PhotoPicker';
import ProfileMandFields from './ProfileMandFields';
import SocialMediaLinker from '../components/SocialMediaLinker';
import {SafeAreaView} from 'react-native';
import BreakerText from '../components/BreakerText';
import {storage} from '../Stores/storage';
import {Button} from 'react-native-elements';
import DynamicBoxGrid from '../components/DynamicBoxGrid';
import SubscriptionStatus from '../components/SubscriptionStatus';

const ProfileScreen = () => {
  // mirror every field in state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: '',
    trust: '',
    profileVerified: false,
    termsCondition: false,
    isBlocked: false,
    bio: '',
    university: '',
    graduatePlace: '',
    companyName: '',
    profession: '',
    height: '',
    currentLivingPlace: '',
    activeSubscription: [],
    socialMedia: {}, // now a map
    languages: [],
    natures: [],
    interests: [],
  });

  // load on mount
  useEffect(() => {
    const local = storage.getString('user_profile');
    if (local) {
      setProfile(JSON.parse(local));
    } else {
      // fetch from API
      fetch('http://192.168.0.159:8080/users/userByPhoneNumber/+9198754537611')
        .then(r => r.json())
        .then(json => {
          const data = json.data;
          const newProfile = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            age: String(data.age),
            gender: data.gender,
            trust: String(data.trust),
            profileVerified: data.profileVerified,
            termsCondition: data.termsCondition,
            isBlocked: data.isBlocked,
            bio: data.bio,
            university: data.university,
            graduatePlace: data.graduatePlace,
            companyName: data.companyName,
            profession: data.profession,
            height: String(data.height),
            currentLivingPlace: data.currentLivingPlace,
            activeSubscription: data.activeSubscription,
            socialMedia: data.socialMedia,
            languages: data.languages,
            natures: data.natures,
            interests: data.interests,
          };

          setProfile(newProfile); // Update screen state
          storage.set('user_profile', JSON.stringify(newProfile)); // Save newProfile directly
        })
        .catch(err => console.error(err));
    }
  }, []);

  // save & sync handler
  const handleSave = () => {
    // 1. persist locally
    storage.set('user_profile', JSON.stringify(profile));

    // 2. send to backend
    fetch('http://192.168.0.159:8080/users/updateSaveUser', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(profile),
    })
      .then(r => r.json())
      .then(json => {
        Alert.alert('Saved', json.message);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Unable to save to server');
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{padding: 20}}>
          <BreakerText text="😊 Profile Images" />
          <PhotoPicker />

          <SubscriptionStatus subscription={profile.activeSubscription} />

          <BreakerText text="Social Media" />
          <SocialMediaLinker
            value={profile.socialMedia}
            onChange={updatedLinks =>
              setProfile({...profile, socialMedia: updatedLinks})
            }
          />

          <ProfileMandFields
            values={profile}
            onChange={(field, val) =>
              setProfile({...profile, [field]: val.trim()})
            }
          />

          <DynamicBoxGrid
            label="🌐 Your Languages"
            boxCount={5}
            InstruText="Add the languages you know"
            value={profile.languages}
            onChange={langs => setProfile({...profile, languages: langs})}
          />

          <DynamicBoxGrid
            label="🔥 Your Interests"
            boxCount={9}
            InstruText="Add your Interests"
            value={profile.interests}
            onChange={ints => setProfile({...profile, interests: ints})}
          />

          <Button title="Save Profile" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
