import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { AVATAR, C } from '../data';

export default function Profile() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Image source={AVATAR} style={s.av} />
        <Text style={s.h2}>Leandro Lolo</Text>
        <Text style={s.mut}>leandro@email.com • Sainz • Mapantad Street</Text>
        <View style={s.card}><Text style={s.b}>Visa •••• 2048</Text></View>
        <View style={s.card}><Text style={s.b}>1,240 pts rewards</Text></View>
        <View style={s.card}><Text style={s.b}>Order history (12)</Text></View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.screen },
  scroll: { padding: 16, gap: 10, alignItems: 'center' },
  av: { width: 76, height: 76, borderRadius: 38, borderWidth: 2, borderColor: '#fff' },
  h2: { fontSize: 19, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
  mut: { fontSize: 11, color: C.muted, fontFamily: 'Inter_400Regular' },
  card: { alignSelf: 'stretch', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14 },
  b: { fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter_700Bold' },
});
