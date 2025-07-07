import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import {
  TextInput as PaperInput,
  Provider as PaperProvider,
} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase';
import estilos from '../estilos/login';

export default function RecuperarSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [tituloModal, setTituloModal] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');

  const traduzirErroFirebase = (codigo) => {
    switch (codigo) {
      case 'auth/invalid-email':
        return 'O grimório contém um endereço místico inválido.';
      case 'auth/user-not-found':
        return 'Nenhum necromante encontrado com esse nome.';
      case 'auth/too-many-requests':
        return 'O véu foi perturbado muitas vezes. Aguarde antes de tentar novamente.';
      case 'auth/network-request-failed':
        return 'Conexão com o plano astral falhou. Verifique sua rede.';
      default:
        return 'Algo saiu errado na conjuração. Tente novamente.';
    }
  };

  const exibirModal = (titulo, mensagem) => {
    setTituloModal(titulo);
    setMensagemModal(mensagem);
    setModalVisible(true);
  };

  const handleResetPassword = () => {
    if (!email) {
      exibirModal('Erro Arcano', 'Por favor, insira seu e‑mail para reenviar as runas.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        exibirModal(
          'Mensagem Enviada',
          'Verifique sua caixa de entrada para redefinir sua senha arcana.'
        );
      })
      .catch((error) => {
        exibirModal('Erro Arcano', traduzirErroFirebase(error.code));
      });
  };

  return (
    <PaperProvider>
      <StatusBar />
      <View style={estilos.container}>
        <Text style={estilos.title}>Recuperar Senha</Text>

        {/* Input de e-mail com ícone */}
        <PaperInput
          label="E‑mail arcano"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          right={
            <PaperInput.Icon
              icon={() => (
                <FontAwesome5
                  name={  'envelope'}
                  size={20}
                  color="#666"
                />
              )}
            
            />
          }
          style={{ marginBottom: 20 }}
        />

        {/* Botões */}
        <TouchableOpacity style={estilos.button} onPress={handleResetPassword}>
          <Text style={estilos.buttonText}>ENVIAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[estilos.button, { backgroundColor: '#333', marginTop: 10 }]}
        >
          <Text style={estilos.buttonText}>VOLTAR</Text>
        </TouchableOpacity>

        {/* Modal de erro/feedback */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalBox}>
              <Text style={estilos.modalTitle}>{tituloModal}</Text>
              <Text style={estilos.modalMessage}>{mensagemModal}</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={estilos.modalButton}
              >
                <Text style={{ color: '#fff' }}>Fechar o portal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
}
