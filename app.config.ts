import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WA HPE Connect',
  slug: 'wa-hpe-connect',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'wa-hpe-connect',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/Gemini_Generated_Image_vgqxgzvgqxgzvgqx.png',
    resizeMode: 'contain',
    backgroundColor: '#2563EB'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.wahpeconnect'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/Gemini_Generated_Image_vgqxgzvgqxgzvgqx.png',
      backgroundColor: '#2563EB'
    },
    package: 'com.wahpeconnect'
  },
  web: {
    favicon: './assets/images/Gemini_Generated_Image_vgqxgzvgqxgzvgqx.png'
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: 'your-project-id'
    }
  },
  plugins: [
    'expo-router',
    'expo-secure-store'
  ]
});