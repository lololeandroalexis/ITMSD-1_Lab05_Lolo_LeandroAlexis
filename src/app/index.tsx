import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import { AVATAR, C, HOME_IMGS, RESTAURANTS, money } from '../data';
import { useApp } from '../store/AppState';

const CATS = [
  { name: 'Burgers', icon: '🍔' }, { name: 'Pizza', icon: '🍕' }, { name: 'Asian', icon: '🍜' },
  { name: 'Chicken', icon: '🍗' }, { name: 'Desserts', icon: '🍨' },
];

export default function Home() {
  const router = useRouter();
  const { subtotal, count } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Burgers');
  const list = RESTAURANTS.filter((r) =>
    (!q || (r.name + r.tags + r.cat).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <View style={s.rowBetween}>
            <View>
              <Text style={s.hello}>Good afternoon, Leandro</Text>
              <Text style={s.loc}>Deliver to Home ▾</Text>
            </View>
            <Image source={AVATAR} style={s.avatar} />
          </View>
          <View style={s.search}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput value={q} onChangeText={setQ} placeholder="Search for food or restaurants" placeholderTextColor={C.muted} style={s.input} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cats}>
            {CATS.map((c) => (
              <Pressable key={c.name} style={s.cat} onPress={() => setCat(c.name)}>
                <View style={[s.cico, cat === c.name && s.cicoOn]}><Text style={s.cicoT}>{c.icon}</Text></View>
                <Text style={[s.catT, cat === c.name && s.bold]}>{c.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={s.body}>
          <View style={s.rowBetween}>
            <Text style={s.h2}>Popular near you</Text>
            <Pressable onPress={() => router.push('/discover')}><Text style={s.link}>See all</Text></Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cards}>
            {list.map((r) => (
              <Pressable key={r.id} style={s.card} onPress={() => router.push('/restaurant')}>
                <Image source={HOME_IMGS[r.id] ?? r.img} style={s.cardImg} />
                <View style={s.cardInfo}>
                  <View style={s.rowBetween}><Text style={s.cardName}>{r.name}</Text><Text style={s.tiny}>★ {r.rating}</Text></View>
                  <Text style={s.mut}>{r.tags}</Text>
                  <Text style={s.teal}>{r.time} • {r.fee}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          {list.length === 0 && <Text style={s.mut}>No matches — try another search.</Text>}
        </View>
      </ScrollView>
      {subtotal > 0 && (
        <Pressable style={s.fab} onPress={() => router.push('/cart')}>
          <Text style={s.fabT}>View cart • {count} • {money(subtotal)}</Text>
        </Pressable>
      )}
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { paddingBottom: 12 },
  header: { backgroundColor: C.teal, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 15, gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hello: { fontSize: 12, color: C.darkMuted, fontFamily: 'Inter_400Regular' },
  loc: { fontSize: 20, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#fff' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 13, height: 46 },
  searchIcon: { fontSize: 15 },
  input: { flex: 1, fontSize: 13, color: C.ink, fontFamily: 'Inter_400Regular' },
  cats: { gap: 8 },
  cat: { alignItems: 'center', gap: 5, minWidth: 56 },
  cico: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  cicoOn: { backgroundColor: C.yellow, borderColor: C.yellow },
  cicoT: { fontSize: 20 },
  catT: { fontSize: 10, color: C.ink, fontFamily: 'Inter_500Medium' },
  bold: { fontWeight: '700', fontFamily: 'Inter_700Bold' },
  body: { padding: 15, gap: 12 },
  h2: { fontSize: 19, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  link: { fontSize: 12, fontWeight: '700', color: C.accent, fontFamily: 'Inter_700Bold' },
  cards: { gap: 10 },
  card: { width: 160, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#17414b', shadowOpacity: 0.09, shadowRadius: 8 },
  cardImg: { width: '100%', height: 100 },
  cardInfo: { padding: 10, gap: 3 },
  cardName: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  tiny: { fontSize: 10, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  mut: { fontSize: 10, color: C.muted, fontFamily: 'Inter_400Regular' },
  teal: { fontSize: 10, fontWeight: '600', color: C.accent, fontFamily: 'Inter_600SemiBold' },
  fab: { marginHorizontal: 11, marginBottom: 8, height: 48, borderRadius: 24, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  fabT: { color: '#fff', fontWeight: '800', fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
});
