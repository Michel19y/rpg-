import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import styles from '../estilos/read'; // Certifique-se que esse caminho está certo
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function TelaRead() {
  const [monstrosSalvos, setMonstrosSalvos] = useState([]);
  const [loading, setLoading] = useState(true); // novo estado

  useEffect(() => {
    read();
  }, []);

  const read = async () => {
    try {
      const q = query(collection(db, 'usuarios'));
      const querySnapshot = await getDocs(q);
      let todosMonstros = [];

      querySnapshot.forEach((usuarioDoc) => {
        const subcolecao = collection(usuarioDoc.ref, 'monsters');
        todosMonstros.push(getDocs(subcolecao));
      });

      const snapshots = await Promise.all(todosMonstros);
      const monstros = snapshots.flatMap(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );

      setMonstrosSalvos(monstros);
    } catch (error) {
      console.error('Erro ao ler monstros:', error);
    } finally {
      setLoading(false); // encerra o carregamento
    }
  };

  const renderSavedMonster = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png` }}
        style={styles.imagem}
        resizeMode="contain"
      />
      <Text style={styles.nome}>{item.name}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialIcons name="security" size={20} color="#baffc9" />
          <Text style={styles.statText}>CA: {item.armor_class}</Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="heart" size={18} color="#ff6b6b" />
          <Text style={styles.statText}>HP: {item.hit_points}</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>
        <FontAwesome5 name="hand-rock" size={14} color="#a29bfe" /> Ação principal
      </Text>
      <Text style={styles.acao}>{item.main_action?.name || 'Sem ação'}</Text>
      <Text style={styles.desc}>{item.main_action?.desc || 'Sem descrição.'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Invocações do Círculo</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b9f2ff" />
          <Text style={styles.loadingText}>Carregando monstros do grimório...</Text>
        </View>
      ) : monstrosSalvos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="ghost" size={48} color="#999" />
          <Text style={styles.emptyText}>Nenhum monstro foi invocado ainda...</Text>
        </View>
      ) : (
        <FlatList
          data={monstrosSalvos}
          keyExtractor={(item) => item.id}
          renderItem={renderSavedMonster}
        />
      )}
    </View>
  );
}

