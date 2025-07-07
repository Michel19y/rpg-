import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StatusBar, Pressable } from 'react-native';
import { TextInput as PaperInput, Provider as PaperProvider } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import estilos from '../estilos/login';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  // Controle do modal de erro
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
      exibirModal(
        'Erro Arcano',
        'Preencha o nome de necromante e a senha arcana para invocar o login.'
      );
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        exibirModal(
          'Invocação Concluída',
          `Bem-vindo, necromante ${user.email}! As sombras te aguardam.`
        );
      })
      .catch((error) => {
        exibirModal('Erro Arcano', traduzirErroFirebase(error.code));
      });
  };

  const handleForgotPassword = () => navigation.navigate('Recuperando');
  const handleRegister = () => navigation.navigate('SignUp');

  // Trata inserção/deleção de caracteres sem considerar as runas
  const handleSenhaChange = (text) => {
    if (senhaVisivel) {
      setSenha(text);
    } else {
      if (text.length > senha.length) {
        setSenha((s) => s + text.charAt(text.length - 1));
      } else if (text.length < senha.length) {
        setSenha((s) => s.slice(0, text.length));
      }
    }
  };

  return (
    <PaperProvider>
      <View style={estilos.container}>
        <StatusBar />

        <Text style={estilos.title}>Círculo da Necromancia</Text>

        {/* Email */}
        <PaperInput
          label="Nome de necromante ou email"
          mode="outlined"
          placeholder="seu@email.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: 16 }}
        />

        {/* Senha com runas */}
        <PaperInput
  label="Senha arcana"
  mode="outlined"
  value={senhaVisivel ? senha : 'ᛟ'.repeat(senha.length)}
  onChangeText={handleSenhaChange}
     placeholder="Sua senha arcana"
          placeholderTextColor="#666"
  secureTextEntry={false} // a gente controla a máscara manualmente
  right={
    <PaperInput.Icon
      icon={() => (
        <FontAwesome5
          name={senhaVisivel ? 'eye' : 'eye-slash'}
          size={20}
          color="#666"
        />
      )}
      onPress={() => setSenhaVisivel(v => !v)}
    />
  }
/>


        {/* Esqueci senha */}
        <TouchableOpacity onPress={handleForgotPassword} style={estilos.forgotPassword}>
          <Text style={estilos.forgotPasswordText}>Perdeu sua senha arcana?</Text>
        </TouchableOpacity>

        {/* Botão de login */}
        <TouchableOpacity style={estilos.button} onPress={handleLogin}>
          <Text style={estilos.buttonText}>INVOCAR LOGIN</Text>
        </TouchableOpacity>

        {/* Registro */}
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
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalBox}>
              <Text style={estilos.modalTitle}>{tituloErro}</Text>
              <Text style={estilos.modalMessage}>{mensagemErro}</Text>
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
