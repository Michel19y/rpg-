import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import styles from '../estilos/batalhas';

export default function TelaArenaBatalha({ route }) {
  const { inimigoId } = route.params || {};
  const userId = auth.currentUser?.uid;

  const [meusMonstros, setMeusMonstros] = useState([]);
  const [monstrosInimigos, setMonstrosInimigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolagens, setRolagens] = useState([]);
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
  const [rodadaAtual, setRodadaAtual] = useState(1);
  const [mensagemErro, setMensagemErro] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (mensagemErro) {
      const timer = setTimeout(() => setMensagemErro(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemErro]);

  async function carregarDados() {
    setLoading(true);
    try {
      if (!userId || !inimigoId) {
        setMensagemErro('Usuário ou inimigo não encontrado.');
        return;
      }

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
            hpAtual: data.hpAtual ?? data.hit_points ?? 10,
            atk: data.atk ?? (data.attack_bonus ?? 0) + Math.floor((data.hit_points ?? 10) / 4) + 2,
            def: data.def ?? data.armor_class ?? 10,
            actions: (data.actions || []).map(action => ({
              name: action.name || 'Ataque Básico',
              attack_bonus: action.attack_bonus ?? 0,
              damage_dice: action.damage?.[0]?.damage_dice || '1d6',
              damage_type: action.damage?.[0]?.damage_type?.name || 'Bludgeoning',
              desc: action.desc || '',
            })),
            attack_bonus: data.attack_bonus ?? 0,
            damage_dice: data.damage?.[0]?.damage_dice || '1d6',
            damage_type: data.damage?.[0]?.damage_type?.name || 'Bludgeoning',
            image: data.image || `https://www.dnd5eapi.co/api/images/monsters/${data.index || 'default'}.png`,
          };
        });

        const inimigos = snapInimigos.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            hpAtual: data.hpAtual ?? data.hit_points ?? 10,
            atk: data.atk ?? (data.attack_bonus ?? 0) + Math.floor((data.hit_points ?? 10) / 4) + 2,
            def: data.def ?? data.armor_class ?? 10,
            actions: (data.actions || []).map(action => ({
              name: action.name || 'Ataque Básico',
              attack_bonus: action.attack_bonus ?? 0,
              damage_dice: action.damage?.[0]?.damage_dice || '1d6',
              damage_type: action.damage?.[0]?.damage_type?.name || 'Bludgeoning',
              desc: action.desc || '',
            })),
            attack_bonus: data.attack_bonus ?? 0,
            damage_dice: data.damage?.[0]?.damage_dice || '1d6',
            damage_type: data.damage?.[0]?.damage_type?.name || 'Bludgeoning',
            image: data.image || `https://www.dnd5eapi.co/api/images/monsters/${data.index || 'default'}.png`,
          };
        });

        setMeusMonstros(meus.slice(0, 3));
        setMonstrosInimigos(inimigos.slice(0, 3));
      }
      setRolagens([]);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      setMensagemErro('Erro ao carregar monstros. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const RolagemDado = ({ dado, onComplete, tipo, atacante, acao }) => {
    const animation = useRef(null);
    const [valorFinal, setValorFinal] = useState(null);
    const [valorCalculado, setValorCalculado] = useState(null);

    useEffect(() => {
      const [numDados, resto] = dado.split('d');
      const [tipoDado, modificadorStr] = resto.includes('+') ? resto.split('+') : [resto, '0'];
      const modificador = parseInt(modificadorStr) || 0;
      const total = Array.from({ length: parseInt(numDados) || 1 }, () =>
        Math.floor(Math.random() * (parseInt(tipoDado) || 6)) + 1
      ).reduce((a, b) => a + b, 0) + modificador;
      setValorCalculado(total);
      animation.current?.play(0, 180);
    }, [dado]);

    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <LottieView
          ref={animation}
          source={require('../assets/json/dado.json')}
          style={{ width: 150, height: 150 }}
          loop={false}
          onAnimationFinish={() => {
            setValorFinal(valorCalculado);
            setRolagens(prev => [...prev, {
              id: `${Date.now()}-${Math.random()}`,
              rodada: rodadaAtual,
              tipo,
              dado,
              valor: valorCalculado,
              atacante,
              acao,
            }]);
            onComplete(valorCalculado);
          }}
        />
        {valorFinal !== null && (
          <Text style={{ color: '#b9f2ff', fontSize: 36, fontWeight: 'bold', marginTop: 10 }}>
            {valorFinal}
          </Text>
        )}
        <Text style={{ color: '#ccc', fontSize: 16, marginTop: 10 }}>
          Rolando {dado} ({tipo})...
        </Text>
      </View>
    );
  };

  function rolarDado(dado) {
    const [numDados, resto] = dado.split('d');
    const [tipoDado, modificadorStr] = resto.includes('+') ? resto.split('+') : [resto, '0'];
    const modificador = parseInt(modificadorStr) || 0;
    const total = Array.from({ length: parseInt(numDados) || 1 }, () =>
      Math.floor(Math.random() * (parseInt(tipoDado) || 6)) + 1
    ).reduce((a, b) => a + b, 0) + modificador;
    return total;
  }

  function ataqueAcerta(atk, def, bonus, d20Roll) {
    const modifiedRoll = (d20Roll || rolarDado('1d20')) + (bonus || 0);
    return { acerta: modifiedRoll >= (def || 10), d20Roll: d20Roll || rolarDado('1d20') };
  }

  function calcularDano(damageDice) {
    return rolarDado(damageDice || '1d6');
  }

  async function realizarAtaque(acao) {
    if (!selecionado || !alvoSelecionado || !acao || rodadaAtiva) {
      setMensagemErro(!alvoSelecionado ? 'Selecione um alvo antes de atacar!' : 'Aguarde a rodada atual terminar!');
      return;
    }

    setRodadaAtiva(true);
    setModalVisible(false);
    setAcaoSelecionada(acao.name);

    const atacante = meusMonstros.find(m => m.id === selecionado);
    const defensor = monstrosInimigos.find(m => m.id === alvoSelecionado);

    if (!atacante || !defensor || atacante.hpAtual <= 0 || defensor.hpAtual <= 0) {
      setMensagemErro('Seleção inválida ou monstro derrotado.');
      setRodadaAtiva(false);
      setAcaoSelecionada(null);
      return;
    }

    setRolandoAtaque(true);
    const d20Roll = await new Promise(resolve => {
      const onComplete = (valor) => {
        setRolandoAtaque(false);
        setD20Roll(valor);
        resolve(valor);
      };
      setTimeout(() => {
        if (rolandoAtaque) {
          const fallback = rolarDado('1d20');
          setD20Roll(fallback);
          setRolandoAtaque(false);
          resolve(fallback);
        }
      }, 2000);
    });

    const { acerta } = ataqueAcerta(atacante.atk, defensor.def, acao.attack_bonus || 0, d20Roll);

    if (acerta) {
      setRolandoDano(true);
      const dano = await new Promise(resolve => {
        const onComplete = (valor) => {
          setRolandoDano(false);
          setDanoRoll(valor);
          resolve(valor);
        };
        setTimeout(() => {
          if (rolandoDano) {
            const fallback = calcularDano(acao.damage_dice || '1d6');
            setDanoRoll(fallback);
            setRolandoDano(false);
            resolve(fallback);
          }
        }, 2000);
      });

      const novoHpDef = Math.max(defensor.hpAtual - dano, 0);
      setMonstrosInimigos(prev => prev.map(m => m.id === defensor.id ? { ...m, hpAtual: novoHpDef } : m));

      if (novoHpDef <= 0) {
        setMensagemErro(`${defensor.name} foi derrotado!`);
      }
    }

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
        const d20RollContra = await new Promise(resolve => {
          const onComplete = (valor) => {
            setRolandoAtaque(false);
            setD20Roll(valor);
            resolve(valor);
          };
          setTimeout(() => {
            if (rolandoAtaque) {
              const fallback = rolarDado('1d20');
              setD20Roll(fallback);
              setRolandoAtaque(false);
              resolve(fallback);
            }
          }, 2000);
        });

        const { acerta: acertaContra } = ataqueAcerta(contra.atk, alvo.def, acaoContra.attack_bonus || 0, d20RollContra);

        if (acertaContra) {
          setRolandoDano(true);
          const danoContra = await new Promise(resolve => {
            const onComplete = (valor) => {
              setRolandoDano(false);
              setDanoRoll(valor);
              resolve(valor);
            };
            setTimeout(() => {
              if (rolandoDano) {
                const fallback = calcularDano(acaoContra.damage_dice);
                setDanoRoll(fallback);
                setRolandoDano(false);
                resolve(fallback);
              }
            }, 2000);
          });

          const novoHpMeu = Math.max(alvo.hpAtual - danoContra, 0);
          setMeusMonstros(prev => prev.map(m => m.id === alvo.id ? { ...m, hpAtual: novoHpMeu } : m));

          if (novoHpMeu <= 0) {
            setMensagemErro(`${alvo.name} foi derrotado!`);
          }
        }
      }
    }

    setRodadaAtiva(false);
    setSelecionado(null);
    setAlvoSelecionado(null);
    setAcaoSelecionada(null);
    setRodadaAtual(prev => prev + 1);
  }

  const todosDerrotadosInimigos = monstrosInimigos.every(m => m.hpAtual <= 0);
  const todosDerrotadosMeus = meusMonstros.every(m => m.hpAtual <= 0);

  const ProgressBar = ({ hp, maxHp }) => {
    const progress = Math.max((hp || 0) / (maxHp || 1), 0);
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#555', borderRadius: 5, overflow: 'hidden', marginVertical: 5 }}>
        <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: 'red' }} />
      </View>
    );
  };

  const renderAcao = ({ item }) => {
    const renderAcaoIndividual = (acao, index) => (
      <TouchableOpacity
        key={`${acao.name || 'acao'}-${index}`}
        style={[styles.acaoButton, (!acao.damage_dice && !acao.damage?.[0]?.damage_dice) && styles.acaoButtonDisabled]}
        onPress={() => {
          if (!acao.name || (!acao.damage_dice && !acao.damage?.[0]?.damage_dice)) {
            setMensagemErro('Ação inválida. Escolha outra ação.');
            return;
          }
          setAcaoSelecionada(acao.name);
          realizarAtaque({
            name: acao.name,
            attack_bonus: acao.attack_bonus ?? 0,
            damage_dice: acao.damage?.[0]?.damage_dice || acao.damage_dice || '1d6',
            damage_type: acao.damage?.[0]?.damage_type?.name || acao.damage_type || 'Bludgeoning',
            desc: acao.desc || '',
          });
        }}
        disabled={rodadaAtiva || !alvoSelecionado || (!acao.damage_dice && !acao.damage?.[0]?.damage_dice)}
      >
        <View style={{ padding: 10 }}>
          <Text style={styles.acaoText}>
            {acao.name || 'Ação Desconhecida'} ({acao.damage?.[0]?.damage_dice || acao.damage_dice || '1d6'})
          </Text>
          {acao.desc && (
            <Text style={[styles.acaoText, { fontSize: 12, color: '#ccc', marginTop: 5 }]}>
              {acao.desc}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );

    if (Array.isArray(item.actions) && item.actions.length > 0) {
      return (
        <View style={{ marginVertical: 5 }}>
          <Text style={[styles.acaoText, { fontWeight: 'bold', color: '#b9f2ff' }]}>
            {item.name || 'Ação Combinada'}
          </Text>
          {item.desc && (
            <Text style={[styles.acaoText, { fontSize: 12, color: '#ccc', marginTop: 5, marginBottom: 5 }]}>
              {item.desc}
            </Text>
          )}
          {item.actions.map((subAction, index) => renderAcaoIndividual(subAction, index))}
        </View>
      );
    }

    return renderAcaoIndividual(item, 0);
  };

  const renderMonstro = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.hpAtual > 0) {
          setMonstroSelecionado(item);
          setSelecionado(item.id);
          setModalVisible(true);
        } else {
          setMensagemErro('Este monstro está derrotado!');
        }
      }}
      disabled={item.hpAtual <= 0}
    >
      <View style={[styles.card, selecionado === item.id && styles.selecionado, item.hpAtual <= 0 && styles.inimigoDesativado]}>
        <Image
          source={{ uri: item.image }}
          style={styles.img}
          onError={() => setMensagemErro('Erro ao carregar imagem do monstro.')}
        />
        <Text style={styles.nome}>{item.name || 'Monstro Desconhecido'}</Text>
        <Text style={styles.hp}>{item.hpAtual} / {item.hit_points || 10}</Text>
        <ProgressBar hp={item.hpAtual} maxHp={item.hit_points} />
        <Text style={styles.hp}>ATK: {item.atk || 0}</Text>
        <Text style={styles.hp}>CA: {item.def || 10}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderInimigo = ({ item }) => {
    const morto = item.hpAtual <= 0;
    return (
      <TouchableOpacity
        onPress={() => {
          if (!morto) {
            setAlvoSelecionado(item.id);
          } else {
            setMensagemErro('Este inimigo está derrotado!');
          }
        }}
        disabled={morto}
      >
        <View style={[styles.card, morto && styles.inimigoDesativado, alvoSelecionado === item.id && styles.alvo]}>
          <Image
            source={{ uri: item.image }}
            style={styles.img}
            onError={() => setMensagemErro('Erro ao carregar imagem do inimigo.')}
          />
          <Text style={styles.nome}>{item.name || 'Inimigo Desconhecido'}</Text>
          <Text style={styles.hp}>{item.hpAtual} / {item.hit_points || 10}</Text>
          <ProgressBar hp={item.hpAtual} maxHp={item.hit_points} />
          <Text style={styles.hp}>ATK: {item.atk || 0}</Text>
          <Text style={styles.hp}>CA: {item.def || 10}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRolagem = ({ item }) => (
    <Text style={{ color: '#b9f2ff', fontSize: 16, marginVertical: 5 }}>
      Rodada {item.rodada}: {item.atacante || 'Jogador'} rolou {item.dado} = {item.valor} ({item.tipo} - {item.acao || 'Ação'})
    </Text>
  );

  const renderConteudo = () => (
    <>
      <Text style={styles.title}><FontAwesome5 name="fort-awesome" size={20} color="#b9f2ff" /> Arena de Batalha</Text>
      {todosDerrotadosInimigos && (
        <Text style={styles.vitoria}><FontAwesome5 name="trophy" size={20} color="#00ff00" /> Você venceu!</Text>
      )}
      {todosDerrotadosMeus && (
        <Text style={styles.derrota}><FontAwesome5 name="skull" size={20} color="#ff3b3b" /> Você perdeu...</Text>
      )}
      {mensagemErro && (
        <View style={{
          backgroundColor: 'rgba(255, 59, 59, 0.8)',
          padding: 10,
          borderRadius: 5,
          marginVertical: 10,
          alignItems: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
            {mensagemErro}
          </Text>
        </View>
      )}

      <Text style={styles.subtitle}>Seus Monstros</Text>
      <FlatList
        horizontal
        data={meusMonstros}
        keyExtractor={(item) => item.id || `${Math.random()}`}
        renderItem={renderMonstro}
        style={{ marginVertical: 10 }}
        ListEmptyComponent={<Text style={styles.acaoText}>Nenhum monstro disponível</Text>}
      />

      <Text style={styles.subtitle}>Monstros Inimigos</Text>
      <FlatList
        horizontal
        data={monstrosInimigos}
        keyExtractor={(item) => item.id || `${Math.random()}`}
        renderItem={renderInimigo}
        style={{ marginVertical: 10 }}
        ListEmptyComponent={<Text style={styles.acaoText}>Nenhum inimigo disponível</Text>}
      />

      <View style={styles.mensagensContainer}>
        {rolandoAtaque && (
          <RolagemDado
            dado="1d20"
            onComplete={(valor) => setD20Roll(valor)}
            tipo="Ataque"
            atacante={meusMonstros.find(m => m.id === selecionado)?.name || 'Jogador'}
            acao={acaoSelecionada || 'Ataque'}
          />
        )}
        {rolandoDano && (
          <RolagemDado
            dado={acaoSelecionada
              ? (monstroSelecionado?.actions.find(a => a.name === acaoSelecionada)?.damage_dice || '1d6')
              : '1d6'}
            onComplete={(valor) => setDanoRoll(valor)}
            tipo="Dano"
            atacante={meusMonstros.find(m => m.id === selecionado)?.name || 'Jogador'}
            acao={acaoSelecionada || 'Dano'}
          />
        )}
        <Text style={{ color: '#b9f2ff', fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
          Rolagens
        </Text>
        <FlatList
          data={rolagens}
          keyExtractor={(item) => item.id}
          renderItem={renderRolagem}
          style={{ maxHeight: 150 }}
          ListEmptyComponent={<Text style={styles.acaoText}>Nenhuma rolagem realizada</Text>}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#b9f2ff" />
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={renderConteudo}
          keyExtractor={() => 'header'}
        />
      )}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setMonstroSelecionado(null);
          setSelecionado(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma Ação</Text>
            <FlatList
              data={monstroSelecionado?.actions || []}
              renderItem={renderAcao}
              keyExtractor={(item, index) => `${item.name || 'acao'}-${index}`}
              ListEmptyComponent={<Text style={styles.acaoText}>Nenhuma ação disponível</Text>}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setMonstroSelecionado(null);
                setSelecionado(null);
              }}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}