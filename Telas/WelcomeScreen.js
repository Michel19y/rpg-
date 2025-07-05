import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Animated, Easing, TouchableOpacity, Text, Image, Dimensions, ActivityIndicator, TextInput, Modal } from 'react-native';
import { auth } from '../Firebase';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import styles from '../estilos/welcome';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function WelcomeScreen({ navigation }) {
  const [monstros, setMonstros] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [monstrosSalvos, setMonstrosSalvos] = useState([]);
  const [modalErroVisible, setModalErroVisible] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [monstroParaExcluir, setMonstroParaExcluir] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const scrollX = useState(new Animated.Value(0))[0];
  const animacao = useState(new Animated.Value(1))[0];

  const db = getFirestore();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const monstrosFiltrados = monstros.filter(m =>
    normalize(m.name).includes(normalize(termoBusca))
  );

  useEffect(() => {
    let anim;
    if (termoBusca && monstrosFiltrados.length === 0) {
      rotateAnim.setValue(0);
      anim = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
      anim.start();
    } else {
      rotateAnim.stopAnimation();
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [termoBusca, monstrosFiltrados]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const [fontsLoaded] = useFonts({
    'MedievalSharp-Regular': require('../assets/fonts/MedievalSharp-Regular.ttf'),
  });

  const exibirErro = (mensagem) => {
    setMensagemErro(mensagem);
    setModalErroVisible(true);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animacao, {
          toValue: 1.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animacao, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

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
      const detalhados = await Promise.all(
        data.results.slice(0, 20000).map(async (monster) => {
          const resD = await fetch(`https://www.dnd5eapi.co${monster.url}`);
          const det = await resD.json();
          return {
            index: det.index,
            name: det.name,
            hit_points: det.hit_points || 0,
            armor_class: Array.isArray(det.armor_class)
              ? det.armor_class[0]?.value || 0
              : det.armor_class || 0,
            actions: det.actions || [],
            special_abilities: det.special_abilities || [],
          };
        })
      );
      setMonstros(detalhados);
    } catch {
      exibirErro('Falha arcana ao carregar os monstros.');
    } finally {
      setCarregando(false);
    }
  };

  const fetchMonstrosSalvos = async (user) => {
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const snap = await getDocs(collection(userRef, 'monsters'));
      const salvos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMonstrosSalvos(salvos);
    } catch {
      exibirErro('A biblioteca de invocações não pôde ser acessada.');
    }
  };

  const handleSelectMonster = (m) => {
    const jaSelecionado = selecionados.includes(m.index);
    if (jaSelecionado) {
      setSelecionados(selecionados.filter(i => i !== m.index));
    } else {
      const totalSelecionados = selecionados.length + monstrosSalvos.length;
      if (totalSelecionados >= 3) {
        exibirErro('Você já possui 3 feras mágicas. Libere espaço.');
        return;
      }
      setSelecionados([...selecionados, m.index]);
    }
  };

  const handleSaveMonsters = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const total = monstrosSalvos.length + selecionados.length;
    if (total > 3) {
      exibirErro(`Você só pode ter no máximo 3 feras. Atual: ${monstrosSalvos.length} salvos, ${selecionados.length} novos.`);
      return;
    }

    if (selecionados.length === 0) {
      exibirErro('Nenhuma fera mágica selecionada.');
      return;
    }

    const userRef = doc(db, 'usuarios', user.uid);
    const monstersRef = collection(userRef, 'monsters');
    const toSave = monstros.filter(m => selecionados.includes(m.index));

    for (let m of toSave) {
      const nameKey = m.name.toLowerCase().replace(/\s+/g, '_');
      const newMonsterRef = doc(monstersRef);
      await setDoc(newMonsterRef, {
        index: m.index,
        name: m.name,
        nameKey: nameKey,
        hit_points: m.hit_points,
        armor_class: m.armor_class,
        actions: m.actions || [],
        special_abilities: m.special_abilities || [],
        userId: user.uid,
        timestamp: new Date(),
      });
    }

    setSelecionados([]);
    await fetchMonstrosSalvos(user);
  };

  const abrirModalExcluir = (m) => {
    setMonstroParaExcluir(m);
    setModalDeleteVisible(true);
  };

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
      style={[
        styles.card,
        selecionados.includes(item.index) && styles.cardSelecionado,
        { width: width * 0.6 },
      ]}
      onPress={() => handleSelectMonster(item)}
    >
      <Image
        source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png` }}
        style={styles.imagem}
        resizeMode="contain"
      />
      <Text style={styles.nome} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.stat}>CA: {item.armor_class} | HP: {item.hit_points}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Infos', { index: item.index })}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        <FontAwesome5 name="eye" size={20} color="#b9f2ff" />
      </TouchableOpacity>
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
        <Text style={styles.desc} numberOfLines={2}>
          {item.actions?.[0]?.name || 'Sem ação'}: {item.actions?.[0]?.desc || 'Sem descrição'}
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Infos', { index: item.index })}>
          <FontAwesome5 name="eye" size={20} color="#b9f2ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => abrirModalExcluir(item)}>
          <FontAwesome5 name="trash" size={20} color="#ff5555" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.containerCarregamento}>
        <View style={styles.orbe}>
          <Animated.View style={[styles.luzOrbe, { transform: [{ scale: animacao }] }]} />
        </View>
        <Text style={styles.textoCarregando}>Invocando bestiário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={monstrosSalvos}
        renderItem={renderSavedMonster}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <>
            <TextInput
              placeholder=" Buscar Monstro..."
              placeholderTextColor="#999"
              value={termoBusca}
              onChangeText={setTermoBusca}
              style={styles.inputBusca}
            />
            <Text style={styles.titulo}>Escolha seus Monstros</Text>
            {monstrosFiltrados.length > 0 ? (
              <Animated.FlatList
                data={monstrosFiltrados}
                renderItem={renderMonster}
                keyExtractor={(item) => item.index}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
              />
            ) : (
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <FontAwesome5 name="dice-d20" size={32} color="#2a0891" solid />
                </Animated.View>
                <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 10, fontStyle: 'italic' }}>
                  nenhum monstro encontrado para "{termoBusca}".
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.botao} onPress={handleSaveMonsters}>
              <Text style={styles.botaoTexto}>SALVAR INVOCAÇÃO</Text>
            </TouchableOpacity>
            <Text style={styles.subtitulo}>Invocações Atuais</Text>
          </>
        }
      />
      <Modal visible={modalErroVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aviso Arcano</Text>
            <Text style={styles.modalMensagem}>{mensagemErro}</Text>
            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => setModalErroVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={modalDeleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmação de Exclusão</Text>
            <Text style={styles.modalMensagem}>
              {monstroParaExcluir ? `Deseja exilar o ${monstroParaExcluir.name}?` : 'Nenhum monstro selecionado.'}
            </Text>
            <TouchableOpacity
              style={[styles.modalBotao, { marginBottom: 10 }]}
              onPress={confirmarExcluirMonstro}
            >
              <Text style={{ color: '#fff' }}>Sim, Banir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => setModalDeleteVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}