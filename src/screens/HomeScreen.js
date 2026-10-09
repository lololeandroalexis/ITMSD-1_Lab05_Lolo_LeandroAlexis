import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

import { db, initDatabase } from '../services/db';

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState(() => {
    initDatabase();
    return db.getAllSync('SELECT * FROM products ORDER BY id DESC;');
  });

  const [search, setSearch] = useState('');

  const loadProducts = (query = '') => {
    if (query.trim() === '') {
      const allRows = db.getAllSync(
        'SELECT * FROM products ORDER BY id DESC;'
      );

      setProducts(allRows);
    } else {
      const filtered = db.getAllSync(
        'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;',
        [`%${query}%`]
      );

      setProducts(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>Inventory</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          loadProducts(text);
        }}
      />

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={styles.info}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>

              <Text style={styles.category}>
                Category: {item.category}
              </Text>

              <Text style={styles.stock}>
                Stock: {item.stock} units
              </Text>
            </View>

            <Text style={styles.price}>
              ₱{item.price.toFixed(2)}
            </Text>

          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No products found.
          </Text>
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backText: {
    fontSize: 20,
    color: '#1E293B',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  searchBar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },

  info: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  category: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  stock: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00758F',
  },

  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 30,
  },
});