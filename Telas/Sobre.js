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
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import styles from '../estilos/sobre'; // Certifique-se que esse caminho está certo

export default function SobreScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setModalVisible(false);
        // ✅ Nenhuma navegação aqui! onAuthStateChanged cuida disso automaticamente.
      })
      .catch((error) => {
        console.error('Erro ao deslogar:', error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Botão de Logout */}
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

      {/* Conteúdo principal */}
      <ScrollView style={styles.container}>
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
          <Text style={styles.paragraph}>• react  para telas auxiliares</Text>

          <Text style={styles.section}>Objetivo</Text>
          <Text style={styles.paragraph}>
            O objetivo do projeto é aplicar conhecimentos em React Native, integração com APIs REST
            e banco de dados em nuvem, tudo isso enquanto mergulha o usuário numa ambientação de
            fantasia sombria e combate mágico.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Desenvolvido por Michel • IFSC Lages - 2025</Text>
            <View style={styles.icons}>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Michel19y')}>
                <FontAwesome name="github" size={24} color="#b9f2ff" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('https://www.linkedin.com/in/jean-michel-5a6703360')
                }
              >
                <FontAwesome name="linkedin" size={24} color="#b9f2ff" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/__michelwr')}>
                <FontAwesome name="instagram" size={24} color="#b9f2ff" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de confirmação de logout */}
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