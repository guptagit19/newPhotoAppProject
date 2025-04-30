/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PhotoPicker from './src/screens/PhotoPicker';
import AddBoxGrid from './src/components/DynamicBoxGrid';
import ProfileScreen from './src/screens/ProfileScreen';
import SocialMediaLinker from './src/components/SocialMediaLinker';
import ProfileScreen2 from './src/screens/ProfileScreen2';
import SubscriptionScreen from './src/screens/SubscriptionScreen';

AppRegistry.registerComponent(appName, () => ProfileScreen2);
