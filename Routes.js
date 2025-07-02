import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from './Firebase'; // Ajuste o caminho
import { onAuthStateChanged } from 'firebase/auth';

// Telas públicas
import LoginScreen from './Telas/LoginScreen';
import SignUpScreen from './Telas/SignUpScreen';
import RecuperarSenhaScreen from './Telas/RecuperarSenhaScreen';

// Telas privadas
import WelcomeScreen from './Telas/WelcomeScreen';
import CriarScreen from './Telas/TelaCreate';
import LerScreen from './Telas/TelaRead';
import UparScreen from './Telas/TelaUpdate';
import DeleteScreen from './Telas/TelaDelete';
import SobreScreen from './Telas/Sobre'; // Nome do componente com "S" maiúsculo

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  useEffect(() => {
    // Monitora o estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(!!user); // Define como true se houver usuário logado
    });
    return unsubscribe; // Limpa o listener ao desmontar
  }, []);

  const estiloHeader = (titulo) => ({
    title: titulo,
    headerStyle: { backgroundColor: '#0d0d0d' },
    headerTintColor: '#b9f2ff',
    headerTitleStyle: { fontWeight: 'bold' },
  });

  return (
    <NavigationContainer>
      {usuarioLogado ? (
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0d0d0d' },
            headerTintColor: '#b9f2ff',
            tabBarStyle: { backgroundColor: '#1a1a1a' },
            tabBarActiveTintColor: '#b9f2ff',
            tabBarInactiveTintColor: '#888',
            // Desativa o botão "voltar" no Tab Navigator
            headerLeft: () => null,
          }}
        >
       
          <Tab.Screen
            name="Bem-vindo"
            component={WelcomeScreen}
            options={{
              title: 'Bem-vindo',
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
            name="Aprimorar"
            component={UparScreen}
            options={{
              title: 'Aprimorar Monstro',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="magic" size={size} color={color} />
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
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={estiloHeader('Círculo da Necromancia')}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={estiloHeader('Juntar-se ao Círculo')}
          />
          <Stack.Screen
            name="Recuperando"
            component={RecuperarSenhaScreen}
            options={estiloHeader('Recuperar Senha Arcana')}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}