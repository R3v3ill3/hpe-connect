import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}