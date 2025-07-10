import React, { useState } from 'react';
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

import styles from '../estilos/sobre'; // Caminho correto do estilo
import { useMusic } from '../context/MusicContext'; // Certifique-se que o caminho está correto

export default function SobreScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { isPlaying, toggleMusic, volume, setMusicVolume } = useMusic();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => setModalVisible(false))
      .catch((error) => console.error('Erro ao sair:', error));
  };

  return (
    <View style={{ flex: 1 }}>
   
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          zIndex: 10,
          backgroundColor: '#1a001a',
          padding: 10,
          borderRadius: 30,
          shadowColor: '#9400d3',
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <MaterialIcons name="settings" size={24} color="#e0b3ff" />
      </TouchableOpacity>

      
      <ScrollView style={styles.container} nestedScrollEnabled={true}>
        <View style={styles.card}>
          <Text style={styles.title}>Sobre o Projeto: RPG Codex</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.highlight}>RPG Codex</Text> é um aplicativo mobile de batalhas
            inspirado no universo de <Text style={{ fontWeight: 'bold' }}>Dungeons & Dragons</Text>.
            Criado como trabalho final para o curso técnico, o projeto simula uma arena onde o
            jogador enfrenta criaturas mágicas e controla magias com base em dados reais da{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://www.dnd5eapi.co/')}
            >
              API D&D 5e
            </Text>.
          </Text>

          <Text style={styles.section}>Funcionalidades</Text>
          <Text style={styles.paragraph}>• Cadastro e login com Firebase</Text>
          <Text style={styles.paragraph}>• Escolha de classe e raça</Text>
          <Text style={styles.paragraph}>• Dashboard com magias</Text>
          <Text style={styles.paragraph}>• Batalhas com monstros da API D&D</Text>
          <Text style={styles.paragraph}>• Ataques com dados reais</Text>
          <Text style={styles.paragraph}>• Estilo necromante e dark fantasy</Text>

          <Text style={styles.section}>Tecnologias Utilizadas</Text>
          <Text style={styles.paragraph}>• React Native + Expo</Text>
          <Text style={styles.paragraph}>• Firebase Authentication e Firestore</Text>
          <Text style={styles.paragraph}>• API pública D&D 5e</Text>
          <Text style={styles.paragraph}>• React para navegação</Text>

          <Text style={styles.section}>Objetivo</Text>
          <Text style={styles.paragraph}>
            Aplicar conhecimentos de mobile com APIs e nuvem, em um app temático de fantasia sombria.
          </Text>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Desenvolvido por Michel • IFSC Lages - 2025
            </Text>
            <View style={styles.icons}>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://github.com/Michel19y')}
              >
                <FontAwesome name="github" size={24} color="#b9f2ff" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.linkedin.com/in/jean-michel-5a6703360')}
              >
                <FontAwesome name="linkedin" size={24} color="#b9f2ff" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.instagram.com/__michelwr')}
              >
                <FontAwesome name="instagram" size={24} color="#b9f2ff" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

    
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#1a001a',
              borderRadius: 15,
              padding: 25,
              width: '80%',
              borderWidth: 1,
              borderColor: '#9400d3',
              shadowColor: '#9400d3',
              shadowOpacity: 0.9,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <MaterialIcons name="music-note" size={40} color="#e0b3ff" />
            </View>

         
            <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 10 }}>
              Música: {isPlaying ? 'Tocando 🎵' : 'Pausada 🔇'}
            </Text>

            <Pressable
              onPress={toggleMusic}
              style={{
                backgroundColor: '#4b0082',
                paddingVertical: 10,
                marginBottom: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {isPlaying ? 'Pausar Música' : 'Tocar Música'}
              </Text>
            </Pressable>

            {/* Controle de volume */}
            <Text style={{ color: '#fff', marginBottom: 5, textAlign: 'center' }}>
              Volume
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setMusicVolume}
              minimumTrackTintColor="#b9f2ff"
              maximumTrackTintColor="#fff"
            />

            
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 }}>
              <Pressable
                onPress={handleLogout}
                style={{
                  backgroundColor: '#4b0082',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff' }}>Sim, sair</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: '#333',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#ccc' }}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
