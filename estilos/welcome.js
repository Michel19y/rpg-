import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#0d0d0d',
      flex: 1,
      padding: 16
    },
    titulo: {
      color: '#b9f2ff',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 10
    },
    subtitulo: {
      color: '#a29bfe',
      fontSize: 18,
      marginVertical: 10,
      textAlign: 'center'
    },
    card: {
      width: 160,
      backgroundColor: '#1a1a1a',
      marginRight: 12,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      borderColor: '#6a0dad',
      borderWidth: 1
    },
    cardSelecionado: {
      borderColor: '#7c4dff',
      borderWidth: 2,
      backgroundColor: '#2a1a3c'
    },
    imagem: {
      width: 100,
      height: 100,
      marginBottom: 6
    },
    nome: {
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'center'
    },
    stat: {
      color: '#ccc',
      fontSize: 12
    },
    desc: {
      color: '#999',
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 4
    },
    botao: {
      backgroundColor: '#6a0dad',
      padding: 12,
      borderRadius: 8,
      marginVertical: 10,
      alignItems: 'center'
    },
    botaoTexto: {
      color: '#fff',
      fontWeight: 'bold'
    },
    cardSalvo: {
      flexDirection: 'row',
      backgroundColor: '#222',
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      alignItems: 'center',
      gap: 10
    },
    imagemSalva: {
      width: 60,
      height: 60,
      marginRight: 10
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#1a001a',
      borderRadius: 12,
      padding: 24,
      width: '80%',
      borderWidth: 1,
      borderColor: '#9400d3',
      shadowColor: '#9400d3',
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 10
    },
    modalTitle: {
      color: '#ffccff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12
    },
    modalMensagem: {
      color: '#ddd',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20
    },
    modalBotao: {
      backgroundColor: '#4b0082',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center'
    }
  });
  export default styles;