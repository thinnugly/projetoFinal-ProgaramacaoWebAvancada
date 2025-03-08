# Projeto Final - Um sistema de gestão de tarefas, utilizadores, comentários e notificações, para facilitar o acompanhamento de atividades no ambiente organizacional, garantindo que os utilizadores estejam informados sobre alterações importantes, como atribuição de tarefas, alterações no estado das mesmas ou adição de comentários.
**Autor**: Renato Madeia Muiambo
**Email**: renatomuiambo24@gmail.com
## 📌 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:  

- [Node.js](https://nodejs.org/) (versão 18 ou superior)  
- [Vue 3](https://vuejs.org/)  
- Git (opcional)  

---

## 🔧 Como Rodar a Aplicação  
### 🖥️ Backend (Node.js + Express)
1️⃣ **Instalar o Node.js** (se ainda não tiver instalado)  
   - No Windows: [Baixe e instale](https://nodejs.org/)  
   - No Linux/macOS: Execute no terminal:  
     ```sh
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

2️⃣ No diretório do backend (server), instalar as dependências:  

```sh
npm install
```
3️⃣ Criar um arquivo .env e configurar as seguintes variáveis de ambiente:
```sh
PORT=
MONGO_URI=
```
4️⃣ Rodar o backend:
```sh
npm run start 
```

** Localmente o backend será iniciado em http://localhost:3000/
Backend em produção: https://projetofinal-progaramacaowebavancada.onrender.com
Documentação da API: https://projetofinal-progaramacaowebavancada.onrender.com/api-docs **

### Gerenciamento de usuários

O sistema permite a criação e gerenciamento de usuários do tipo "Employee". Apenas um usuário administrador pode criar usuários de qualquer tipo e associá-los a tarefas. Um administrador é criado automaticamente na primeira execução da aplicação, caso ainda não exista.

** Credenciais do Administrador Padrão **:

- Username: renatomuiambo24@admin.com

- Password: admin@admin

### 🎨 Frontend (Vue)
1️⃣ **Instalar o Vue ** (se ainda não tiver instalado):
  - No Windows/Linux/macOS: Execute:
     ```sh
     npm create vue@latest
     ```
2️⃣ No diretório do frontend (client), instalar as dependências:
```sh
npm install
```
3️⃣ Criar um arquivo .env e configurar as seguintes variáveis de ambiente:
```sh
BASE_URL=/app/
```
4️⃣ Rodar o frontend:
```sh
npm run serve 
```
** Localmente frontend será iniciado em http://localhost:8080/
Frontend em produção: https://taskmanagement-rmm-devwn.netlify.app **
