import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const snapMeus = await getDocs(collection(db, 'usuarios', userId, 'monsters'));
      const snapInimigos = await getDocs(collection(db, 'usuarios', inimigoId, 'monsters'));

      const meus = [];
      snapMeus.forEach(doc => {
        const data = doc.data();
        meus.push({
          id: doc.id,
          ...data,
          hpAtual: data.hpAtual ?? data.hit_points,
          atk: data.atk ?? Math.floor(data.hit_points / 4) + 2, // 1/4 de hit_points + base 2
          def: data.def ?? data.armor_class, // Usa armor_class como defesa
          image: data.image || `https://www.dnd5eapi.co/api/images/monsters/${data.index}.png`,
        });
      });

      const inimigos = [];
      snapInimigos.forEach(doc => {
        const data = doc.data();
        inimigos.push({
          id: doc.id,
          ...data,
          hpAtual: data.hpAtual ?? data.hit_points,
          atk: data.atk ?? Math.floor(data.hit_points / 4) + 2, // 1/4 de hit_points + base 2
          def: data.def ?? data.armor_class, // Usa armor_class como defesa
          image: data.image || `https://www.dnd5eapi.co/api/images/monsters/${data.index}.png`,
        });
      });

      setMeusMonstros(meus.slice(0, 3));
      setMonstrosInimigos(inimigos.slice(0, 3));
      setMensagens([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function ataqueAcerta(atk, def) {
    const chance = 0.75 + (atk - def) * 0.05;
    return Math.random() < Math.min(Math.max(chance, 0.1), 0.95);
  }

  function calcularDano(atk, def) {
    const baseDano = atk - def;
    const variacao = Math.floor(Math.random() * 5) - 2;
    return Math.max(baseDano + variacao, 1);
  }

  async function realizarAtaque() {
    if (!selecionado || !alvoSelecionado || rodadaAtiva) return;

    setRodadaAtiva(true);
    setMensagens([]);

    const atacante = meusMonstros.find(m => m.id === selecionado);
    const defensor = monstrosInimigos.find(m => m.id === alvoSelecionado);

    if (!atacante || !defensor || atacante.hpAtual <= 0 || defensor.hpAtual <= 0) {
      setMensagens(['Seleção inválida ou monstro derrotado.']);
      setRodadaAtiva(false);
      return;
    }

    // dano atacante -> defensor
    const novoHpDef = ataqueAcerta(atacante.atk, defensor.def)
      ? Math.max(defensor.hpAtual - calcularDano(atacante.atk, defensor.def), 0)
      : defensor.hpAtual;

    if (novoHpDef !== defensor.hpAtual) {
      setMensagens(prev => [...prev, `${atacante.name} causou dano em ${defensor.name}`]);
    } else {
      setMensagens(prev => [...prev, `${atacante.name} errou o ataque!`]);
    }

    setMonstrosInimigos(prev => prev.map(m =>
      m.id === defensor.id ? { ...m, hpAtual: novoHpDef } : m
    ));

    if (novoHpDef <= 0) {
      setMensagens(prev => [...prev, `${defensor.name} foi derrotado!`]);
    }

    // contra-ataque
    const vivos = monstrosInimigos.filter(m => m.hpAtual > 0);
    const contra = vivos[Math.floor(Math.random() * vivos.length)];
    const alvo = meusMonstros[Math.floor(Math.random() * meusMonstros.length)];

    if (contra && alvo && alvo.hpAtual > 0) {
      const novoHpMeu = ataqueAcerta(contra.atk, alvo.def)
        ? Math.max(alvo.hpAtual - calcularDano(contra.atk, alvo.def), 0)
        : alvo.hpAtual;

      setMeusMonstros(prev => prev.map(m =>
        m.id === alvo.id ? { ...m, hpAtual: novoHpMeu } : m
      ));

      if (novoHpMeu !== alvo.hpAtual) {
        setMensagens(prev => [...prev, `${contra.name} contra-atacou ${alvo.name}`]);
      } else {
        setMensagens(prev => [...prev, `${contra.name} errou o contra-ataque!`]);
      }

      if (novoHpMeu <= 0) {
        setMensagens(prev => [...prev, `${alvo.name} foi derrotado!`]);
      }
    }

    setRodadaAtiva(false);
    setSelecionado(null);
    setAlvoSelecionado(null);
  }

  const todosDerrotadosInimigos = monstrosInimigos.every(m => m.hpAtual <= 0);
  const todosDerrotadosMeus = meusMonstros.every(m => m.hpAtual <= 0);

  const ProgressBar = ({ hp, maxHp }) => {
    const progress = Math.max(hp / maxHp, 0);
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#555', borderRadius: 5, overflow: 'hidden', marginVertical: 5 }}>
        <View style={{
          height: 23,
          width: `${progress * 100}%`,
          backgroundColor: 'red',
        }}>

          </View>
 
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Text style={styles.title}><FontAwesome5 name="fort-awesome" size={20} color="#b9f2ff" /> Arena de Batalha</Text>
{todosDerrotadosInimigos && <Text style={styles.vitoria}><FontAwesome5 name="trophy" size={20} color="#00ff00" /> Você venceu!</Text>}
{todosDerrotadosMeus && <Text style={styles.derrota}><FontAwesome5 name="skull" size={20} color="#ff3b3b" /> Você perdeu...</Text>}

        <Text style={styles.subtitle}>Seus Monstros</Text>
        <FlatList horizontal data={meusMonstros} keyExtractor={(item) => item.id} renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelecionado(item.id)} disabled={item.hpAtual <= 0}>
            <View style={[styles.card, selecionado === item.id && styles.selecionado]}>
              <Image source={{ uri: item.image }} style={styles.img} />
              <Text style={styles.nome}>{item.name}</Text>
              <Text style={styles.hp}>{item.hpAtual} / {item.hit_points}</Text>
              <ProgressBar hp={item.hpAtual} maxHp={item.hit_points} />
              <Text style={styles.hp}>ATK: {item.atk}</Text>
              <Text style={styles.hp}>DEF: {item.def}</Text>
            </View>
          </TouchableOpacity>
        )} />

        <Text style={styles.subtitle}>Monstros Inimigos</Text>
        <FlatList horizontal data={monstrosInimigos} keyExtractor={(item) => item.id} renderItem={({ item }) => {
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
                <Text style={styles.hp}>DEF: {item.def}</Text>
              </View>
            </TouchableOpacity>
          );
        }} />

        <TouchableOpacity
          style={[styles.attackButton, rodadaAtiva || todosDerrotadosInimigos ? { backgroundColor: '#444' } : {}]}
          onPress={realizarAtaque}
          disabled={rodadaAtiva || todosDerrotadosInimigos || !selecionado || !alvoSelecionado}
        >
          <Text style={styles.attackButtonText}>⚔️ Atacar</Text>
        </TouchableOpacity>

        <View style={styles.mensagensContainer}>
          {mensagens.map((msg, i) => (
            <Text key={i} style={styles.mensagem}>{msg}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

