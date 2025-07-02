import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { auth } from '../Firebase';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  deleteDoc
} from 'firebase/firestore';
import styles from '../estilos/welcome';
import { FontAwesome5 } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  const [monstros, setMonstros] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [monstrosSalvos, setMonstrosSalvos] = useState([]);

  // Modal erro antigo
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // Modal confirmação delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [monstroParaExcluir, setMonstroParaExcluir] = useState(null);

  const db = getFirestore();

  const exibirErro = (mensagem) => {
    setMensagemErro(mensagem);
    setModalErroVisible(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        exibirErro('Desvinculado Arcano. Saída Concluída.');
      } else {
        fetchMonstros();
        fetchMonstrosSalvos(user);
      }
    });
    return unsubscribe;
  }, []);

  const fetchMonstros = async () => {
    try {
      const res = await fetch('https://www.dnd5eapi.co/api/monsters');
      const data = await res.json();
      const monstrosComDetalhes = await Promise.all(
        data.results.slice(0, 20).map(async (monster) => {
          const resDetalhes = await fetch(`https://www.dnd5eapi.co${monster.url}`);
          const detalhes = await resDetalhes.json();
          return {
            index: monster.index,
            name: monster.name,
            hit_points: detalhes.hit_points || 0,
            armor_class: Array.isArray(detalhes.armor_class)
              ? detalhes.armor_class[0]?.value || 0
              : detalhes.armor_class || 0,
            main_action: detalhes.actions?.[0] || { name: 'Nenhuma ação', desc: '' }
          };
        })
      );
      setMonstros(monstrosComDetalhes);
    } catch (error) {
      exibirErro('Falha arcana ao carregar os monstros. Tente novamente mais tarde.');
    }
  };

  const fetchMonstrosSalvos = async (user) => {
    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      const monstrosQuery = query(collection(userDocRef, 'monsters'));
      const querySnapshot = await getDocs(monstrosQuery);
      const monstros = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMonstrosSalvos(monstros);
    } catch (error) {
      exibirErro('A biblioteca de invocações não pôde ser acessada.');
    }
  };

  const handleSelectMonster = (monster) => {
    if (selecionados.includes(monster.index)) {
      setSelecionados(selecionados.filter(index => index !== monster.index));
    } else if (selecionados.length < 3) {
      setSelecionados([...selecionados, monster.index]);
    } else {
      exibirErro('Você já possui 3 feras mágicas. Libere espaço para novas invocações.');
    }
  };

  const handleSaveMonsters = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    if (monstrosSalvos.length >= 3) {
      exibirErro('Já existem 3 monstros guardados. Elimine algum para prosseguir.');
      return;
    }
  
    const userDocRef = doc(db, 'usuarios', user.uid);
    const monstersRef = collection(userDocRef, 'monsters');
  
    const monstrosSelecionados = monstros.filter(m => selecionados.includes(m.index));
  
    for (let i = 0; i < monstrosSelecionados.length; i++) {
      const monster = monstrosSelecionados[i];
      // Cria o ID baseado no nome, em lowercase e sem espaços
      const novoID = monster.name.toLowerCase().replace(/\s+/g, '_');
  
      await setDoc(doc(monstersRef, novoID), {
        index: monster.index,
        name: monster.name,
        hit_points: monster.hit_points,
        armor_class: monster.armor_class,
        main_action: monster.main_action,
        userId: user.uid,
        timestamp: new Date()
      });
    }
  
    setSelecionados([]);
    await fetchMonstrosSalvos(user);
  };
  

  // Abrir modal para confirmar exclusão
  const abrirModalExcluir = (monstro) => {
    setMonstroParaExcluir(monstro);
    setModalDeleteVisible(true);
  };

  // Confirmar exclusão
  const confirmarExcluirMonstro = async () => {
    if (!monstroParaExcluir) return;

    const user = auth.currentUser;
    const userDocRef = doc(db, 'usuarios', user.uid);
    const monstroRef = doc(userDocRef, 'monsters', monstroParaExcluir.id);

    await deleteDoc(monstroRef);
    await fetchMonstrosSalvos(user);
    setModalDeleteVisible(false);
    setMonstroParaExcluir(null);
  };

  const renderMonster = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, selecionados.includes(item.index) && styles.cardSelecionado]}
      onPress={() => handleSelectMonster(item)}
    >
      <Image
        source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png` }}
        style={styles.imagem}
        resizeMode="contain"
      />
      <Text style={styles.nome}>{item.name}</Text>
      <Text style={styles.stat}>CA: {item.armor_class} | HP: {item.hit_points}</Text>
    </TouchableOpacity>
  );

  const renderSavedMonster = ({ item }) => (
    <View style={styles.cardSalvo}>
      <Image
        source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png` }}
        style={styles.imagemSalva}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.name}</Text>
        <Text style={styles.stat}>CA: {item.armor_class} | HP: {item.hit_points}</Text>
        <Text style={styles.desc}>{item.main_action?.name}: {item.main_action?.desc}</Text>
      </View>
      <TouchableOpacity onPress={() => abrirModalExcluir(item)}>
        <FontAwesome5 name="trash" size={20} color="#ff5555" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Escolha seus Monstros</Text>
      <FlatList
        data={monstros}
        renderItem={renderMonster}
        keyExtractor={(item) => item.index}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveMonsters}>
        <Text style={styles.botaoTexto}>SALVAR INVOCAÇÃO</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Invocações Atuais</Text>
      <FlatList
        data={monstrosSalvos}
        renderItem={renderSavedMonster}
        keyExtractor={(item) => item.id}
      />

      {/* Modal de erro antigo */}
      {modalErroVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invocação Interrompida</Text>
            <Text style={styles.modalMensagem}>{mensagemErro}</Text>
            <TouchableOpacity
              onPress={() => setModalErroVisible(false)}
              style={styles.modalBotao}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal de confirmação de exclusão */}
      {modalDeleteVisible && monstroParaExcluir && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exílio</Text>
            <Image
              source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${monstroParaExcluir.index}.png` }}
              style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 12 }}
              resizeMode="contain"
            />
            <Text style={[styles.modalMensagem, { fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }]}>
              Deseja exilar o {monstroParaExcluir.name}?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => setModalDeleteVisible(false)}
                style={[styles.modalBotao, { backgroundColor: '#555', flex: 1, marginRight: 10 }]}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmarExcluirMonstro}
                style={[styles.modalBotao, { backgroundColor: '#b22222', flex: 1 }]}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Exilar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
