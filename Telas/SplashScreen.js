import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { auth } from '../Firebase'; // Certifique-se que o Firebase está configurado

const { width, height } = Dimensions.get('window');
const NUM_PARTICULAS = 60;

const coresTema = {
  necromancia: {
    fundo: '#1a001f',
    ativo: '#00ff9f',
  },
};

function hexParaRgb(hex) {
  const valor = parseInt(hex.replace('#', ''), 16);
  return {
    r: (valor >> 16) & 255,
    g: (valor >> 8) & 255,
    b: valor & 255,
  };
}

function misturarCores(c1, c2, peso = 0.5) {
  return {
    r: Math.round(c1.r * peso + c2.r * (1 - peso)),
    g: Math.round(c1.g * peso + c2.g * (1 - peso)),
    b: Math.round(c1.b * peso + c2.b * (1 - peso)),
  };
}

function corParticulaAtual(nomeTema) {
  const tema = coresTema[nomeTema];
  const ativo = hexParaRgb(tema.ativo);
  const fundo = hexParaRgb(tema.fundo);
  const corFinal = misturarCores(ativo, fundo);
  return `rgb(${corFinal.r}, ${corFinal.g}, ${corFinal.b})`;
}

function Particula({ cor }) {
  const translateY = useRef(new Animated.Value(height + Math.random() * height)).current;
  const opacidade = useRef(new Animated.Value(0)).current;
  const translateX = Math.random() * width;

  useEffect(() => {
    const duracao = 5000 + Math.random() * 3000;

    const animar = () => {
      translateY.setValue(height + 50);
      opacidade.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: duracao,
          useNativeDriver: true,
        }),
        Animated.timing(opacidade, {
          toValue: 0.8,
          duration: duracao / 2,
          useNativeDriver: true,
        }),
      ]).start(() => animar());
    };

    animar();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particula,
        {
          left: translateX,
          transform: [{ translateY }],
          opacity: opacidade,
          backgroundColor: cor,
        },
      ]}
    />
  );
}

export default function SplashScreen({ navigation }) {
  const nomeTema = 'necromancia';
  const cor = corParticulaAtual(nomeTema);
  const lottieRef = useRef(null);
  const lottieOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    lottieRef.current?.play();

    const fadeOut = setTimeout(() => {
      Animated.timing(lottieOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 6000);

    const timeout = setTimeout(() => {
      const usuario = auth.currentUser;
      if (usuario) {
        navigation.replace('Tabs');
      } else {
        navigation.replace('Login');
      }
    }, 7000);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: coresTema[nomeTema].fundo }]}>
      {Array.from({ length: NUM_PARTICULAS }).map((_, i) => (
        <Particula key={i} cor={cor} />
      ))}

      <Animated.View style={[styles.lottieWrapper, { opacity: lottieOpacity }]}>
        <LottieView
          ref={lottieRef}
          source={require('../assets/json/caveira.json')} // Confirme esse caminho
          autoPlay
          loop
          resizeMode="contain"
          style={styles.lottieAnimation}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lottieWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: width * 0.8,
    height: height * 0.6,
    zIndex: 1,
  },
  particula: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 0,
  },
});
