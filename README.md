<p align="center">
  <img src="https://i.pinimg.com/736x/93/55/dd/9355dd0f9547309097693976b6114585.jpg" alt="Ecliptica Ecommerce Banner" width="200"/>
</p>

<h1 align="center">Ecliptica Ecommerce</h1>

<p align="center">
  <strong>Um universo onde sofisticação, mistério e autenticidade se encontram.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router"/>
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux"/>
</p>

## 📜 Sumário

- [✨ Funcionalidades](#-funcionalidades)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔄 Fluxo de Dados](#-fluxo-de-dados)
- [🏁 Começando](#-começando)
- [📜 Scripts Disponíveis](#-scripts-disponíveis)
- [🐳 Deploy com Docker](#-deploy-com-docker)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## ✨ Funcionalidades

- **🛒 Carrinho de Compras:** Adicione, remova e atualize produtos no carrinho.
- **👤 Autenticação de Usuário:** Sistema completo de login, registro e recuperação de senha.
- **🛍️ Vitrine de Produtos:** Navegue por produtos, coleções e categorias.
- **🔍 Busca Avançada:** Encontre produtos por nome, categoria e filtros.
- **💳 Checkout Simplificado:** Processo de pagamento intuitivo e seguro.
- **👤 Perfil de Usuário:** Gerencie seus dados e acompanhe seus pedidos.
- **📱 Design Responsivo:** Experiência otimizada para desktops, tablets e celulares.

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
| --- | --- |
| **React** | Biblioteca para construção de interfaces de usuário. |
| **TypeScript** | Superset de JavaScript que adiciona tipagem estática. |
| **Vite** | Ferramenta de build moderna e rápida. |
| **React Router** | Para roteamento e navegação na aplicação. |
| **Redux Toolkit** | Para gerenciamento de estado global. |
| **Tailwind CSS** | Framework CSS para estilização rápida e customizável. |
| **Framer Motion** | Para animações fluidas e declarativas. |
| **Axios** | Cliente HTTP para requisições à API. |
| **Zod** | Para validação de esquemas e formulários. |
| **Docker** | Para containerização e deploy da aplicação. |

## 📂 Estrutura do Projeto

```
Ecliptica-Ecommerce/
├── app/
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── data/        # Dados estáticos (mock)
│   │   ├── hooks/       # Hooks customizados
│   │   ├── lib/         # Funções utilitárias
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Serviços de API
│   │   ├── store/       # Configuração do Redux
│   │   └── types/       # Tipos e interfaces
│   ├── routes/        # Definição de rotas
│   └── root.tsx       # Componente raiz da aplicação
├── public/            # Arquivos públicos
└── ...                # Arquivos de configuração
```

## 🔄 Fluxo de Dados

### Entradas de Dados (Inputs)

- **Formulário de Registro:** O usuário insere nome, e-mail e senha.
- **Formulário de Login:** O usuário insere e-mail e senha.
- **Adicionar ao Carrinho:** O usuário adiciona um produto ao carrinho.
- **Formulário de Checkout:** O usuário insere informações de endereço e pagamento.
- **Busca de Produtos:** O usuário digita termos de busca e aplica filtros.
- **Atualização de Perfil:** O usuário edita suas informações pessoais.

### Saídas de Dados (Outputs)

- **Listagem de Produtos:** Exibição dos produtos na vitrine, coleções e categorias.
- **Detalhes do Produto:** Exibição de informações detalhadas de um produto.
- **Visualização do Carrinho:** Exibição dos itens no carrinho de compras.
- **Confirmação de Pedido:** Exibição dos detalhes do pedido após a compra.
- **Perfil do Usuário:** Exibição das informações do usuário e histórico de pedidos.

## 🏁 Começando

Siga os passos abaixo para rodar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/Ecliptica-Ecommerce.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd Ecliptica-Ecommerce
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```

### Rodando a Aplicação

Para iniciar o servidor de desenvolvimento com Hot Module Replacement (HMR):

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run preview`: Inicia um servidor local para visualizar a build de produção.

## 🐳 Deploy com Docker

Para construir e rodar a aplicação com Docker:

1.  Construa a imagem Docker:
    ```bash
    docker build -t ecliptica-ecommerce .
    ```
2.  Rode o container:
    ```bash
    docker run -p 3000:3000 ecliptica-ecommerce
    ```

A aplicação estará disponível em `http://localhost:3000`.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

1.  Faça um fork do projeto.
2.  Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3.  Faça commit de suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4.  Faça push para a branch (`git push origin feature/nova-funcionalidade`).
5.  Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.