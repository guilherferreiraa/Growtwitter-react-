🚀 Growtwitter - Full Stack Project
O Growtwitter é uma rede social completa inspirada no Twitter, desenvolvida para permitir que usuários compartilhem ideias, sigam amigos e interajam com publicações em tempo real. Este projeto faz parte da formação Full Stack, integrando um ecossistema robusto entre Frontend e Backend.

🔗 Links do Projeto
Deploy Frontend: https://growtwitter-react-mu.vercel.app

Documentação API: https://desktop.postman.com/?desktopVersion=12.5.2&userId=48950583&teamId=10564348&region=us

🛠️ Tecnologias Utilizadas
Frontend
React.js + Vite (TypeScript)

Axios (Integração com API e Interceptors para JWT)

React Router DOM (Gerenciamento de rotas SPA)

Styled Components / CSS Modules (Estilização moderna)

Backend
Node.js + Express

Prisma ORM (Modelagem e persistência de dados)

PostgreSQL / Supabase (Banco de dados relacional)

JWT (JSON Web Token) (Autenticação e segurança de rotas)

📋 Funcionalidades Implementadas
🛡️ Autenticação & Segurança
Login Seguro: Autenticação via JWT com armazenamento de token no localStorage.

Proteção de Autoria: O sistema extrai o ID do usuário diretamente do Token no Backend, garantindo que um usuário não possa criar ou deletar conteúdos em nome de terceiros.

🐦 Tweets & Interações
Feed Personalizado: A timeline é filtrada para exibir apenas tweets do próprio usuário e das pessoas que ele segue.

Sistema de Interação: Criação de tweets, sistema de likes (curtir/descurtir) e respostas (replies) vinculadas ao post original.

👥 Social
Follow/Unfollow: Sistema dinâmico para seguir usuários e personalizar a experiência do feed.

Perfis Detalhados: Visualização de dados do perfil, lista de seguidores e histórico de tweets.

⚙️ Como rodar o projeto localmente
Clone o repositório:

Bash
git clone https://github.com/guilherferreiraa/Growtwitter-react-.git


Instale as dependências:
Bash
npm install
Configure o arquivo .env com as suas credenciais do banco de dados e a JWT_SECRET.


Inicie o projeto:
Bash
npm run dev
