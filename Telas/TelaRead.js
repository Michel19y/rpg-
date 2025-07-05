import React, { useEffect, useState } from 'react';
import {View,Text,FlatList,Image,ActivityIndicator,TouchableOpacity,ScrollView,} from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import styles from '../estilos/read';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function TelaRead({ navigation }) {
  const [monstrosSalvos, setMonstrosSalvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donos, setDonos] = useState([]);
  const [donosSelecionados, setDonosSelecionados] = useState(new Set());

  useEffect(() => {
    read();
  }, []);

  const read = async () => {
    try {
      const q = query(collection(db, 'usuarios'));
      const querySnapshot = await getDocs(q);
      let todosMonstros = [];
      let listaDonos = new Set();

      for (const usuarioDoc of querySnapshot.docs) {
        const usuarioData = usuarioDoc.data();
        const email = usuarioData.email || 'Desconhecido';
        const subcolecaoRef = collection(usuarioDoc.ref, 'monsters');
        const snapshot = await getDocs(subcolecaoRef);

        snapshot.forEach((doc) => {
          const monstro = {
            id: doc.id,
            ...doc.data(),
            dono: email,
          };
          todosMonstros.push(monstro);
          listaDonos.add(email);
        });
      }

      setMonstrosSalvos(todosMonstros);
      setDonos(Array.from(listaDonos));
    } catch (error) {
      console.error('Erro ao ler monstros:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDono = (dono) => {
    const novosSelecionados = new Set(donosSelecionados);
    if (novosSelecionados.has(dono)) {
      novosSelecionados.delete(dono);
    } else {
      novosSelecionados.add(dono);
    }
    setDonosSelecionados(novosSelecionados);
  };

  const limparFiltro = () => {
    setDonosSelecionados(new Set());
  };

  const monstrosFiltrados =
    donosSelecionados.size > 0
      ? monstrosSalvos.filter((m) => donosSelecionados.has(m.dono))
      : monstrosSalvos;

  const renderSavedMonster = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png`,
        }}
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
          <Text style={styles.statText}>
            HP: {item.hit_points}{' '}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => navigation.navigate('Infos', { index: item.index })}
            >
              <FontAwesome5 name="eye" size={20} color="#b9f2ff" marginLeft="23" />
            </TouchableOpacity>
          </Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>
        <FontAwesome5 name="hand-rock" size={14} color="#a29bfe" /> Ação principal
      </Text>
      <Text style={styles.acao}>{item.main_action?.name || 'Sem ação'}</Text>
      <Text style={styles.desc}>{item.main_action?.desc || 'Sem descrição.'}</Text>

      <Text style={styles.donoText}>
        <FontAwesome5 name="user-alt" size={14} color="#b9f2ff" /> Dono: {item.dono}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <FontAwesome5 name="book" size={24} color="#b9f2ff" /> Invocações do Círculo
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b9f2ff" />
          <Text style={styles.loadingText}>Carregando grimório...</Text>
        </View>
      ) : monstrosSalvos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="ghost" size={48} color="#999" />
          <Text style={styles.emptyText}>Nenhum monstro foi invocado ainda...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          >
            {donos.map((dono) => (
              <TouchableOpacity
                key={dono}
                style={[
                  styles.filterButton,
                  donosSelecionados.has(dono) && styles.filterButtonSelected,
                ]}
                onPress={() => toggleDono(dono)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    donosSelecionados.has(dono) && styles.filterButtonTextSelected,
                  ]}
                >
                  {dono}
                </Text>
              </TouchableOpacity>
            ))}

            {donosSelecionados.size > 0 && (
              <TouchableOpacity
                style={[styles.filterButton, { backgroundColor: '#e74c3c' }]}
                onPress={limparFiltro}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Limpar</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <FlatList
            data={monstrosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderSavedMonster}
          />
        </>
      )}
    </View>
  );
}