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
import InfoRow from '../components/InfoRow';
import TrustRating from '../components/TrustRating';

const ProfileScreen2 = () => {
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
    college: '',
    graduatePlace: '',
    companyName: '',
    profession: '',
    height: '',
    currentLivingPlace: '',
    activeSubscription: null, // use null when no subscription
    socialMedia: {},
    languages: [],
    natures: [],
    interests: [],
  });

  // load on mount
  useEffect(() => {
    const local = storage.getString('user_profile');
    if (local) {
      // Step 1: Pehle MMKV se data load karlo
      setProfile(JSON.parse(local));
    }
    // Step 2: Fir background me fresh API call karo
    fetch('http://192.168.0.159:8080/users/userByPhoneNumber/+9198754537611')
      .then(r => r.json())
      .then(json => {
        const data = json.data;
        // if no activeSubscription or expired, set to null
        const subscription = data.activeSubscription
          ? data.activeSubscription
          : null;

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
          college: data.college,
          graduatePlace: data.graduatePlace,
          companyName: data.companyName,
          profession: data.profession,
          // height: String(data.height),
          height: data.height != null ? String(data.height) : '0',
          currentLivingPlace: data.currentLivingPlace,
          activeSubscription: subscription,
          socialMedia: data.socialMedia,
          languages: data.languages,
          natures: data.natures,
          interests: data.interests,
        };

        setProfile(newProfile);
        storage.set('user_profile', JSON.stringify(newProfile));
      })
      .catch(err => console.error(err));
  }, []);

  // save & sync handler
  const handleSave = () => {
    storage.set('user_profile', JSON.stringify(profile));

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

          <BreakerText text="📸 Profile Images" />
          <PhotoPicker />

          <BreakerText text="📦 Your Subscription:" />
          <SubscriptionStatus subscription={profile.activeSubscription} />

          <BreakerText text="🛡️ Your Trust:" />
          <TrustRating
            icon="tie"
            label="🤝 Your Trust"
            rating={2.5}
            max={5}
          />

          {/* Nature Section */}
          <BreakerText text="🌿 Your Natures:" />
          <View style={styles.wrapper}>
            <Text style={styles.natureText}>
              You will get Nature from your dating...
            </Text>
            {profile.natures &&
              profile.natures.map((item, index) => (
                <HintButton
                  key={index}
                  text={`✨ ${item}`}
                  onPress={() => {}}
                />
              ))}
          </View>

          <BreakerText text="🌐 Social Media" />
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

export default ProfileScreen2;

const styles = StyleSheet.create({
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
});
