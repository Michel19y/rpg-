import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Routes from './Routes';
import { MusicProvider } from './context/MusicContext';

export default function App() {
  return (
    <MusicProvider>
      <StatusBar style="light" backgroundColor="#1a001f" translucent={false} />
      <Routes />
    </MusicProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
