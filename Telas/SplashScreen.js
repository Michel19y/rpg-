import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ aoTerminar }) {
  const animation = useRef(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Anima o título descendo
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    animation.current?.play();

    // Força a troca de tela após 3 segundos
    const timeout = setTimeout(() => {
      aoTerminar?.();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);
    // Carregar a fonte MedievalSharp a partir do arquivo local
    const [fontsLoaded] = useFonts({
      'MedievalSharp-Regular': require('../assets/fonts/MedievalSharp-Regular.ttf'),
    });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnim }] }]}>
        RPG Codex 
      </Animated.Text>

      <LottieView
        ref={animation}
        source={require('../assets/json/splash.json')}
        autoPlay
        loop={false}
        speed={0.5} // acelera a animação
        style={styles.animation}
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
  title: {
    position: 'absolute',
    top: 60,
    fontSize: 36,
    color: '#8000ff',
    fontFamily: 'MedievalSharp-Regular',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    shadowColor: '#8000ff',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    zIndex: 10,
  },
  animation: {
    width: width,
    height: height,
  },
});
