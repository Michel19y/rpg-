import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Animated, Easing, TouchableOpacity, Text, Image, Dimensions, ActivityIndicator, TextInput, Modal } from 'react-native';
import { auth } from '../Firebase';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import styles from '../estilos/welcome';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

    const MonsterItem = ({ item, selecionados, handleSelectMonster, navigation }) => {
      const [imageLoaded, setImageLoaded] = useState(false);
    
      return (
        <TouchableOpacity
          style={[
            styles.card,
            selecionados.includes(item.index) && styles.cardSelecionado,
            { width: width * 0.6 },
          ]}
          onPress={() => handleSelectMonster(item)}
        >
          <View style={styles.imageContainer}>
            {!imageLoaded && (
              <ActivityIndicator
                size="large"
                color="purple"
                style={styles.loadingIndicator}
              />
            )}
            <Image
              source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png` }}
              style={styles.imagem}
              resizeMode="contain"
              onLoad={() => setImageLoaded(true)}
            />
          </View>
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
    };
const SavedMonsterItem = ({ item, navigation, abrirModalExcluir }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.cardSalvo}>
      {!imageLoaded && (
        <ActivityIndicator
          size="large"
          color="purple"
          style={styles.loadingIndicator}
        />
      )}
      <Image
        source={{ uri: `https://www.dnd5eapi.co/api/images/monsters/${item.index}.png` }}
        style={styles.imagemSalva}
        resizeMode="contain"
        onLoad={() => setImageLoaded(true)}
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
};

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
      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      const detalhados = await Promise.all(
        data.results.slice(0, 334 ).map(async (monster) => {
          try {
            const resD = await fetch(`https://www.dnd5eapi.co${monster.url}`);
            if (!resD.ok) {
              console.warn(`Falha ao buscar monstro ${monster.url}: ${resD.status}`);
              return null;
            }
            const det = await resD.json();
                return {
              index: det.index || '',
              name: det.name || 'Fera Desconhecida',
              hit_points: det.hit_points || 0,
              armor_class: Array.isArray(det.armor_class)
                ? det.armor_class[0]?.value || 0
                : det.armor_class || 0,
              size: det.size || '',
              type: det.type || '',
              subtype: det.subtype || '',
              alignment: det.alignment || '',
              hit_dice: det.hit_dice || '',
              hit_points_roll: det.hit_points_roll || '',
              speed: det.speed || {},
              strength: det.strength || 10,
              dexterity: det.dexterity || 10,
              constitution: det.constitution || 10,
              intelligence: det.intelligence || 10,
              wisdom: det.wisdom || 10,
              charisma: det.charisma || 10,
              proficiencies: Array.isArray(det.proficiencies) ? det.proficiencies : [],
              damage_vulnerabilities: Array.isArray(det.damage_vulnerabilities) ? det.damage_vulnerabilities : [],
              damage_resistances: Array.isArray(det.damage_resistances) ? det.damage_resistances : [],
              damage_immunities: Array.isArray(det.damage_immunities) ? det.damage_immunities : [],
              condition_immunities: Array.isArray(det.condition_immunities) ? det.condition_immunities : [],
              senses: det.senses || {},
              languages: det.languages || '',
              challenge_rating: det.challenge_rating || 0,
              proficiency_bonus: det.proficiency_bonus || 0,
              xp: det.xp || 0,
              actions: Array.isArray(det.actions) ? det.actions : [], // Garante que actions seja um array
              special_abilities: Array.isArray(det.special_abilities) ? det.special_abilities : [],
              reactions: Array.isArray(det.reactions) ? det.reactions : [],
              legendary_actions: Array.isArray(det.legendary_actions) ? det.legendary_actions : [],
            };
          } catch (error) {
            console.warn(`Erro ao buscar monstro ${monster.url}: ${error.message}`);
            return null;
          }
        })
      );
      const monstrosValidos = detalhados.filter(m => m !== null);
     setMonstros(monstrosValidos);
    } catch (error) {
      console.error('Erro ao carregar monstros:', error);
      exibirErro(`Falha arcana ao carregar os monstros: ${error.message}`);
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
    if (!user) {
      exibirErro('Nenhum necromante autenticado para invocar feras!');
      return;
    }
  
    const total = monstrosSalvos.length + selecionados.length;
    if (total > 3) {
      exibirErro(`O Círculo permite apenas 3 feras por necromante! Atualmente: ${monstrosSalvos.length} salvas, ${selecionados.length} novas.`);
      return;
    }
  
    if (selecionados.length === 0) {
      exibirErro('Nenhuma fera mágica foi escolhida para o ritual de invocação!');
      return;
    }
  
    const userRef = doc(db, 'usuarios', user.uid);
    const monstersRef = collection(userRef, 'monsters');
    const toSave = monstros.filter(m => selecionados.includes(m.index));
  
    try {
      await Promise.all(toSave.map(async (m) => {
        if (!m.index) {
          throw new Error(`Monstro sem índice: ${m.name || 'desconhecido'}`);
        }
  
        const nameKey = m.name
          ? m.name.toLowerCase().replace(/\s+/g, '_')
          : 'desconhecido';
        const timestampForId = new Date()
          .toISOString()
          .replace(/[:.]/g, '-');
        const customId = `${nameKey}_${timestampForId}`;
  
        const newMonsterRef = doc(monstersRef, customId);
  
        // Validação para garantir que os dados sejam serializáveis
        const monsterData = {
          index: m.index || '',
          name: m.name || 'Fera Desconhecida',
          nameKey,
          hit_points: m.hit_points || 10,
          armor_class: m.armor_class || 10,
          size: m.size || '',
          type: m.type || '',
          subtype: m.subtype || '',
          alignment: m.alignment || '',
          hit_dice: m.hit_dice || '',
          hit_points_roll: m.hit_points_roll || '',
          speed: m.speed || {},
          strength: m.strength || 10,
          dexterity: m.dexterity || 10,
          constitution: m.constitution || 10,
          intelligence: m.intelligence || 10,
          wisdom: m.wisdom || 10,
          charisma: m.charisma || 10,
          proficiencies: Array.isArray(m.proficiencies) ? m.proficiencies : [],
          damage_vulnerabilities: Array.isArray(m.damage_vulnerabilities) ? m.damage_vulnerabilities : [],
          damage_resistances: Array.isArray(m.damage_resistances) ? m.damage_resistances : [],
          damage_immunities: Array.isArray(m.damage_immunities) ? m.damage_immunities : [],
          condition_immunities: Array.isArray(m.condition_immunities) ? m.condition_immunities : [],
          senses: m.senses || {},
          languages: m.languages || '',
          challenge_rating: m.challenge_rating || 0,
          proficiency_bonus: m.proficiency_bonus || 0,
          xp: m.xp || 0,
          actions: Array.isArray(m.actions) ? m.actions : [],
          special_abilities: Array.isArray(m.special_abilities) ? m.special_abilities : [],
          reactions: Array.isArray(m.reactions) ? m.reactions : [],
          legendary_actions: Array.isArray(m.legendary_actions) ? m.legendary_actions : [],
          userId: user.uid,
          timestamp: new Date(),
        };
  
    
        // Serializar para garantir que não há dados inválidos
        try {
          JSON.stringify(monsterData); // Testa se os dados são serializáveis
        } catch (e) {
          throw new Error(`Dados inválidos para ${m.name}: ${e.message}`);
        }
  
        await setDoc(newMonsterRef, monsterData);
      }));
  
      setSelecionados([]);
      await fetchMonstrosSalvos(user);
      exibirErro('Feras mágicas invocadas com sucesso ao Círculo!', 'success');
    } catch (err) {
      console.error('Erro ao realizar o ritual de invocação:', err);
      exibirErro(`O ritual falhou! Detalhes: ${err.message}`);
    }
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

  if (carregando) {
    return (
      <View style={styles.containerCarregamento}>
        <LottieView
          source={require('../assets/json/vazio.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.textoCarregando}>Invocando bestiário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={monstrosSalvos}
        renderItem={({ item }) => (
          <SavedMonsterItem
            item={item}
            navigation={navigation}
            abrirModalExcluir={abrirModalExcluir}
          />
        )}
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
                renderItem={({ item }) => (
                  <MonsterItem
                    item={item}
                    selecionados={selecionados}
                    handleSelectMonster={handleSelectMonster}
                    navigation={navigation}
                  />
                )}
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
                <Text
                  style={{
                    color: '#aaa',
                    textAlign: 'center',
                    marginTop: 10,
                    fontStyle: 'italic',
                  }}
                >
                  nenhum monstro encontrado para "{termoBusca}".
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.botao} onPress={handleSaveMonsters}>
              <Text style={styles.botaoTexto}>SALVAR INVOCAÇÃO</Text>
            </TouchableOpacity>

            <Text style={styles.subtitulo}>
              Invocações Atuais {monstrosSalvos.length}/3
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30 }}>
            <LottieView
              source={require('../assets/json/vazio.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text style={{ color: '#b9f2ff', marginTop: 10, fontSize: 16 }}>
              Nenhuma invocação realizada — 0/3
            </Text>
          </View>
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