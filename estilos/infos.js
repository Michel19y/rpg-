import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#0d0d0d',
      flex: 1,
      padding: 16,
    },subtituloContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    
    loadingContainer: {
      flex: 1,
      backgroundColor: '#0d0d0d',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: '#aaa',
      fontStyle: 'italic',
    },
    nome: {
      color: '#b9f2ff',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      textShadowColor: '#6a0dad',
      textShadowRadius: 4,
    },
    imagem: {
      width: '100%',
      height: 220,
      backgroundColor: '#1a1a1a',
      borderRadius: 10,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    statItem: {
      alignItems: 'center',
    },
    statText: {
      color: '#e0e0e0',
      fontSize: 14,
      marginTop: 4,
    },
    subtitulo: {
      fontSize: 18,
      color: '#d1c4e9',
      marginBottom: 8,
      fontWeight: 'bold',
    },
    bloco: {
      backgroundColor: '#1f1f1f',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    acaoNome: {
      fontSize: 16,
      color: '#a29bfe',
      fontWeight: 'bold',
    },
    acaoDesc: {
      fontSize: 14,
      color: '#ccc',
      marginTop: 4,
    },
    verMais: {
      color: '#b9f2ff',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      marginTop: 4,
    },
  });
  export default styles;