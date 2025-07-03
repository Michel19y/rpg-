import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { auth } from '../Firebase'; // Firebase já configurado?
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const video = useRef(null);
  const navigation = useNavigation();

  const handleVideoEnd = () => {
    const usuario = auth.currentUser;
    if (usuario) {
      navigation.replace('Tabs'); // Usuário logado
    } else {
      navigation.replace('Login'); // Não logado
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/splash.mp4')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isMuted={false}
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish && !status.isLooping) {
            handleVideoEnd();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height,
  },
});
