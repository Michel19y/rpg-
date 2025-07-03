import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import styles from '../estilos/infos';

export default function InfosScreen({ route }) {
  const { index } = route.params;
  const [monstro, setMonstro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState({});
  const [limiteAtingido, setLimiteAtingido] = useState(false); // Limite atingido

  const traduzirTexto = async (texto, de = 'en', para = 'pt') => {
    if (limiteAtingido || texto.length >= 500) {
      return texto; // volta texto original sem aviso
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${de}|${para}`
      );
      const data = await response.json();

      // Verifica se a API retornou o aviso de limite
      if (
        data?.responseDetails?.includes('YOU HAVE REACHED THE MAXIMUM NUMBER OF REQUESTS PER DAY') ||
        data?.responseDetails?.includes('MYMEMORY WARNING')
      ) {
        setLimiteAtingido(true);
        return texto;
      }

      return data.responseData.translatedText || texto;
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      setLimiteAtingido(true);
      return texto;
    }
  };

  useEffect(() => {
    buscarMonstro();
  }, []);

  const buscarMonstro = async () => {
    try {
      const res = await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`);
      const data = await res.json();

      const monstroTraduzido = {
        ...data,
        name: await traduzirTexto(data.name),
        type: await traduzirTexto(data.type),
      };

      // Se o limite foi atingido até aqui, paramos de tentar traduzir o resto
      if (limiteAtingido) {
        monstroTraduzido.actions = data.actions || [];
        monstroTraduzido.special_abilities = data.special_abilities || [];
        monstroTraduzido.legendary_actions = data.legendary_actions || [];
      } else {
        monstroTraduzido.actions = data.actions?.length > 0
          ? await Promise.all(
              data.actions.map(async (acao) => ({
                ...acao,
                name: await traduzirTexto(acao.name),
                desc: await traduzirTexto(acao.desc || '')
              }))
            )
          : [];

        monstroTraduzido.special_abilities = data.special_abilities?.length > 0
          ? await Promise.all(
              data.special_abilities.map(async (hab) => ({
                ...hab,
                name: await traduzirTexto(hab.name),
                desc: await traduzirTexto(hab.desc || '')
              }))
            )
          : [];

        monstroTraduzido.legendary_actions = data.legendary_actions?.length > 0
          ? await Promise.all(
              data.legendary_actions.map(async (act) => ({
                ...act,
                name: await traduzirTexto(act.name),
                desc: await traduzirTexto(act.desc || '')
              }))
            )
          : [];
      }

      setMonstro(monstroTraduzido);
    } catch (error) {
      console.error('Erro ao buscar monstro:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandir = (tipo, idx) => {
    setExpandido((prev) => ({
      ...prev,
      [`${tipo}_${idx}`]: !prev[`${tipo}_${idx}`]
    }));
  };

  if (loading || !monstro) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b9f2ff" />
        <Text style={styles.loadingText}>Consultando os grimórios...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {limiteAtingido && (
        <Text style={[styles.loadingText, { color: '#ffa502', textAlign: 'center', marginBottom: 10 }]}>
          ⚠️ Linguagem arcana! Falta de mana para traduzir...
        </Text>
      )}

      <Text style={styles.nome} numberOfLines={2} ellipsizeMode="tail">{monstro.name}</Text>

      <Image
        source={{
          uri: `https://www.dnd5eapi.co/api/images/monsters/${monstro.index}.png`,
          defaultSource: require('../assets/fallback.png')
        }}
        style={styles.imagem}
        resizeMode="contain"
      />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialIcons name="security" size={20} color="#baffc9" />
          <Text style={styles.statText}>
            CA: {Array.isArray(monstro.armor_class) ? monstro.armor_class[0].value : monstro.armor_class}
          </Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="heart" size={18} color="#ff6b6b" />
          <Text style={styles.statText}>HP: {monstro.hit_points}</Text>
        </View>
        <View style={styles.statItem}>
          <Entypo name="mask" size={18} color="#a29bfe" />
          <Text style={styles.statText}>Tipo: {monstro.type}</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>🗡️ Ações</Text>
      {monstro.actions?.length > 0 ? (
        monstro.actions.map((acao, index) => (
          <View key={index} style={styles.bloco}>
            <Text style={styles.acaoNome} numberOfLines={2} ellipsizeMode="tail">{acao.name}</Text>
            {acao.desc && (
              <>
                <Text
                  style={styles.acaoDesc}
                  numberOfLines={expandido[`action_${index}`] ? undefined : 10}
                  ellipsizeMode="tail"
                >
                  {acao.desc}
                </Text>
                {acao.desc.length > 200 && (
                  <TouchableOpacity onPress={() => toggleExpandir('action', index)}>
                    <Text style={styles.verMais}>
                      {expandido[`action_${index}`] ? 'Ver Menos' : 'Ver Mais'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.acaoDesc}>Nenhuma ação disponível.</Text>
      )}

      {monstro.special_abilities?.length > 0 && (
        <>
          <Text style={styles.subtitulo}>🔮 Habilidades Especiais</Text>
          {monstro.special_abilities.map((hab, i) => (
            <View key={i} style={styles.bloco}>
              <Text style={styles.acaoNome} numberOfLines={2} ellipsizeMode="tail">{hab.name}</Text>
              <Text
                style={styles.acaoDesc}
                numberOfLines={expandido[`ability_${i}`] ? undefined : 10}
                ellipsizeMode="tail"
              >
                {hab.desc}
              </Text>
              {hab.desc.length > 200 && (
                <TouchableOpacity onPress={() => toggleExpandir('ability', i)}>
                  <Text style={styles.verMais}>
                    {expandido[`ability_${i}`] ? 'Ver Menos' : 'Ver Mais'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </>
      )}

      {monstro.legendary_actions?.length > 0 && (
        <>
          <Text style={styles.subtitulo}>👑 Ações Lendárias</Text>
          {monstro.legendary_actions.map((act, i) => (
            <View key={i} style={styles.bloco}>
              <Text style={styles.acaoNome} numberOfLines={2} ellipsizeMode="tail">{act.name}</Text>
              <Text
                style={styles.acaoDesc}
                numberOfLines={expandido[`legendary_${i}`] ? undefined : 10}
                ellipsizeMode="tail"
              >
                {act.desc}
              </Text>
              {act.desc.length > 200 && (
                <TouchableOpacity onPress={() => toggleExpandir('legendary', i)}>
                  <Text style={styles.verMais}>
                    {expandido[`legendary_${i}`] ? 'Ver Menos' : 'Ver Mais'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
