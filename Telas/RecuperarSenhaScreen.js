import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase';
import estilos from '../estilos/login'; // reutilizando estilo do login

export default function RecuperarSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');

  // Modal de erro/feedback
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
      exibirModal('Erro Arcano', 'Por favor, insira seu e-mail para reenviar as runas.');
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
        const mensagemTematica = traduzirErroFirebase(error.code);
        exibirModal('Erro Arcano', mensagemTematica);
      });
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Recuperar Senha</Text>

      <TextInput
        placeholder="Digite seu e-mail"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={estilos.input}
      />

      <TouchableOpacity onPress={handleResetPassword} style={estilos.button}>
        <Text style={estilos.buttonText}>ENVIAR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={[estilos.button, {backgroundColor: '#333', marginTop: 10}]}>
        <Text style={estilos.buttonText}>VOLTAR</Text>
      </TouchableOpacity>

      {/* Modal de erro/feedback */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
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
              {tituloModal}
            </Text>
            <Text
              style={{
                color: '#ccc',
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {mensagemModal}
            </Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#4b0082',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignSelf: 'center',
              }}
            >
              <Text style={{ color: '#fff' }}>Fechar o portal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
