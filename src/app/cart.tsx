import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C, money } from '../data';
import { useApp } from '../store/AppState';

export default function Cart() {
  const router = useRouter();
  const { cart, inc, dec, subtotal, count } = useApp();
  const [freeShip, setFreeShip] = useState(false);
  const fee = cart.length && !freeShip ? 1.99 : 0;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.head}>
          <Pressable style={s.round} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={s.ric}>‹</Text></Pressable>
          <Text style={s.h2}>Your cart</Text>
          <Text style={s.teal}>{count} {count === 1 ? 'item' : 'items'}</Text>
        </View>
        {cart.map((c) => (
          <View key={c.key} style={s.card}>
            <Image source={c.img} style={s.th} />
            <View style={s.info}>
              <Text style={s.name}>{c.name}</Text>
              <Text style={s.mut}>{c.sub}</Text>
              <View style={s.rowBetween}>
                <Text style={s.name}>{money(c.price)}</Text>
                <View style={s.qty}>
                  <Pressable style={s.round} onPress={() => dec(c.key)}><Text style={s.ric}>−</Text></Pressable>
                  <Text style={s.b}>{c.qty}</Text>
                  <Pressable style={[s.round, s.y]} onPress={() => inc(c.key)}><Text style={s.ric}>+</Text></Pressable>
                </View>
              </View>
            </View>
          </View>
        ))}
        {cart.length === 0 && <Text style={s.mut}>Cart is empty.</Text>}
        <View style={s.card}>
          <Text style={s.pin}>📍</Text>
          <View style={s.grow}><Text style={s.mut}>Deliver to</Text><Text style={s.b}>Home • 18 Willow Street</Text></View>
          <Text style={s.link}>Change</Text>
        </View>
        <Text style={s.b}>Delivery time</Text>
        <View style={s.chips}>
          <Pressable style={[s.chip, s.chipOn]}><Text style={[s.chipT, s.chipTOn]}>ASAP • 20–25 min</Text></Pressable>
          <Pressable style={s.chip}><Text style={s.chipT}>Schedule</Text></Pressable>
        </View>
        <View style={s.card}><Text style={s.pin}>💳</Text><Text style={[s.b, s.grow]}>Visa •••• 2048</Text><Text>›</Text></View>
        <View style={s.card}>
          <Text style={s.mut}>Promo code</Text>
          <Pressable onPress={() => setFreeShip(true)}><Text style={s.link}>{freeShip ? 'FREESHIP ✓' : 'Apply'}</Text></Pressable>
        </View>
        <View style={s.totals}>
          <View style={s.rowBetween}><Text style={s.mut}>Subtotal</Text><Text style={s.b}>{money(subtotal)}</Text></View>
          <View style={s.rowBetween}><Text style={s.mut}>Delivery fee</Text><Text style={s.b}>{money(fee)}</Text></View>
          <View style={s.div} />
          <View style={s.rowBetween}><Text style={s.total}>Total</Text><Text style={s.total}>{money(subtotal + fee)}</Text></View>
        </View>
      </ScrollView>
      <View style={s.cta}>
        <Pressable style={s.btn} onPress={() => cart.length && router.push('/tracking')}>
          <Text style={s.btnT}>Place Order &nbsp; {money(subtotal + fee)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { padding: 12, gap: 10, paddingBottom: 16 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h2: { fontSize: 19, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  teal: { fontSize: 12, fontWeight: '700', color: C.accent, fontFamily: 'Inter_700Bold' },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  ric: { fontSize: 16, color: C.ink, fontWeight: '700' },
  y: { backgroundColor: C.yellow, borderColor: C.yellow },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 10, gap: 10, alignItems: 'center' },
  th: { width: 62, height: 76, borderRadius: 11 },
  info: { flex: 1, gap: 3 },
  grow: { flex: 1 },
  name: { fontSize: 12, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  mut: { fontSize: 11, color: C.muted, fontFamily: 'Inter_400Regular' },
  b: { fontSize: 12, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pin: { fontSize: 18 },
  link: { fontSize: 11, fontWeight: '700', color: C.accent, fontFamily: 'Inter_700Bold' },
  chips: { flexDirection: 'row', gap: 6 },
  chip: { borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, height: 32, justifyContent: 'center' },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipT: { fontSize: 11, fontWeight: '600', color: C.darkMuted, fontFamily: 'Inter_600SemiBold' },
  chipTOn: { color: '#fff' },
  totals: { gap: 6, paddingVertical: 4 },
  div: { height: 1, backgroundColor: C.line },
  total: { fontSize: 14, fontWeight: '800', color: C.ink, fontFamily: 'Inter_800ExtraBold' },
  cta: { padding: 12, backgroundColor: C.screen },
  btn: { height: 48, borderRadius: 24, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  btnT: { fontWeight: '800', fontSize: 14, color: C.ink, fontFamily: 'Inter_800ExtraBold' },
});
