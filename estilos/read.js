import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0d0d0d',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'MedievalSharp-Regular',
    color: '#b9f2ff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#6a0dad',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#aaa',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#6a0dad',
    borderWidth: 1,
    shadowColor: '#6a0dad',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagem: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#0d0d0d',
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 1,
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b9f2ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginLeft: 6,
  },
  subtitulo: {
    fontSize: 16,
    color: '#d1c4e9',
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  acao: {
    color: '#a29bfe',
    fontSize: 14,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 13,
    color: '#cccccc',
    marginTop: 4,
    fontStyle: 'italic',
  },
  donoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  filterButton: {
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#b9f2ff',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  filterButtonTextSelected: {
    color: '#222',
    fontWeight: 'bold',
  },
});

export default styles;