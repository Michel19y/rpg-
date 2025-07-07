import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import { TextInput as PaperInput, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import estilos from '../estilos/login'; // Ajuste o caminho conforme necessário

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
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
        return (
          <>
            Este grimório já foi tomado por outro necromante. Deseja{' '}
            <Text style={{ color: '#b9f2ff' }}>entrar</Text> com esta conta?
          </>
        );
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
    if (!email || !nome || !senha || !confirmarSenha) {
      exibirModal('Erro Arcano', 'Preencha todos os campos para invocar um novo necromante!');
      return;
    }

    if (senha.length < 6) {
      exibirModal('Proteção Mágica', 'Sua senha arcana deve ter no mínimo 6 runas.');
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
      await setDoc(
        userDocRef,
        {
          email: user.email,
          nome: nome,
        },
        { merge: true }
      );

      exibirModal('Invocação Concluída', 'Novo necromante registrado no Círculo da Necromancia!');
    } catch (error) {
      exibirModal('Erro Arcano', traduzirErroFirebase(error.code));
    }
  };

  return (
    <PaperProvider>
      <View style={estilos.container}>
        <Text style={estilos.title}>Registrar Novo Necromante</Text>

        {/* E‑mail arcano */}
        <PaperInput
          label="E‑mail arcano"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
             placeholder="seu@email.com"
          placeholderTextColor="#666"
          autoCapitalize="none"
          left={props => <PaperInput.Icon {...props} name={() => <Icon name="envelope" size={18} color="#666" />} />}
          style={{ marginBottom: 12 }}
        />

        {/* Nome místico */}
        <PaperInput
          label="Nome místico"
          mode="outlined"
             placeholder="Nome místico"
          placeholderTextColor="#666"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          left={props => <PaperInput.Icon {...props} name={() => <Icon name="user" size={18} color="#666" />} />}
          style={{ marginBottom: 12 }}
        />

        {/* Senha arcana */}
        <PaperInput
          label="Senha arcana"
          mode="outlined"
             placeholder="Sua senha arcana"
          placeholderTextColor="#666"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          left={props => <PaperInput.Icon {...props} name={() => <Icon name="lock" size={18} color="#666" />} />}
          style={{ marginBottom: 12 }}
        />

        {/* Confirmar senha */}
        <PaperInput
          label="Confirmar senha"
          mode="outlined"
             placeholder="Repita seu nome místico"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          left={props => <PaperInput.Icon {...props} name={() => <Icon name="lock" size={18} color="#666" />} />}
          style={{ marginBottom: 20 }}
        />

        {/* Botão de criação */}
        <TouchableOpacity style={estilos.button} onPress={criarConta}>
          <Text style={estilos.buttonText}>CRIAR NECROMANTE</Text>
        </TouchableOpacity>

        {/* Link para login */}
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
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalBox}>
              <Text style={estilos.modalTitle}>{tituloModal}</Text>
              <Text style={estilos.modalMessage}>
                {typeof mensagemModal === 'string' ? mensagemModal : mensagemModal}
              </Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  if (tituloModal === 'Invocação Concluída') {
                    navigation.navigate('Login');
                  }
                }}
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
