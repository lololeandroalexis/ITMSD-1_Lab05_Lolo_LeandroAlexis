import React, { useState } from 'react';
import {
  Alert,
  Modal,
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

  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(() => {
    initDatabase();
    return db.getAllSync('SELECT * FROM products ORDER BY id DESC;');
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

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

  const openProductForm = (product = null) => {
    setEditingProduct(product);
    setName(product ? product.name : '');
    setCategory(product ? product.category : '');
    setPrice(product ? String(product.price) : '');
    setStock(product ? String(product.stock) : '');
    setModalVisible(true);
  };

  const closeProductForm = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const saveProduct = () => {
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (
      !trimmedName ||
      !trimmedCategory ||
      !price.trim() ||
      !stock.trim() ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      Alert.alert(
        'Invalid product',
        'Enter a name and category, a non-negative price, and a non-negative whole-number stock.'
      );
      return;
    }

    if (editingProduct) {
      db.runSync(
        'UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?;',
        [trimmedName, trimmedCategory, parsedPrice, parsedStock, editingProduct.id]
      );
    } else {
      db.runSync(
        'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);',
        [trimmedName, trimmedCategory, parsedPrice, parsedStock]
      );
    }

    closeProductForm();
    loadProducts(search);
  };

  const deleteProduct = (id, productName) => {
    Alert.alert('Delete product', `Remove ${productName} from the inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          db.runSync('DELETE FROM products WHERE id = ?;', [id]);
          loadProducts(search);
        },
      },
    ]);
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
        <Pressable
          style={styles.addButton}
          onPress={() => openProductForm()}
        >
          <Text style={styles.addButtonText}>+ Add product</Text>
        </Pressable>
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

              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => openProductForm(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteProduct(item.id, item.name)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </Pressable>
              </View>
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeProductForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Update product' : 'Add product'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Product name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="number-pad"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeProductForm}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveProduct}
              >
                <Text style={styles.modalButtonText}>
                  {editingProduct ? 'Update' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  addButton: {
    marginLeft: 'auto',
    backgroundColor: '#00758F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
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

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },

  actionButton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  editButton: {
    backgroundColor: '#00758F',
  },

  deleteButton: {
    backgroundColor: '#B42318',
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },

  modalTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },

  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  cancelButton: {
    backgroundColor: '#64748B',
  },

  saveButton: {
    backgroundColor: '#00758F',
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});