

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ aoTerminar }) {
  const video = useRef(null);

  const handleVideoEnd = () => {
    if (aoTerminar) {
      aoTerminar(); // Informa para o Routes que terminou
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/video/splash.mp4')}
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
