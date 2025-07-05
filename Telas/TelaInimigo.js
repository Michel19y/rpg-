import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { db } from '../Firebase';

export default function TelaSelecionarInimigo({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      const q = collection(db, 'usuarios');
      const snapshot = await getDocs(q);
      const lista = [];

      snapshot.forEach(doc => {
        lista.push({ id: doc.id, ...doc.data() });
      });

      setUsuarios(lista);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.inimigoButton}
      onPress={() => navigation.navigate('ArenaBatalha', { inimigoId: item.id })}
    >
      <Text style={styles.inimigoText}>{item.email || 'Sem email'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}><Text style={[styles.title, { fontFamily: 'MedievalSharp-Regular' }]}>


        <FontAwesome5 name="crosshairs" size={24} color="#b9f2ff" /> Escolha o Inimigo
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#999" />
      ) : (
        <FlatList
          data={usuarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 22, color: '#fff', marginBottom: 10 },
  inimigoButton: {
    backgroundColor: '#0f3460',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  inimigoText: { color: '#fff', fontSize: 16 },
});