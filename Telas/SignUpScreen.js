import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import estilos from '../estilos/login'; // Ajuste o caminho conforme necessário

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const auth = getAuth();
  const db = getFirestore();

  // Modal de erro/feedback
  const [modalVisible, setModalVisible] = useState(false);
  const [tituloModal, setTituloModal] = useState('');
  const [mensagemModal, setMensagemModal] = useState('');

  const traduzirErroFirebase = (codigo) => {
    switch (codigo) {
      case 'auth/email-already-in-use':
        return 'Este grimório já foi tomado por outro necromante.';
      case 'auth/invalid-email':
        return 'O endereço arcano inserido não é válido.';
      case 'auth/weak-password':
        return 'Sua senha precisa ser mais poderosa, tente algo mais forte.';
      case 'auth/network-request-failed':
        return 'A conexão com o plano astral falhou. Verifique sua rede.';
      default:
        return 'Algo saiu errado na invocação. Tente novamente.';
    }
  };

  const exibirModal = (titulo, mensagem) => {
    setTituloModal(titulo);
    setMensagemModal(mensagem);
    setModalVisible(true);
  };

  const criarConta = async () => {
    if (!email || !senha || !confirmarSenha) {
      exibirModal('Erro Arcano', 'Preencha todos os campos para invocar um novo necromante!');
      return;
    }
  
    if (senha.length < 6) {
      exibirModal('Proteção Mágica', 'Sua senha mística deve ter no mínimo 6 runas.');
      return;
    }
  
    if (senha !== confirmarSenha) {
      exibirModal('Erro Arcano', 'As senhas não coincidem no círculo místico!');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
  
      const userDocRef = doc(db, 'usuarios', user.uid);
      await setDoc(userDocRef, { email: user.email }, { merge: true });
  
      exibirModal('Invocação Concluída', 'Novo necromante registrado no Círculo da Necromancia!');
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message, error.stack);
      const mensagemTematica = traduzirErroFirebase(error.code);
      exibirModal('Erro Arcano', `Falha ao invocar novo necromante: ${mensagemTematica}`);
    }
  };
  

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Registrar Novo Necromante</Text>

      <TextInput
        style={estilos.input}
        placeholder="E-mail arcano"
        placeholderTextColor="#b0b0b0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha mística"
        placeholderTextColor="#b0b0b0"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={estilos.input}
        placeholder="Confirmar senha mística"
        placeholderTextColor="#b0b0b0"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity style={estilos.button} onPress={criarConta}>
        <Text style={estilos.buttonText}>CRIAR NECROMANTE</Text>
      </TouchableOpacity>

      <View style={estilos.registerContainer}>
        <Text style={estilos.registerText}>Já possui um círculo?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={estilos.registerLink}>Entrar</Text>
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
              onPress={() => {
                setModalVisible(false);
                if (tituloModal === 'Invocação Concluída') {
                  navigation.navigate('Login');
                }
              }}
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
