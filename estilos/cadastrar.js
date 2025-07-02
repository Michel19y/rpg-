import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#0d0d0d', // Fundo preto sombrio, como no tema necromântico
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
    color: '#b9f2ff', // Tom místico de azul claro
    textShadowColor: '#5c00a3', // Sombra roxa arcana
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    height: 48,
    borderColor: '#444', // Borda de pedra escura
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#1a1a1a', // Fundo de pedra escura
    color: '#e0e0e0', // Texto cinza claro
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#9c27b0', // Roxo arcano
    fontSize: 14,
    fontStyle: 'italic', // Estilo itálico para toque místico
  },
  loginButton: {
    backgroundColor: '#4a148c', // Roxo sombrio, consistente com o tema
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#9c27b0', // Sombra roxa arcana
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#e8eaf6', // Quase branco, como no tema original
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Letras maiúsculas para ênfase
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLink: {
    color: '#7c4dff', // Roxo claro para links, consistente com o tema
    fontSize: 14,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#9c27b0', // Roxo arcano para o menu dropdown
    color: '#fff', // Texto branco para contraste
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default estilos;