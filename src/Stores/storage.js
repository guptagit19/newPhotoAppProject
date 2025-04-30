// storage.js
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user_profile',
  encryption: false,
});
