import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import { C, RESTAURANTS } from '../data';
import { useApp } from '../store/AppState';

export default function Favorites() {
  const router = useRouter();
  const { favs, toggleFav } = useApp();
  const list = RESTAURANTS.filter((r) => favs.has(r.id));
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.h2}>Favorites</Text>
        {list.map((r) => (
          <Pressable key={r.id} style={s.card} onPress={() => router.push('/restaurant')}>
            <Image source={r.img} style={s.th} />
            <View style={s.info}>
              <Text style={s.name}>{r.name}</Text>
              <Text style={s.mut}>{r.tags} • ★ {r.rating}</Text>
            </View>
            <Pressable onPress={() => toggleFav(r.id)}><Text style={s.heart}>♥</Text></Pressable>
          </Pressable>
        ))}
        {list.length === 0 && <Text style={s.mut}>Tap ♡ on any restaurant to save it here.</Text>}
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { padding: 14, gap: 10 },
  h2: { fontSize: 19, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 8, gap: 10, alignItems: 'center' },
  th: { width: 62, height: 76, borderRadius: 11 },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  mut: { fontSize: 11, color: C.muted, fontFamily: 'Inter_400Regular' },
  heart: { fontSize: 18, color: C.ink, paddingHorizontal: 6 },
});
