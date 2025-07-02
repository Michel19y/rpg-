import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import estilos from '../estilos/login';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Modal de erro temático
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [tituloErro, setTituloErro] = useState('');

  const traduzirErroFirebase = (codigo) => {
    switch (codigo) {
      case 'auth/invalid-email':
        return 'O grimório contém um endereço místico inválido.';
      case 'auth/user-disabled':
        return 'Este necromante foi silenciado pelo Conselho das Sombras.';
      case 'auth/user-not-found':
        return 'Nenhum necromante encontrado com esse nome.';
      case 'auth/wrong-password':
        return 'A senha arcana está corrompida ou incorreta.';
      case 'auth/too-many-requests':
        return 'O véu foi perturbado muitas vezes. Aguarde antes de tentar novamente.';
      case 'auth/network-request-failed':
        return 'Conexão com o plano astral falhou. Verifique sua rede.';
      default:
        return 'Algo saiu errado na conjuração. Tente novamente.';
    }
  };

  const exibirModal = (titulo, mensagem) => {
    setTituloErro(titulo);
    setMensagemErro(mensagem);
    setModalVisible(true);
  };

  const handleLogin = () => {
    if (!email || !senha) {
      exibirModal('Erro Arcano', 'Preencha o nome de necromante e a senha arcana para invocar o login.');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        exibirModal('Invocação Concluída', `Bem-vindo, necromante ${user.email}! As sombras te aguardam.`);
      })
      .catch((error) => {
        const mensagemTematica = traduzirErroFirebase(error.code);
        exibirModal('Erro Arcano', mensagemTematica);
      });
  };

  const handleForgotPassword = () => {
    navigation.navigate('Recuperando');
  };

  const handleRegister = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Círculo da Necromancia</Text>

      <TextInput
        placeholder="Nome de necromante ou email"
        placeholderTextColor="#666"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        style={estilos.input}
      />
      <TextInput
        placeholder="Senha arcana"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={setSenha}
        value={senha}
        style={estilos.input}
      />

      <TouchableOpacity onPress={handleForgotPassword} style={estilos.forgotPassword}>
        <Text style={estilos.forgotPasswordText}>Perdeu sua senha arcana?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.button} onPress={handleLogin}>
        <Text style={estilos.buttonText}>INVOCAR LOGIN</Text>
      </TouchableOpacity>

      <View style={estilos.registerContainer}>
        <Text style={estilos.registerText}>Ainda não é um necromante?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={estilos.registerLink}>Junte-se ao círculo</Text>
        </TouchableOpacity>
      </View>

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
              {tituloErro}
            </Text>
            <Text
              style={{
                color: '#ccc',
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {mensagemErro}
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
