import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { C, MENU_HEADER, money } from '../data';
import { useApp } from '../store/AppState';
import { db, initDatabase } from '../services/db';

const CHIPS = ['Popular', 'Burgers', 'Sides', 'Drinks', 'Desserts'];

export default function Restaurant() {
  const router = useRouter();
  const { addToCart, subtotal, count } = useApp();

  const [chip, setChip] = useState('Popular');
  const [liked, setLiked] = useState(false);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Burgers');
  const [newPrice, setNewPrice] = useState('12.90');
  const [newStock, setNewStock] = useState('10');

  const [products, setProducts] = useState<any[]>(() => {
    initDatabase();
    return db.getAllSync('SELECT * FROM products ORDER BY id DESC;');
  });

  const refreshProducts = (query = '') => {
    if (query.trim() === '') {
      setProducts(db.getAllSync('SELECT * FROM products ORDER BY id DESC;'));
      return;
    }

    setProducts(
      db.getAllSync('SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;', [`%${query}%`])
    );
  };

  const handleAddProduct = () => {
    if (!newName.trim() || !newCategory.trim() || !newPrice || !newStock) {
      Alert.alert('Validation Error', 'Please complete all fields before saving.');
      return;
    }

    db.runSync(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);',
      [newName.trim(), newCategory.trim(), Number(newPrice), Number(newStock)]
    );

    setNewName('');
    setNewCategory('Burgers');
    setNewPrice('12.90');
    setNewStock('10');
    setModalVisible(false);
    refreshProducts(search);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    Alert.alert('Delete product', `Remove ${name} from the database?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          db.runSync('DELETE FROM products WHERE id = ?;', [id]);
          refreshProducts(search);
        },
      },
    ]);
  };

  const handleAdjustStock = (id: number, delta: number) => {
    db.runSync('UPDATE products SET stock = stock + ? WHERE id = ?;', [delta, id]);
    refreshProducts(search);
  };

  const items =
    chip === 'Popular' || chip === 'Burgers'
      ? products
      : products.filter((item) => item.category === chip);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.hero}>
          <Image source={MENU_HEADER} style={s.heroImg} />

          <View style={s.scrim} />

          <Pressable
            style={[s.round, s.bl]}
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace('/')
            }
          >
            <Text style={s.ric}>‹</Text>
          </Pressable>

          <Pressable
            style={[s.round, s.br, liked && s.y]}
            onPress={() => setLiked(!liked)}
          >
            <Text style={s.ric}>
              {liked ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        <View style={s.sum}>
          <Text style={s.h2}>Urban Bites</Text>

          <Text style={s.mut}>
            Burgers • American • 4.8 ★
          </Text>

          <Text style={s.teal}>
            20–25 min &nbsp;&nbsp; $1.99 delivery
          </Text>
        </View>

        <View style={s.inventoryBox}>
          <TextInput
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              refreshProducts(text);
            }}
            placeholder="Search inventory by name"
            placeholderTextColor={C.muted}
            style={s.inventoryInput}
          />

          <Pressable style={s.addButton} onPress={() => setModalVisible(true)}>
            <Text style={s.addButtonText}>+ Add</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chips}
        >
          {CHIPS.map((c) => (
            <Pressable
              key={c}
              style={[
                s.chip,
                chip === c && s.chipOn,
              ]}
              onPress={() => setChip(c)}
            >
              <Text
                style={[
                  s.chipT,
                  chip === c && s.chipTOn,
                ]}
              >
                {c}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={s.body}>
          <Text style={s.b}>
            {chip === 'Popular' ? 'Popular' : chip}
          </Text>

          {items.map((item) => (
            <View key={item.id} style={s.card}>
              <View style={s.info}>
                <Text style={s.name}>
                  {item.name}
                </Text>

                <Text style={s.mut}>
                  {item.category}
                </Text>

                <Text style={s.stock}>
                  Stock: {item.stock}
                </Text>

                <View style={s.rowBetween}>
                  <Text style={s.name}>
                    {money(item.price)}
                  </Text>

                  <View style={s.adminActions}>
                    <Pressable
                      style={[s.smallButton, s.smallDelete]}
                      onPress={() => handleDeleteProduct(item.id, item.name)}
                    >
                      <Text style={s.smallButtonText}>Delete</Text>
                    </Pressable>

                    <Pressable
                      style={[s.smallButton, s.smallMute]}
                      onPress={() => handleAdjustStock(item.id, -1)}
                    >
                      <Text style={s.smallButtonText}>-</Text>
                    </Pressable>

                    <Pressable
                      style={[s.smallButton, s.smallAccent]}
                      onPress={() => handleAdjustStock(item.id, 1)}
                    >
                      <Text style={s.smallButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={s.cartRow}>
                  <Pressable
                    style={[s.round, s.y]}
                    onPress={() => {
                      if (item.id === 1) {
                        router.push('/details');
                      } else {
                        addToCart({
                          name: item.name,
                          sub: item.category,
                          price: item.price,
                          qty: 1,
                          img: require('../../assets/images/cart-burger.png'),
                        });
                      }
                    }}
                  >
                    <Text style={s.ric}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {items.length === 0 && (
            <Text style={s.mut}>
              Nothing in this category yet.
            </Text>
          )}
        </View>
      </ScrollView>

      {subtotal > 0 && (
        <Pressable
          style={s.fab}
          onPress={() => router.push('/cart')}
        >
          <Text style={s.fabT}>
            View cart • {count} • {money(subtotal)}
          </Text>
        </Pressable>
      )}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Add Inventory Item</Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Product name"
              style={s.modalInput}
            />

            <TextInput
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Category"
              style={s.modalInput}
            />

            <TextInput
              value={newPrice}
              onChangeText={setNewPrice}
              placeholder="Price"
              keyboardType="decimal-pad"
              style={s.modalInput}
            />

            <TextInput
              value={newStock}
              onChangeText={setNewStock}
              placeholder="Stock"
              keyboardType="number-pad"
              style={s.modalInput}
            />

            <View style={s.modalActions}>
              <Pressable style={[s.modalButton, s.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={s.modalButtonText}>Cancel</Text>
              </Pressable>

              <Pressable style={[s.modalButton, s.saveButton]} onPress={handleAddProduct}>
                <Text style={s.modalButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.screen,
  },

  scroll: {
    paddingBottom: 12,
  },

  hero: {
    height: 170,
  },

  heroImg: {
    width: '100%',
    height: '100%',
  },

  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16,42,54,0.44)',
  },

  round: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ric: {
    fontSize: 16,
    color: C.ink,
    fontWeight: '700',
  },

  y: {
    backgroundColor: C.yellow,
    borderColor: C.yellow,
  },

  bl: {
    position: 'absolute',
    top: 12,
    left: 12,
  },

  br: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  sum: {
    backgroundColor: '#fff',
    padding: 14,
    gap: 3,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: -14,
  },

  h2: {
    fontSize: 19,
    fontWeight: '700',
    color: C.ink,
    fontFamily: 'Inter_700Bold',
  },

  mut: {
    fontSize: 11,
    color: C.muted,
    fontFamily: 'Inter_400Regular',
  },

  teal: {
    fontSize: 11,
    fontWeight: '600',
    color: C.accent,
    fontFamily: 'Inter_600SemiBold',
  },

  chips: {
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  chip: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 30,
    justifyContent: 'center',
  },

  chipOn: {
    backgroundColor: C.ink,
    borderColor: C.ink,
  },

  chipT: {
    fontSize: 11,
    fontWeight: '600',
    color: C.darkMuted,
    fontFamily: 'Inter_600SemiBold',
  },

  chipTOn: {
    color: '#fff',
  },

  body: {
    paddingHorizontal: 12,
    gap: 8,
  },

  b: {
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
    fontFamily: 'Inter_700Bold',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    padding: 8,
    gap: 10,
  },

  info: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },

  name: {
    fontSize: 12,
    fontWeight: '700',
    color: C.ink,
    fontFamily: 'Inter_700Bold',
  },

  stock: {
    fontSize: 10,
    color: C.muted,
  },

  inventoryBox: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },

  inventoryInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 38,
    color: C.ink,
  },

  addButton: {
    backgroundColor: C.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  adminActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  smallButton: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallDelete: {
    backgroundColor: '#e74c3c',
  },

  smallMute: {
    backgroundColor: '#6c757d',
  },

  smallAccent: {
    backgroundColor: C.accent,
  },

  smallButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  cartRow: {
    marginTop: 6,
    alignItems: 'flex-end',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    gap: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.ink,
    fontFamily: 'Inter_700Bold',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    padding: 10,
    color: C.ink,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },

  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#6c757d',
  },

  saveButton: {
    backgroundColor: C.accent,
  },

  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },

  fab: {
    marginHorizontal: 11,
    marginBottom: 10,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabT: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
});