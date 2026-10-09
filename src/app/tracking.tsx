import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C, COURIER } from '../data';

const STEPS = ['Order confirmed', 'Preparing', 'Picked up', 'On the way', 'Delivered'];
const ETAS = ['12–18 min', '8–12 min', '4–7 min', 'Arriving now', 'Delivered'];

export default function Tracking() {
  const router = useRouter();
  const [step, setStep] = useState(3);
  useEffect(() => {
    if (step >= 4) return;
    const t = setTimeout(() => setStep((x) => Math.min(4, x + 1)), 20000);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.map}>
          <Pressable style={[s.round, s.bl]} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={s.ric}>‹</Text></Pressable>
          <View style={[s.street, s.v1]} /><View style={[s.street, s.v2]} /><View style={[s.street, s.h]} />
          <Text style={[s.mk, s.store]}>🏪</Text>
          <Text style={[s.mk, s.bike]}>🚲</Text>
          <Text style={[s.mk, s.home]}>⌂</Text>
        </View>
        <View style={s.body}>
          <Text style={s.h2}>Your order is on the way</Text>
          <Text style={s.mut}>Estimated arrival</Text>
          <Text style={s.eta}>{ETAS[step]}</Text>
          {STEPS.map((label, i) => (
            <View key={label} style={s.stepRow}>
              <View style={[s.dot, i < step && s.done, i === step && step < 4 && s.now]}>
                {i < step && <Text style={s.check}>✓</Text>}
              </View>
              <Text style={[s.stepT, i <= step && s.stepOn]}>{label}</Text>
            </View>
          ))}
          <Pressable onPress={() => setStep((x) => Math.min(4, x + 1))}>
            <Text style={s.link}>Simulate progress →</Text>
          </Pressable>
          <View style={s.card}>
            <Image source={COURIER} style={s.av} />
            <View style={s.grow}>
              <Text style={s.b}>Food Panda is delivering</Text>
              <Text style={s.mut}>4.9 ★ • 1,240 deliveries</Text>
            </View>
            <View style={[s.round, s.sm]}><Text>✉</Text></View>
            <View style={[s.round, s.sm, s.y]}><Text>☎</Text></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { paddingBottom: 16 },
  map: { height: 240, backgroundColor: C.softTeal, overflow: 'hidden' },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  sm: { width: 34, height: 34, borderRadius: 17 },
  ric: { fontSize: 16, color: C.ink, fontWeight: '700' },
  y: { backgroundColor: C.yellow, borderColor: C.yellow },
  bl: { position: 'absolute', top: 12, left: 12, zIndex: 2 },
  street: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999 },
  v1: { left: -57, top: -10, width: 110, height: 282 },
  v2: { right: -40, top: -15, width: 106, height: 281 },
  h: { left: -20, top: 120, width: 340, height: 87 },
  mk: { position: 'absolute', fontSize: 16, textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden' },
  store: { left: 39, top: 62, width: 34, height: 34, borderRadius: 17, backgroundColor: C.ink, lineHeight: 34 },
  bike: { left: 121, top: 109, width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', lineHeight: 42 },
  home: { left: 194, top: 160, width: 34, height: 34, borderRadius: 17, backgroundColor: C.yellow, lineHeight: 34 },
  body: { padding: 14, gap: 8 },
  h2: { fontSize: 18, fontWeight: '800', color: C.ink, fontFamily: 'Inter_800ExtraBold' },
  mut: { fontSize: 11, color: C.muted, fontFamily: 'Inter_400Regular' },
  eta: { fontSize: 24, fontWeight: '800', color: C.ink, fontFamily: 'Inter_800ExtraBold' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5 },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  done: { backgroundColor: C.yellow, borderColor: C.yellow },
  now: { backgroundColor: C.ink, borderWidth: 4, borderColor: C.yellow },
  check: { fontSize: 10, color: C.ink, fontWeight: '700' },
  stepT: { fontSize: 12, fontWeight: '600', color: C.muted, fontFamily: 'Inter_600SemiBold' },
  stepOn: { color: C.ink, fontWeight: '800' },
  link: { fontSize: 12, fontWeight: '700', color: C.accent, fontFamily: 'Inter_700Bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 10, gap: 10, alignItems: 'center' },
  av: { width: 44, height: 44, borderRadius: 22 },
  grow: { flex: 1 },
  b: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
});
