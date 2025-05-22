## 📋 Lista de Tarefas – Fullstack App

Aplicação web fullstack para gerenciamento de tarefas, que permite:

- ✅ Criar tarefas  
- ✅ Listar tarefas  
- ✅ Editar título, descrição ou status (pendente/concluída)  
- ✅ Excluir tarefas  
- ✅ Adicionar comentários às tarefas  

Desenvolvido com:

- 🐍 **Backend:** Flask + MongoDB  
- ⚛️ **Frontend:** React + Vite + TypeScript  

---

## 🚀 Tecnologias Utilizadas

### 🐍 Backend

- Python  
- Flask  
- Flask-CORS  
- PyMongo  
- MongoDB  

### ⚛️ Frontend

- React  
- Vite  
- TypeScript  
- CSS puro  

---

## 🗂️ Estrutura de Pastas

- 📦 Lista-De-Tarefas  
  - 📂backend → API Flask + MongoDB  
    - 📜app.py → API principal  
    - 📜db.py → Conexão com MongoDB  
    - 📜requirements.txt → Dependências Python  
  - 📂frontend → Interface React + Vite + TypeScript  
    - 📜package.json → Dependências Node  
    - 📜vite.config.ts → Configuração Vite  
    - 📜.env → Variáveis do frontend  
    - 📂src → Código fonte React  
  - 📜README.md → Documentação  

---

## ⚙️ Pré-requisitos

- Node.js (18 ou superior) → https://nodejs.org/  
- Python (3.9 ou superior) → https://python.org/  
- MongoDB local ou MongoDB Atlas rodando  

---

## 🔧 Instalação e Execução

### 🐍 Backend (API)

- Acesse a pasta backend:  
`cd backend`

- Instale as dependências:  
`pip install -r requirements.txt`

- A conexão com o MongoDB está definida diretamente no arquivo `db.py`:  
`client = MongoClient("mongodb://localhost:27017")`  

> Se estiver utilizando MongoDB Atlas, altere a URI acima.

- Execute o backend:  
`python app.py`

- O backend estará rodando em:  
http://127.0.0.1:5000  

---

### ⚛️ Frontend (Interface Web)

- Acesse a pasta frontend:  
`cd frontend`

- Instale as dependências:  
`npm install`  
ou  
`yarn`

- Crie um arquivo `.env` na pasta frontend com o seguinte conteúdo:  
`VITE_API_URL=http://127.0.0.1:5000`

> Modifique se estiver rodando o backend em outro endereço ou servidor.

- Execute o frontend:  
`npm run dev`  
ou  
`yarn dev`

- O frontend estará disponível no navegador em:  
http://localhost:5173  

---

## 🔗 Documentação da API

| Método | Rota                                  | Descrição                         |
|--------|----------------------------------------|------------------------------------|
| GET    | `/tarefas`                            | Listar todas as tarefas            |
| POST   | `/tarefas`                            | Criar nova tarefa                  |
| DELETE | `/tarefas/<tarefa_id>`                | Deletar tarefa                     |
| PATCH  | `/tarefas/<tarefa_id>`                | Editar título, descrição ou status |
| POST   | `/tarefas/<tarefa_id>/comment`        | Adicionar comentário               |

---

## 🗃️ Banco de Dados (MongoDB)

- URI padrão: `mongodb://localhost:27017`  
- Banco: `lista_de_tarefas`  
- Coleção: `tarefas`  

✔️ As collections são criadas automaticamente na primeira inserção de dados.

---

## 🐞 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir issues, enviar PRs, sugerir melhorias ou reportar bugs.

---

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 💻 Desenvolvido por

**Ítalo Guilherme**  
Ulbra Palmas – Engenharia de Software / Banco de Dados 2025/1 / Prof. Fábio Castro
https://github.com/italoglhrm  
