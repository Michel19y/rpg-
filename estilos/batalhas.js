import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#1a1a2e' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#b9f2ff', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#d1c4e9', marginVertical: 12, fontWeight: 'bold' },
    card: {
      width: 140,
      backgroundColor: '#16213e',
      marginRight: 10,
      borderRadius: 8,
      padding: 8,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#16213e',
    },
    nome: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginVertical: 4, textAlign: 'center' },
    img: { width: 100, height: 100, borderRadius: 8, marginBottom: 8, backgroundColor: '#000' },
    hp: { color: '#fff', fontSize: 12 },
    attackButton: {
      backgroundColor: '#e94560',
      paddingVertical: 14,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    attackButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    mensagensContainer: { marginTop: 20 },
    mensagem: { color: '#fff', fontSize: 14, marginBottom: 4 },
    vitoria: { color: '#00ff00', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    derrota: { color: '#ff3b3b', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    selecionado: {
      borderColor: '#9b59b6',
      shadowColor: '#9b59b6',
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 6,
    },
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 1,
    borderColor: '#9400d3',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  acaoButton: {
    backgroundColor: '#0f3460',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  acaoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4b0082',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
    alvo: {
      borderColor: '#8b0000',
      shadowColor: '#8b0000',
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 6,
    },
    inimigoDesativado: {
      opacity: 0.4,
      backgroundColor: '#2c2c2c',
    },
  });

  export default styles;