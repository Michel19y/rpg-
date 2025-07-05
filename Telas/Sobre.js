import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function TesteDado() {
  const animation = useRef(null);
  const [resultado, setResultado] = useState(null);
  const [valorSorteado, setValorSorteado] = useState(null);

  const rolar = () => {
    const faces = 20;
    const valor = Math.floor(Math.random() * faces) + 1;
    setValorSorteado(valor);     // guarda o valor sorteado mas não mostra ainda
    setResultado(null);          // esconde o resultado enquanto anima
    animation.current?.play(0, 180);
  };

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#111' }}>
      <TouchableOpacity
        onPress={rolar}
        style={{
          backgroundColor:'#4b0082',
          padding:15,
          borderRadius:10,
          marginBottom:20,
        }}
      >
        <Text style={{ color:'#fff', fontWeight:'bold', fontSize:18 }}>
          🎲 Rolar d20
        </Text>
      </TouchableOpacity>

      <LottieView
        ref={animation}
        source={require('../assets/json/dado.json')}
        style={{ width:150, height:150 }}
        loop={false}
        onAnimationFinish={() => {
          setResultado(valorSorteado);  // só mostra o valor quando a animação terminar
        }}
      />

      {resultado !== null && (
        <Text style={{ color:'#b9f2ff', fontSize:36, fontWeight:'bold', marginTop:10 }}>
          {resultado}
        </Text>
      )}
    </View>
  );
}
