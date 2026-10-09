import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C, DETAILS_HERO, money } from '../data';
import { useApp } from '../store/AppState';

const SIZES = [{ n: 'Single', p: 11.9 }, { n: 'Double', p: 12.9 }, { n: 'Triple', p: 14.9 }];
const ADDONS = [{ n: 'Extra cheese', p: 1.0 }, { n: 'Crispy bacon', p: 1.8 }, { n: 'Extra sauce', p: 0.5 }];

export default function Details() {
  const router = useRouter();
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(1);
  const [addons, setAddons] = useState<boolean[]>([true, false, false]);
  const [note, setNote] = useState('');
  const [liked, setLiked] = useState(false);
  const total = (SIZES[size].p + ADDONS.reduce((a, x, i) => a + (addons[i] ? x.p : 0), 0)) * qty;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.hero}>
          <Image source={DETAILS_HERO} style={s.heroImg} />
          <Pressable style={[s.round, s.bl]} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={s.ric}>‹</Text></Pressable>
          <Pressable style={[s.round, s.br, liked && s.y]} onPress={() => setLiked(!liked)}><Text style={s.ric}>{liked ? '♥' : '♡'}</Text></Pressable>
        </View>
        <View style={s.body}>
          <View style={s.rowBetween}><Text style={s.h2}>Classic Smash Burger</Text><Text style={s.price}>$12.90</Text></View>
          <Text style={s.mut}>Two crisp-edged beef patties, melted cheddar, house pickles and signature sauce on toasted brioche.</Text>
          <View style={s.rowBetween}>
            <Text style={s.b}>Quantity</Text>
            <View style={s.qty}>
              <Pressable style={s.round} onPress={() => setQty(Math.max(1, qty - 1))}><Text style={s.ric}>−</Text></Pressable>
              <Text style={s.b}>{qty}</Text>
              <Pressable style={[s.round, s.y]} onPress={() => setQty(qty + 1)}><Text style={s.ric}>+</Text></Pressable>
            </View>
          </View>
          <Text style={s.b}>Choose a size</Text>
          <View style={s.chips}>
            {SIZES.map((x, i) => (
              <Pressable key={x.n} style={[s.chip, size === i && s.chipOn]} onPress={() => setSize(i)}>
                <Text style={[s.chipT, size === i && s.chipTOn]}>{x.n}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.b}>Make it yours</Text>
          {ADDONS.map((a, i) => (
            <Pressable key={a.n} style={s.addon} onPress={() => setAddons(addons.map((v, j) => (j === i ? !v : v)))}>
              <Text style={s.addonT}>{addons[i] ? '☑' : '☐'} &nbsp;{a.n}</Text>
              <Text style={s.b}>+{money(a.p)}</Text>
            </Pressable>
          ))}
          <TextInput value={note} onChangeText={setNote} placeholder="Special instructions for the kitchen…" placeholderTextColor={C.muted} style={s.note} />
        </View>
      </ScrollView>
      <View style={s.cta}>
        <Pressable
          style={s.btn}
          onPress={() => {
            const names = ADDONS.filter((_, i) => addons[i]).map((a) => a.n.split(' ')[1]).join(' • ');
            addToCart({ name: 'Classic Smash Burger', sub: `${SIZES[size].n}${names ? ' • ' + names : ''}`, price: total / qty, qty, img: require('../../assets/images/cart-burger.png') });
            router.push('/cart');
          }}>
          <Text style={s.btnT}>Add to Cart &nbsp; {money(total)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { paddingBottom: 12 },
  hero: { height: 220 },
  heroImg: { width: '100%', height: '100%' },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  ric: { fontSize: 16, color: C.ink, fontWeight: '700' },
  y: { backgroundColor: C.yellow, borderColor: C.yellow },
  bl: { position: 'absolute', top: 12, left: 12 },
  br: { position: 'absolute', top: 12, right: 12 },
  body: { padding: 14, gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h2: { fontSize: 18, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold', flex: 1 },
  price: { fontSize: 16, fontWeight: '800', color: C.ink, fontFamily: 'Inter_800ExtraBold' },
  mut: { fontSize: 12, color: C.muted, fontFamily: 'Inter_400Regular', lineHeight: 17 },
  b: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chips: { flexDirection: 'row', gap: 6 },
  chip: { borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, height: 32, justifyContent: 'center' },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipT: { fontSize: 12, fontWeight: '600', color: C.darkMuted, fontFamily: 'Inter_600SemiBold' },
  chipTOn: { color: '#fff' },
  addon: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12 },
  addonT: { fontSize: 12, color: C.darkMuted, fontFamily: 'Inter_600SemiBold' },
  note: { borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, fontSize: 12, backgroundColor: '#fff', color: C.ink },
  cta: { padding: 12, backgroundColor: C.screen },
  btn: { height: 48, borderRadius: 24, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  btnT: { fontWeight: '800', fontSize: 14, color: C.ink, fontFamily: 'Inter_800ExtraBold' },
});
