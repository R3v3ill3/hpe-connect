import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { SplashScreen } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show font loading error if any
  if (fontError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading fonts: {fontError.message}</Text>
        <Text style={styles.errorDetail}>{JSON.stringify(fontError, null, 2)}</Text>
      </View>
    );
  }

  // Return null while fonts are loading
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{
      headerTitleStyle: {
        fontFamily: 'Inter_700Bold',
      },
      headerBackTitleStyle: {
        fontFamily: 'Inter_400Regular',
      },
    }}>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }}
        component={require('./(tabs)/_layout').default}
      />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <NavigationContainer independent={true}>
      <AuthProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'left',
  },
});