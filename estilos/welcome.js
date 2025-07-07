import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d0d',
    flexGrow: 1,
    padding: 16
  },
  titulo: {
    color: '#9400d3',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
fontFamily: 'MedievalSharp-Regular', 
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  loadingIndicator: {
    backgroundColor:'red',
  },
  subtitulo: {
    color: '#b9f2ff',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
 fontFamily: 'MedievalSharp-Regular',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardSelecionado: {
    borderColor: '#b9f2ff',
    borderWidth: 2,
  },
  imageContainer: {
    position: 'relative', // Permite posicionar o ActivityIndicator absolutamente
    width: '100%',
    height: 150, // Ajuste conforme o tamanho desejado para a imagem
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  
  loadingIndicator: {
    position: 'absolute', // Centraliza no container sem afetar o layout
    zIndex: 1, // Garante que o indicador fique acima da imagem
  },
  nome: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MedievalSharp-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  stat: {
    color: '#b9f2ff',
    fontSize: 14,
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    left: 1,
    marginRight:120,
    top: '40%',
    transform: [{ translateY: -10 }],
  },
  
  inputBusca: {
    backgroundColor: '#1e1e1e',
    color: '#fce3ff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#555'
  },
  card: {
    backgroundColor: '#292841',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 180,
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  imagem: {
    width: 160, // Slightly increased width to fill more space
    height: 120, // Adjusted height to match the image's approximate aspect ratio
    marginBottom: 8,
    borderRadius: 50,
    borderColor:'red',
    resizeMode: 'contain', // Maintains image proportion
  },
  cardSelecionado: {
    borderColor: '#9400d3',
    borderWidth: 2,
    backgroundColor: '#3b295f'
  },

  nome: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
  },
  stat: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center'
  },
  desc: {
    color: '#b0a8b9',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4
  },
  botao: {
    backgroundColor: '#8e2de2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 4
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },
  cardSalvo: {
    flexDirection: 'row',
    backgroundColor: '#1c1c2b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  imagemSalva: {
    width: 60,
    height: 60,
    border:30,
    marginRight: 10
  },
  containerCarregamento: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center'
  },
  orbe: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2e2e2e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9400d3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10
  },
  luzOrbe: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#9400d3',
    opacity: 0.8
  },
  textoCarregando: {
    marginTop: 20,
    color: '#fce3ff',
    fontSize: 16,
    fontStyle: 'italic'
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
    width: '85%',
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
    alignItems: 'center',
    paddingHorizontal: 12
  }
});

export default styles;
