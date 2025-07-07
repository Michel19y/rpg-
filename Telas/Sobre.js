import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Button,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import styles from '../estilos/sobre'; // Ensure the path is correct

export default function SobreScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(1.0); // Initial volume (max)

  // Logout function
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => setModalVisible(false))
      .catch((error) => console.error('Error signing out:', error));
  };

  // Set music options
  useEffect(() => {
    setItems([
      {
        label: 'Tema',
        value: require('../assets/musicas/tema.mp3'), // Local file
      },
      // Add more local music files if desired, e.g.:
      // { label: 'Teste 2', value: require('../assets/musicas/tste2.mp3') },
    ]);
  }, []);

  // Toggle play/stop music
  const toggleSound = async () => {
    if (!selected) return;
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(selected);
        setSound(newSound);
        await newSound.setVolumeAsync(volume);
        await newSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/stopping music:', error);
    }
  };

  // Adjust music volume
  const handleVolumeChange = async (newVolume) => {
    setVolume(newVolume);
    if (sound) {
      try {
        await sound.setVolumeAsync(newVolume);
      } catch (error) {
        console.error('Error adjusting volume:', error);
      }
    }
  };

  // Cleanup sound on component unmount
  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <View style={{ flex: 1 }}>
      {/* Floating Logout Button */}
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
        <MaterialIcons name="logout" size={24} color="#e0b3ff" />
      </TouchableOpacity>

      {/* Main Content */}
      <ScrollView
        style={styles.container}
        nestedScrollEnabled={true} // Avoid VirtualizedList conflicts
      >
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
          <Text style={styles.paragraph}>• Cadastro e login com autenticação Firebase</Text>
          <Text style={styles.paragraph}>• Escolha de classe e raça das criaturas</Text>
          <Text style={styles.paragraph}>• Dashboard de personagens com magias</Text>
          <Text style={styles.paragraph}>• Batalhas contra monstros da D&D API</Text>
          <Text style={styles.paragraph}>• Ataques com dados reais (ex: atk, Magic evasive)</Text>
          <Text style={styles.paragraph}>• Estilo visual necromante e dark fantasy</Text>

          <Text style={styles.section}>Tecnologias Utilizadas</Text>
          <Text style={styles.paragraph}>• React Native + Expo</Text>
          <Text style={styles.paragraph}>• Firebase Authentication e Firestore</Text>
          <Text style={styles.paragraph}>• Consumo da API pública D&D 5e</Text>
          <Text style={styles.paragraph}>• React para telas auxiliares</Text>

          <Text style={styles.section}>Objetivo</Text>
          <Text style={styles.paragraph}>
            O objetivo do projeto é aplicar conhecimentos em React Native, integração com APIs REST
            e banco de dados em nuvem, tudo isso enquanto mergulha o usuário numa ambientação de
            fantasia sombria e combate mágico.
          </Text>

          {/* Music Section */}
          <View style={{ zIndex: 1000, marginVertical: 10 }}>
            <Text style={[styles.section, { marginTop: 20 }]}>Música Tema RPG</Text>
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              value={selected}
              setValue={setSelected}
              items={items}
              setItems={setItems}
              placeholder="Selecione uma música"
              containerStyle={{ marginVertical: 10 }}
              style={{ backgroundColor: '#1a001a', borderColor: '#9400d3' }}
              textStyle={{ color: '#fff' }}
              dropDownContainerStyle={{ backgroundColor: '#1a001a', borderColor: '#9400d3' }}
            />
            <Button
              title={sound ? 'Parar Música' : 'Tocar Música'}
              onPress={toggleSound}
              disabled={!selected}
            />
          </View>

          {/* Footer */}
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
                onPress={() =>
                  Linking.openURL('https://www.linkedin.com/in/jean-michel-5a6703360')
                }
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

      {/* Logout Modal with Volume Control */}
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
            {/* Music Icon */}
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <MaterialIcons name="music-note" size={40} color="#e0b3ff" />
            </View>

            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              Deseja mesmo sair do RPG Codex?
            </Text>

            {/* Volume Control */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#e0b3ff', fontSize: 16, marginBottom: 10 }}>
                Volume da Música
              </Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#9400d3"
                maximumTrackTintColor="#333"
                thumbTintColor="#e0b3ff"
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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