import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, Modal, Pressable,
  ImageBackground
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { db, auth } from '../Firebase';
import * as Animatable from 'react-native-animatable';

export default function TelaSelecionarInimigo({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUsuarioAtual(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const buscarInimigosComMonstros = async () => {
      if (!usuarioAtual) {
        setUsuarios([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'usuarios'));
        const todos = snap.docs
          .filter(d => d.id !== usuarioAtual.uid)
          .map(d => ({ id: d.id, ...d.data() }));

        const checks = todos.map(async u => {
          const mSnap = await getDocs(
            collection(db, 'usuarios', u.id, 'monsters')
          );
          return mSnap.size >= 1 ? u : null;
        });

        const results = await Promise.all(checks);
        const validos = results.filter(Boolean);
        setUsuarios(validos);
      } catch (err) {
        console.error('Erro ao buscar inimigos:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarInimigosComMonstros();
  }, [usuarioAtual]);

  const handleDesafio = async inimigoId => {
    const mySnap = await getDocs(
      collection(db, 'usuarios', usuarioAtual.uid, 'monsters')
    );
    if (mySnap.size >= 1) {
      setTimeout(() => {
        navigation.navigate('ArenaBatalha', { inimigoId });
      }, 800); // simula tempo da animação
    } else {
      setModalMensagem(
        'Você não invocou nenhum monstro ainda. ' +
        'Vá ao Círculo de Invocação para invocar antes de desafiar.'
      );
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={600} style={styles.pergaminhoLinha}>
      <TouchableOpacity
        onPress={() => handleDesafio(item.id)}
        style={styles.pergaminhoBotao}
      >
        <Text style={styles.pergaminhoTexto}>
          {item.nome?.toUpperCase() || 'INIMIGO DESCONHECIDO'}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <ImageBackground
      source={require('../assets/img/icon.png')}
      style={styles.container}
      
    >
      <Text style={[styles.title, { fontFamily: 'MedievalSharp-Regular' }]}>
        <FontAwesome5 name="crosshairs" size={24} color="#b9f2ff" /> Escolha o Inimigo
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#b9f2ff" />
      ) : (
        <FlatList
          data={usuarios}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.vazioTexto}>
              Nenhum inimigo disponível que tenha monstros invocados
            </Text>
          }
        />
      )}

      <Modal
        transparent animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMensagem}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Bem-vindo');
              }}
            >
              <Text style={styles.modalButtonText}>
                Ir ao Círculo de Invocação
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: '#555' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
    marginTop:50,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  pergaminhoLinha: {
    marginVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#d4af37',
    paddingHorizontal: 10,
  },
  pergaminhoBotao: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  pergaminhoTexto: {
    color: '#ffd700',
    fontSize: 18,
    fontFamily: 'MedievalSharp-Regular',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  vazioTexto: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'MedievalSharp-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1a001a',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: '#9400d3',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4b0082',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
});
