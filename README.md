# Controle de Gastos Residenciais

Sistema de controle de despesas e receitas financeiras focado no ambiente residencial. Desenvolvido utilizando **.NET (C#)** no Back-End e **React (TypeScript)** no Front-End.

## Tecnologias Utilizadas

- **Back-End:** .NET 10, C#, ASP.NET Core Web API, Entity Framework Core, SQLite.
- **Front-End:** React, TypeScript, Vite, Axios.

## Regras de Negócio Implementadas

- **Pessoas:** Criação, listagem e deleção. (Exclusão em cascata: deletar a pessoa apaga automaticamente todas as suas transações vinculadas).
- **Transações:** Criação e listagem de transações.
- **Restrição de Idade:** Pessoas menores de 18 anos só podem registrar despesas, sendo bloqueadas de registrar receitas.
- **Dashboard:** Consulta com totais de receitas, despesas e saldo líquido por pessoa, além de exibir o total geral.

---

## Como executar o projeto localmente (Primeiro acesso)

Você precisará instalar o [.NET SDK](https://dotnet.microsoft.com/download) e o [Node.js](https://nodejs.org/) caso já não estejam instalados sua máquina.

Para realizar o teste e saber se já estão instalados, abra o terminal e digite o seguinte comando
Para o [.NET]:

```
dotnet --version
```

Para o Node.js e o gerenciador de pacotes (npm):

```
node -v
npm -v

```

### 1. Back-End (.NET API)

Abra o terminal, acesse a pasta da API e execute os comandos:

```bash
cd ControleGastosApi

# Instale a ferramenta do Entity Framework caso ainda não tenha
dotnet tool install --global dotnet-ef

# Crie o banco de dados e aplique as tabelas
dotnet ef database update

# Inicie o servidor
dotnet run
```

_A API ficará disponível no endereço local indicado no terminal (geralmente o endereço é `http://localhost:5242`)._

### 2. Front-End (React)

Abra um **segundo terminal**, acesse a pasta do front-end e execute através comandos:

```bash
cd controle-gastos-front

# Instale as dependências
npm install

# Inicie o projeto
npm run dev
```

_Acesse o sistema pelo navegador através do link gerado (geralmente `http://localhost:5173`)._

---

## Como executar o projeto localmente (Após o primeiro acesso)

### 1. Back-End (.NET API)

Abra o terminal, acesse a pasta da API executando os comandos:

```bash
cd ControleGastosApi

# Inicie o servidor
dotnet run
```

### 2. Front-End (React)

Abra um **segundo terminal**, acesse a pasta do front-end e execute através comandos:

```bash
cd controle-gastos-front

# Inicie o projeto
npm run dev
```

_Acesse o sistema pelo navegador através do link gerado (geralmente `http://localhost:5173`)._

## Estrutura do Banco de Dados

Os dados são salvos em um arquivo local do SQLite (`banco.db`), gerado automaticamente. O sistema é baseado nas seguintes entidades:

- **Pessoa:** `Id` (Inteiro), `Nome` (Texto), `Idade` (Inteiro).
- **Transacao:** `Id` (Inteiro), `Descricao` (Texto), `Valor` (Decimal), `Tipo` (0 = Despesa, 1 = Receita), `PessoaId` (Inteiro - Chave Estrangeira).

---

_Desenvolvido por Matheus Humberto Corrêa Pena._
