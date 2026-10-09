import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { AppProvider } from '../store/AppState';

export default function RootLayout() {
  const [loaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });
  if (!loaded) return null;
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F7FBFB' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="discover" />
        <Stack.Screen name="restaurant" />
        <Stack.Screen name="inventory" />
        <Stack.Screen name="details" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="tracking" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="profile" />
      </Stack>
    </AppProvider>
  );
}
