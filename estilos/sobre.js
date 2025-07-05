import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    backgroundColor: '#0d0d0d',
    padding: 5,
  },
  card: {
    backgroundColor: 'rgba(25, 0, 51, 0.85)',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    color: '#e0b3ff',
    textAlign: 'center',
     fontFamily: 'MedievalSharp-Regular' ,
    marginBottom: 20,
    textShadowColor: '#9c27b0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  paragraph: {
    color: '#e0e0e0',
    fontSize: 15,
    marginBottom: 10,
  },
  highlight: {
    color: '#baffc9',
    fontFamily: 'MedievalSharp-Regular' ,

  },
  section: {
    fontSize: 18,
    color: '#d1c4e9',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'MedievalSharp-Regular' ,

  },
  link: {
    color: '#a29bfe',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
     fontFamily: 'MedievalSharp-Regular' ,
    marginBottom: 10,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default styles;
