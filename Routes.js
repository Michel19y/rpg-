import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from './Firebase';
import { useFonts } from 'expo-font';

// Telas
import SplashScreen from './Telas/SplashScreen';
import LoginScreen from './Telas/LoginScreen';
import SignUpScreen from './Telas/SignUpScreen';
import WelcomeScreen from './Telas/WelcomeScreen';
import LerScreen from './Telas/TelaRead';
import TelaEscolherInimigo from './Telas/TelaInimigo';
import SobreScreen from './Telas/Sobre';
import RecuperarSenhaScreen from './Telas/RecuperarSenhaScreen';
import InfosScreen from './Telas/infos';
import TelaArenaBatalha from './Telas/batalha';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authChecada, setAuthChecada] = useState(false);
  const [splashJaMostrada, setSplashJaMostrada] = useState(false);

  // Carregar a fonte MedievalSharp a partir do arquivo local
  const [fontsLoaded] = useFonts({
    'MedievalSharp-Regular': require('./assets/fonts/MedievalSharp-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usuario) => {
      setUsuarioLogado(!!usuario);
      setAuthChecada(true);
    });
    return unsubscribe;
  }, []);

  // Se as fontes não estiverem carregadas, não renderizar
  if (!fontsLoaded) {
    return null;
  }

  const estiloHeader = (titulo) => ({
    title: titulo,
    headerStyle: { backgroundColor: '#0d0d0d' },
    headerTintColor: '#b9f2ff',
    headerTitleStyle: { 
      fontFamily: 'MedievalSharp-Regular',
      fontSize: 18,
      fontWeight: 'normal',
    },
    headerBackTitleVisible: false,
  });

  function TabsInternas() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0d0d0d' },
          headerTintColor: '#b9f2ff',
          tabBarStyle: { backgroundColor: '#1a1a1a' },
          tabBarActiveTintColor: '#b9f2ff',
          tabBarInactiveTintColor: '#888',
          headerLeft: () => null,
          headerTitleStyle: { 
            fontFamily: 'MedievalSharp-Regular',
            fontSize: 18,
          },
          tabBarLabelStyle: { 
            fontFamily: 'MedievalSharp-Regular',
            fontSize: 12,
          },
        }}
      >
        <Tab.Screen
          name="Bem-vindo"
          component={WelcomeScreen}
          options={{
            title: 'Círculo de Invocação',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="dungeon" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Ler"
          component={LerScreen}
          options={{
            title: 'Monstros do Círculo',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="book-dead" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Escolhe inimigo"
          component={TelaEscolherInimigo}
          options={{
            title: 'Escolher Inimigo',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="skull-crossbones" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Sobre"
          component={SobreScreen}
          options={{
            title: 'Sobre o Projeto',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="info-circle" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // Splash só aparece na primeira vez
  if (!authChecada || !splashJaMostrada) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            options={{ headerShown: false }}
          >
            {() => <SplashScreen aoTerminar={() => setSplashJaMostrada(true)} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {usuarioLogado ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={TabsInternas}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Infos"
              component={InfosScreen}
              options={estiloHeader('Ficha do Monstro')}
            />
            <Stack.Screen
              name="ArenaBatalha"
              component={TelaArenaBatalha}
              options={{
                headerTitle: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 name="fort-awesome" size={20} color="purple" />
                    <Text style={{
                      fontFamily: 'MedievalSharp-Regular',
                      color: '#b9f2ff',
                      fontSize: 16,
                      marginLeft: 8,
                    }}>
                      Arena de Batalha
                    </Text>
                  </View>
                ),
                headerStyle: { backgroundColor: '#0d0d0d' },
                headerTintColor: '#b9f2ff',
              }}
            />
          </>
        ) : (
          <>
          <Stack.Screen
  name="Login"
  component={LoginScreen}
  options={{
    ...estiloHeader('Círculo da Necromancia'),
    headerBackVisible: false, // oculta a seta de voltar
  }}
/>
<Stack.Screen
  name="SignUp"
  component={SignUpScreen}
  options={{
    ...estiloHeader('Juntar-se ao Círculo'),
    headerBackVisible: false,
  }}
/>
<Stack.Screen
  name="Recuperando"
  component={RecuperarSenhaScreen}
  options={{
    ...estiloHeader('Recuperar Senha Arcana'),
    headerBackVisible: false,
  }}
/>


          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

