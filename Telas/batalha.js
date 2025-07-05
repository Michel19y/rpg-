import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import styles from '../estilos/batalhas';

export default function TelaArenaBatalha({ route }) {
  const { inimigoId } = route.params;
  const userId = auth.currentUser.uid;

  const [meusMonstros, setMeusMonstros] = useState([]);
  const [monstrosInimigos, setMonstrosInimigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagens, setMensagens] = useState([]);
  const [rodadaAtiva, setRodadaAtiva] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [alvoSelecionado, setAlvoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [monstroSelecionado, setMonstroSelecionado] = useState(null);
  const [acaoSelecionada, setAcaoSelecionada] = useState(null);

  const [rolandoAtaque, setRolandoAtaque] = useState(false);
  const [rolandoDano, setRolandoDano] = useState(false);
  const [d20Roll, setD20Roll] = useState(null);
  const [danoRoll, setDanoRoll] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const { monsters: meusMonstrosParam } = route.params || {};
      const { monsters: monstrosInimigosParam } = route.params || {};

      if (meusMonstrosParam && monstrosInimigosParam) {
        setMeusMonstros(meusMonstrosParam.slice(0, 3));
        setMonstrosInimigos(monstrosInimigosParam.slice(0, 3));
      } else {
        const snapMeus = await getDocs(collection(db, 'usuarios', userId, 'monsters'));
        const snapInimigos = await getDocs(collection(db, 'usuarios', inimigoId, 'monsters'));

        const meus = snapMeus.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            hpAtual: data.hpAtual ?? data.hit_points,
            atk: data.atk ?? (data.attack_bonus ?? 0) + Math.floor(data.hit_points / 4) + 2,
            def: data.def ?? data.armor_class,
            actions: data.actions || [],
            attack_bonus: data.attack_bonus ?? 0,
            damage_dice: data.damage?.[0]?.damage_dice || '1d6',
            damage_type: data.damage?.[0]?.damage_type?.name || 'Bludgeoning',
            image: data.image || `https://www.dnd5eapi.co/api/images/monsters/${data.index}.png`,
          };
        });

        const inimigos = snapInimigos.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            hpAtual: data.hpAtual ?? data.hit_points,
            atk: data.atk ?? (data.attack_bonus ?? 0) + Math.floor(data.hit_points / 4) + 2,
            def: data.def ?? data.armor_class,
            actions: data.actions || [],
            attack_bonus: data.attack_bonus ?? 0,
            damage_dice: data.damage?.[0]?.damage_dice || '1d6',
            damage_type: data.damage?.[0]?.damage_type?.name || 'Bludgeoning',
            image: data.image || `https://www.dnd5eapi.co/api/images/monsters/${data.index}.png`,
          };
        });

        setMeusMonstros(meus.slice(0, 3));
        setMonstrosInimigos(inimigos.slice(0, 3));
      }
      setMensagens([]);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  }
