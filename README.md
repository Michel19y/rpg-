RPG de Batalha Épica
Bem-vindo ao RPG de Batalha Épica, um jogo mobile desenvolvido em React Native que mergulha você em combates intensos contra monstros, com rolagens de dados e uma vibe necromântica inspirada em Dungeons & Dragons! ⚔️💀 Escolha seus monstros, planeje seus ataques e domine a arena com estratégia e um pouco de sorte nos dados. Este projeto está pronto para explodir com ação e aventura!
📖 Sobre o Projeto
Este é um RPG mobile onde você controla até três monstros para enfrentar inimigos em batalhas por turnos. Com integração ao Firebase para gerenciar dados e autenticação, e animações Lottie para rolagens de dados, o jogo oferece uma experiência envolvente e visualmente rica. A tela principal, TelaArenaBatalha.jsx, é o coração do combate, com uma interface fluida e mecânicas de RPG clássicas.
Funcionalidades

Batalhas Dinâmicas: Lute contra até três monstros inimigos, com rolagens de dados (d20 para acertos, d6+ para danos).
Animação de Dados: Cada rolagem é acompanhada por uma animação Lottie (dado.json), aumentando a imersão.
Gerenciamento de Monstros: Escolha seus monstros, selecione ações (ex.: Ataque Básico) e veja barras de HP com cores dinâmicas (verde, amarelo, vermelho).
Feedback em Tempo Real: Modais e mensagens informam sobre acertos, danos, derrotas ou erros (ex.: "Nenhum inimigo selecionado!").
Integração com Firebase: Autenticação de usuários e armazenamento de dados de monstros no Firestore.
Tema Necromântico: Interface com estética sombria e ícones épicos (FontAwesome5).

🛠️ Tecnologias Utilizadas

React Native: Construção da interface mobile.
Firebase: Autenticação e banco de dados (Firestore).
Lottie: Animações para rolagens de dados.
Expo: Desenvolvimento e testes simplificados.
FontAwesome5: Ícones para vitória, derrota e interface.

🚀 Como Executar o Projeto
Siga os passos abaixo para rodar o jogo localmente:
Pré-requisitos

Node.js (v16 ou superior)
Expo CLI (npm install -g expo-cli)
Conta no Firebase (para autenticação e Firestore)
Emulador Android/iOS ou dispositivo físico com o app Expo Go

Passos

Clone o repositório:
git clone https://github.com/Michel19y/rpg-.git
cd rpg-


Instale as dependências:
npm install
npm install lottie-react-native @expo/vector-icons


Configure o Firebase:

Crie um projeto no Firebase Console.
Adicione as credenciais (API Key, etc.) no arquivo src/Firebase.js.
Exemplo de configuração:import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SUA_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);




Inicie o projeto:
npx expo start


Teste o jogo:

Abra o app Expo Go no seu dispositivo ou emulador (ex.: LDPlayer).
Escaneie o QR code exibido no terminal.
Entre com sua conta Firebase e comece a batalha!



🎮 Como Jogar

Escolha seu monstro: Clique em um dos seus monstros na lista horizontal inferior.
Selecione um alvo: Toque em um monstro inimigo na lista superior.
Escolha uma ação: Um modal abrirá com as ações disponíveis (ex.: Ataque Básico).
Role os dados: Veja a animação do dado e acompanhe o resultado no histórico de rolagens.
Venha ou perca: Derrote todos os inimigos para vencer ou lute até seus monstros caírem!

📜 Estrutura do Projeto
rpg-/
│   ├── assets/
│   │   └── json/
│   │       └── dado.json     # Animação Lottie para rolagem de dados
│   ├── estilos/
│   │   └── batalhas.js       # Estilos da tela de batalha
│   ├── Firebase.js           # Configuração do Firebase
│   └── TelaArenaBatalha.jsx  # Componente principal de combate
├── .gitignore
├── README.md
└── package.json

🧠 Lógica Principal
A tela de batalha (TelaArenaBatalha.jsx) é o núcleo do jogo. Aqui está um resumo da lógica:

Carregamento de Dados:

Busca monstros do Firestore (usuarios/<userId>/monsters) ou via parâmetros de navegação.
Cada monstro tem atributos como hpAtual, atk, def, actions, e image.


Mecânica de Combate:

O jogador seleciona um monstro e uma ação, além de um inimigo alvo.
A função rolarDado simula rolagens (ex.: "1d20" para acertos, "1d6" para danos) com animação Lottie.
A função ataqueAcerta verifica se o ataque acerta (d20 + bônus ≥ defesa do alvo).
A função calcularDano rola o dado de dano se o ataque acertar.
A função realizarAtaque coordena o ataque, atualiza HP e executa contra-ataques inimigos.


Interface:

Usa FlatList para exibir monstros e rolagens.
Modais mostram ações disponíveis e erros (ex.: "Nenhum inimigo selecionado").
Barras de HP mudam de cor (verde, amarelo, vermelho) conforme a vida.



🌟 Destaques

Animação de Dados: Cada rolagem tem uma animação fluida com Lottie, tornando o combate mais imersivo.
Feedback Visual: Mensagens de erro, vitória e derrota usam ícones e cores vibrantes.
Integração Firebase: Dados persistentes e autenticação robusta.
Estilo Necromântico: Tema sombrio com tons de azul, vermelho e preto, inspirado em fantasia épica.

🛠️ Melhorias Futuras

Adicionar telas de inventário e progressão de personagem.
Implementar testes unitários com Jasmine (como discutido anteriormente).
Suporte a multiplayer via Firebase Realtime Database.
Mais animações e efeitos sonoros para enriquecer a experiência.

📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.
🙌 Contribuições
Quer ajudar a tornar esta aventura ainda mais épica? Fork o repositório, faça suas alterações e envie um pull request! Sugestões e issues são bem-vindos.

Pronto para rolar os dados e dominar a arena? 🪓⚡