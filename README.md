# CampusMarket UFERSA

## Objetivo do Sistema

O CampusMarket UFERSA é uma plataforma web desenvolvida para facilitar a compra, venda e divulgação de produtos e serviços entre estudantes da Universidade Federal Rural do Semi-Árido (UFERSA). O sistema tem como objetivo proporcionar mais organização, praticidade e segurança nas negociações realizadas dentro da comunidade acadêmica, centralizando as ofertas em um único ambiente digital.

---

## Descrição do Problema

Atualmente, a compra, venda e divulgação de produtos e serviços entre estudantes, professores e servidores da UFERSA ocorre de forma descentralizada, principalmente por meio de redes sociais e aplicativos de mensagens.

Esse modelo apresenta diversos problemas, como:

* Falta de organização dos anúncios;
* Dificuldade para localizar produtos ou serviços específicos;
* Baixa visibilidade das ofertas;
* Ausência de um ambiente seguro para negociações;
* Comunicação não estruturada entre compradores e vendedores;
* Risco de golpes e informações falsas.

Além disso, a inexistência de uma plataforma oficial para esse tipo de atividade faz com que as negociações dependam de meios informais, reduzindo a eficiência das transações e dificultando o gerenciamento das ofertas disponíveis.

O CampusMarket surge como uma solução para centralizar essas interações em uma única plataforma, proporcionando uma melhor experiência aos usuários e fortalecendo o comércio dentro da comunidade universitária.

---

## Principais Funcionalidades

* Cadastro e autenticação de usuários;
* Publicação de anúncios de produtos e serviços;
* Pesquisa e filtragem de anúncios;
* Visualização detalhada dos produtos anunciados;
* Comunicação entre compradores e vendedores;
* Sistema de favoritos;
* Gerenciamento de anúncios pelo usuário;
* Avaliação de vendedores;
* Organização centralizada das ofertas da comunidade acadêmica.

---

## Tecnologias Utilizadas

### Desenvolvimento

* C#
* ASP.NET Core
* HTML
* CSS
* TypeScript

### Banco de Dados

* SQLite (utilizado na versão atual do projeto)
* Planejamento futuro de migração para um banco de dados mais robusto

### Prototipação

* Figma

### Controle de Versão

* Git
* GitHub

---

## Estrutura do Projeto

```text
campusmarket
│
├── README.md
├── CampusMarket.API
│
├── Front-end
│
├── prototype/
│
└── .gitignore
```

---

## Instruções de Execução

### Pré-requisitos

* .NET 8 SDK
* Node.js (versão 20 ou superior)
* npm
* Git

### Clonando o Projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd campusmarket
```

### Configurando o Banco de Dados

Acesse a pasta da API:

```bash
cd CampusMarket.API
```

Execute as migrations para criar o banco SQLite:

```bash
dotnet ef database update
```

### Executando o Backend

Na pasta `CampusMarket.API`:

```bash
dotnet restore
dotnet run
```

Após executar o backend, a API estará disponível no endereço exibido pelo ASP.NET Core no terminal.

Exemplo:

http://localhost:5112

### Executando o Frontend

Abra um novo terminal e acesse a pasta do frontend:

```bash
cd Front-end
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

Após executar o comando `npm run dev`, o Vite exibirá no terminal o endereço de acesso da aplicação.

Exemplo:

http://localhost:5173

### Acessando o Sistema

Com o backend e o frontend em execução, acesse no navegador o endereço exibido pelo Vite no terminal.

Exemplo:

```text
http://localhost:5173
```
Caso a porta esteja ocupada, o Vite poderá utilizar outra porta automaticamente.

### Observações

* O projeto utiliza SQLite como banco de dados durante o desenvolvimento.
* O banco é criado automaticamente após a execução das migrations.
* É necessário que o backend esteja em execução para que o frontend consiga carregar os dados.


## Link do Protótipo

Protótipo desenvolvido no Figma:

**https://www.figma.com/design/4KbeRADorgdF2fAvLomkhJ/CampusMarket?node-id=17-5278&t=V10cnCAymkRf6GaJ-1**

---

## Integrantes da Equipe

* Cláudio Felipe Lopes da Silva
* Igor Cavalcante Rocha
* Moisés Guilherme Silva Fernandes
* Servolo Pedro da Silva

---

## Status Atual do Desenvolvimento

O projeto encontra-se em fase de desenvolvimento do MVP (Minimum Viable Product). Atualmente estão sendo implementadas as funcionalidades essenciais da plataforma, incluindo cadastro de usuários, autenticação, gerenciamento de anúncios e estrutura inicial do marketplace.

O banco de dados utilizado nesta etapa é o SQLite, escolhido por sua simplicidade e facilidade de configuração durante o desenvolvimento. Em versões futuras, está prevista a migração para uma solução de banco de dados mais robusta, visando maior escalabilidade e desempenho.

As telas da aplicação foram prototipadas utilizando o Figma, servindo como base para a implementação da interface do sistema.