const RolagemDado = ({ dado, onComplete }) => {
  const animacao = useRef(new Animated.Value(0)).current;
  const [valorFinal, setValorFinal] = useState(null);
  const [rotacao, setRotacao] = useState('0deg');

  useEffect(() => {
    const novoValor = Math.floor(Math.random() * (parseInt(dado.split('d')[1]) || 20)) + 1;
    const novoAngulo = `${Math.floor(Math.random() * 360) + 360}deg`;

    Animated.timing(animacao, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setValorFinal(novoValor);
      setRotacao(novoAngulo);
      onComplete && onComplete(novoValor);
      animacao.setValue(0); // reset
    });
  }, [dado]);

  const rotateY = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', rotacao],
  });

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Animated.View style={{ transform: [{ rotateY }], backgroundColor: '#111', padding: 20, borderRadius: 10 }}>
        <Text style={{ fontSize: 48, color: '#fff', fontWeight: 'bold' }}>
          {valorFinal !== null ? valorFinal : '?'}
        </Text>
      </Animated.View>
      <Text style={{ color: '#ccc', fontSize: 16, marginTop: 10 }}>Rolando {dado}...</Text>
    </View>
  );
};


  function rolarDado(dado) {
    const [numDados, resto] = dado.split('d');
    const [tipoDado, modificadorStr] = resto.includes('+') ? resto.split('+') : [resto, '0'];
    const modificador = parseInt(modificadorStr) || 0;
    const total = Array.from({ length: parseInt(numDados) }, () => Math.floor(Math.random() * parseInt(tipoDado)) + 1)
      .reduce((a, b) => a + b, 0) + modificador;
    return total;
  }
  function ataqueAcerta(atk, def, bonus, d20Roll) {
    const modifiedRoll = (d20Roll || rolarDado('1d20')) + (bonus || 0);
    return { acerta: modifiedRoll >= def, d20Roll: d20Roll || rolarDado('1d20') };
  }

  function calcularDano(damageDice) {
    return rolarDado(damageDice || '1d6');
  }

  async function realizarAtaque(acao) {
    if (!selecionado || !alvoSelecionado || !acao || rodadaAtiva) {
      setMensagens(['Selecione um alvo antes de atacar!']);
      return;
    }

    setRodadaAtiva(true);
    setMensagens([]);
    setModalVisible(false);
    setAcaoSelecionada(acao); // Define a ação selecionada

    const atacante = meusMonstros.find(m => m.id === selecionado);
    const defensor = monstrosInimigos.find(m => m.id === alvoSelecionado);

    if (!atacante || !defensor || atacante.hpAtual <= 0 || defensor.hpAtual <= 0) {
      setMensagens(['Seleção inválida ou monstro derrotado.']);
      setRodadaAtiva(false);
      return;
    }

    // Animação do rolo de ataque
    setRolandoAtaque(true);
    setTimeout(() => {
      const { acerta, d20Roll } = ataqueAcerta(atacante.atk, defensor.def, acao.attack_bonus || 0);
      setD20Roll(d20Roll);
      setRolandoAtaque(false);

      if (acerta) {
        // Animação do rolo de dano
        setRolandoDano(true);
        setTimeout(() => {
          const dano = calcularDano(acao.damage_dice || acao.damage?.[0]?.damage_dice || '1d6');
          setDanoRoll(dano);
          const novoHpDef = Math.max(defensor.hpAtual - dano, 0);
          setMensagens(prev => [
            ...prev,
            `${atacante.name} usou ${acao.name} e causou ${dano} de dano (${acao.damage_type || acao.damage?.[0]?.damage_type?.name || 'desconhecido'}) em ${defensor.name} (D20: ${d20Roll})`,
          ]);
          setMonstrosInimigos(prev => prev.map(m => m.id === defensor.id ? { ...m, hpAtual: novoHpDef } : m));

          if (novoHpDef <= 0) {
            setMensagens(prev => [...prev, `${defensor.name} foi derrotado!`]);
          }
          setRolandoDano(false);
        }, 1000); // Duração da animação de dano
      } else {
        setMensagens(prev => [...prev, `${atacante.name} usou ${acao.name}, mas errou! (D20: ${d20Roll})`]);
      }

      // Contra-ataque
      const vivos = monstrosInimigos.filter(m => m.hpAtual > 0);
      if (vivos.length > 0 && !todosDerrotadosMeus) {
        const contra = vivos[Math.floor(Math.random() * vivos.length)];
        const acaoContra = contra.actions[Math.floor(Math.random() * contra.actions.length)] || {
          name: 'Ataque Básico',
          attack_bonus: contra.attack_bonus || 0,
          damage_dice: contra.damage_dice || '1d6',
          damage_type: contra.damage_type || 'Bludgeoning',
        };
        const alvo = meusMonstros.find(m => m.hpAtual > 0);

        if (alvo) {
          setRolandoAtaque(true);
          setTimeout(() => {
            const { acerta: acertaContra, d20Roll: d20RollContra } = ataqueAcerta(contra.atk, alvo.def, acaoContra.attack_bonus || 0);
            setD20Roll(d20RollContra);
            setRolandoAtaque(false);

            if (acertaContra) {
              setRolandoDano(true);
              setTimeout(() => {
                const danoContra = calcularDano(acaoContra.damage_dice);
                setDanoRoll(danoContra);
                const novoHpMeu = Math.max(alvo.hpAtual - danoContra, 0);
                setMensagens(prev => [
                  ...prev,
                  `${contra.name} usou ${acaoContra.name} e causou ${danoContra} de dano (${acaoContra.damage_type}) em ${alvo.name} (D20: ${d20RollContra})`,
                ]);
                setMeusMonstros(prev => prev.map(m => m.id === alvo.id ? { ...m, hpAtual: novoHpMeu } : m));

                if (novoHpMeu <= 0) {
                  setMensagens(prev => [...prev, `${alvo.name} foi derrotado!`]);
                }
                setRolandoDano(false);
              }, 1000);
            } else {
              setMensagens(prev => [...prev, `${contra.name} usou ${acaoContra.name}, mas errou! (D20: ${d20RollContra})`]);
            }
          }, 1000); // Duração da animação de ataque do inimigo
        }
      }

      setRodadaAtiva(false);
      setSelecionado(null);
      setAlvoSelecionado(null);
      setAcaoSelecionada(null); // Limpa a ação selecionada após a rodada
    }, 1000); // Duração da animação de ataque
  }

  const todosDerrotadosInimigos = monstrosInimigos.every(m => m.hpAtual <= 0);
  const todosDerrotadosMeus = meusMonstros.every(m => m.hpAtual <= 0);

  const ProgressBar = ({ hp, maxHp }) => {
    const progress = Math.max(hp / maxHp, 0);
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#555', borderRadius: 5, overflow: 'hidden', marginVertical: 5 }}>
        <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: 'red' }} />
      </View>
    );
  };

  const renderAcao = ({ item }) => (
    <TouchableOpacity
      style={styles.acaoButton}
      onPress={() => {
        setAcaoSelecionada(item.name); // Define a ação selecionada
        realizarAtaque(item);
      }}
      disabled={rodadaAtiva || !alvoSelecionado}
    >
      <Text style={styles.acaoText}>{item.name} ({item.damage_dice || item.damage?.[0]?.damage_dice || '1d6'})</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}><FontAwesome5 name="fort-awesome" size={20} color="#b9f2ff" /> Arena de Batalha</Text>
        {todosDerrotadosInimigos && <Text style={styles.vitoria}><FontAwesome5 name="trophy" size={20} color="#00ff00" /> Você venceu!</Text>}
        {todosDerrotadosMeus && <Text style={styles.derrota}><FontAwesome5 name="skull" size={20} color="#ff3b3b" /> Você perdeu...</Text>}

        <Text style={styles.subtitle}>Seus Monstros</Text>
        <FlatList
          horizontal
          data={meusMonstros}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.hpAtual > 0) {
                  setMonstroSelecionado(item);
                  setSelecionado(item.id);
                  setModalVisible(true);
                }
              }}
              disabled={item.hpAtual <= 0}
            >
              <View style={[styles.card, selecionado === item.id && styles.selecionado]}>
                <Image source={{ uri: item.image }} style={styles.img} />
                <Text style={styles.nome}>{item.name}</Text>
                <Text style={styles.hp}>{item.hpAtual} / {item.hit_points}</Text>
                <ProgressBar hp={item.hpAtual} maxHp={item.hit_points} />
                <Text style={styles.hp}>ATK: {item.atk}</Text>
                <Text style={styles.hp}>CA: {item.def}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.subtitle}>Monstros Inimigos</Text>
        <FlatList
          horizontal
          data={monstrosInimigos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const morto = item.hpAtual <= 0;
            return (
              <TouchableOpacity
                onPress={() => !morto && setAlvoSelecionado(item.id)}
                disabled={morto}
              >
                <View style={[
                  styles.card,
                  morto && styles.inimigoDesativado,
                  alvoSelecionado === item.id && styles.alvo
                ]}>
                  <Image source={{ uri: item.image }} style={styles.img} />
                  <Text style={styles.nome}>{item.name}</Text>
                  <Text style={styles.hp}>{item.hpAtual} / {item.hit_points}</Text>
                  <ProgressBar hp={item.hpAtual} maxHp={item.hit_points} />
                  <Text style={styles.hp}>ATK: {item.atk}</Text>
                  <Text style={styles.hp}>CA: {item.def}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.mensagensContainer}>
          {mensagens.map((msg, i) => (
            <Text key={i} style={styles.mensagem}>{msg}</Text>
          ))}
          {rolandoAtaque && <RolagemDado dado="1d20" onComplete={setD20Roll} />}
          {rolandoDano && <RolagemDado dado={danoRoll ? '1d6' : (monstroSelecionado?.actions.find(a => a.name === acaoSelecionada)?.damage_dice || '1d6')} onComplete={setDanoRoll} />}
        </View>

        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escolha uma Ação</Text>
              <FlatList
                data={monstroSelecionado?.actions || []}
                renderItem={renderAcao}
                keyExtractor={(item) => item.name}
                ListEmptyComponent={<Text style={styles.acaoText}>Nenhuma ação disponível</Text>}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

