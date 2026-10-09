import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import { C, RESTAURANTS } from '../data';
import { useApp } from '../store/AppState';

const CHIPS = ['All', 'Fast delivery', 'Top rated'];

export default function Discover() {
  const router = useRouter();
  const { favs, toggleFav } = useApp();
  const [q, setQ] = useState('');
  const [chip, setChip] = useState('All');
  let list = RESTAURANTS.filter((r) => !q || (r.name + r.tags).toLowerCase().includes(q.toLowerCase()));
  if (chip === 'Fast delivery') list = list.filter((r) => parseInt(r.time) < 21);
  if (chip === 'Top rated') list = list.filter((r) => parseFloat(r.rating) >= 4.8);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Text style={s.title}>Discover restaurants</Text>
          <View style={s.search}>
            <Text>🔍</Text>
            <TextInput value={q} onChangeText={setQ} placeholder="Search restaurants" placeholderTextColor={C.muted} style={s.input} />
          </View>
          <View style={s.chips}>
            {CHIPS.map((c) => (
              <Pressable key={c} style={[s.chip, chip === c && s.chipOn]} onPress={() => setChip(c)}>
                <Text style={[s.chipT, chip === c && s.chipTOn]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={s.body}>
          <View style={s.rowBetween}><Text style={s.b}>24 nearby</Text><Text style={s.mut}>Recommended ▾</Text></View>
          {list.map((r) => (
            <Pressable key={r.id} style={s.card} onPress={() => router.push('/restaurant')}>
              <Image source={r.img} style={s.th} />
              <View style={s.info}>
                <View style={s.rowBetween}>
                  <Text style={s.name}>{r.name}</Text>
                  <Pressable onPress={() => toggleFav(r.id)}><Text style={s.heart}>{favs.has(r.id) ? '♥' : '♡'}</Text></Pressable>
                </View>
                <Text style={s.mut}>{r.tags}</Text>
                <Text style={s.mut}>★ {r.rating} &nbsp; {r.time}</Text>
                <Text style={s.teal}>{r.dist}</Text>
              </View>
            </Pressable>
          ))}
          {list.length === 0 && <Text style={s.mut}>No restaurants match.</Text>}
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { paddingBottom: 12 },
  header: { backgroundColor: C.teal, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12, gap: 10 },
  title: { fontSize: 19, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 13, height: 46 },
  input: { flex: 1, fontSize: 13, color: C.ink, fontFamily: 'Inter_400Regular' },
  chips: { flexDirection: 'row', gap: 6 },
  chip: { borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, height: 30, justifyContent: 'center' },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipT: { fontSize: 11, fontWeight: '600', color: C.darkMuted, fontFamily: 'Inter_600SemiBold' },
  chipTOn: { color: '#fff' },
  body: { padding: 12, gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  b: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  mut: { fontSize: 11, color: C.muted, fontFamily: 'Inter_400Regular' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 8, gap: 10 },
  th: { width: 76, height: 96, borderRadius: 12 },
  info: { flex: 1, gap: 2, justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  heart: { fontSize: 15, color: C.ink },
  teal: { fontSize: 11, fontWeight: '600', color: C.accent, fontFamily: 'Inter_600SemiBold' },
});
