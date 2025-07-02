import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#0d0d0d', // fundo preto sombrio
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    color: '#b9f2ff', // tom místico de azul claro
    textShadowColor: '#5c00a3',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    color: '#b9f2ff', // tom místico de azul claro
    textShadowColor: '#5c00a3',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  
  input: {
    height: 48,
    borderColor: '#444', // borda de pedra
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#1a1a1a', // fundo de pedra escura
    color: '#e0e0e0', // texto cinza claro
  },
  inputs: {
    textDecorationColor:'red',
    height: 48,
    borderColor: '#444', // borda de pedra
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#1a1a1a', // fundo de pedra escura
    color: '#e0e0e0', // texto cinza claro
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#9c27b0', // roxo arcano
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4a148c', // roxo sombrio
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#e8eaf6', // quase branco
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  registerLink: {
    fontSize: 14,
    color: '#7c4dff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#9c27b0',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  }
});

export default estilos;
