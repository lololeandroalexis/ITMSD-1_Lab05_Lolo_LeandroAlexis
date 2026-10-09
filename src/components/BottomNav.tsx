import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../data';

const TABS = [
  { route: '/', icon: '⌂', label: 'Home' },
  { route: '/discover', icon: '🔍', label: 'Search' },
  { route: '/inventory', icon: '🗃', label: 'Inventory' },
  { route: '/tracking', icon: '🧾', label: 'Orders' },
  { route: '/favorites', icon: '♡', label: 'Favorites' },
  { route: '/profile', icon: '👤', label: 'Profile' },
] as const;

export default function BottomNav() {
  const router = useRouter();
  const segments = useSegments();
  const current = '/' + (segments as string[]).join('/');
  return (
    <SafeAreaView edges={['bottom']} style={s.wrap}>
      <View style={s.bar}>
        {TABS.map((t) => {
          const on = current === t.route || (t.route === '/' && current === '/index');
          return (
            <Pressable key={t.route} style={s.tab} onPress={() => router.replace(t.route as any)}>
              <Text style={[s.icon, on && s.on]}>{t.icon}</Text>
              <Text style={[s.label, on && s.on]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line },
  bar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 8, height: 62 },
  tab: { alignItems: 'center', gap: 3, minWidth: 56 },
  icon: { fontSize: 16, color: C.muted },
  label: { fontSize: 10, fontWeight: '500', color: C.muted, fontFamily: 'Inter_500Medium' },
  on: { color: C.ink, fontWeight: '700' },
});
