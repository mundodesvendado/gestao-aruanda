# Gestão Aruanda - Sistema SaaS para Templos de Umbanda

Sistema completo de gerenciamento para templos de Umbanda, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Autenticação Segura**: Sistema completo de login, cadastro e recuperação de senha com 2FA
- **Gestão de Médiuns**: Cadastro completo com categorização e controle de status
- **Sistema Financeiro**: Controle de receitas, despesas e fornecedores
- **Calendário de Eventos**: Agendamento de giras, reuniões e cerimônias
- **Relatórios Avançados**: Exportação em Excel e PDF
- **Notificações Internas**: Sistema de comunicação entre administradores e médiuns
- **Sistema de Assinaturas**: Período de teste de 14 dias + cobrança mensal
- **Multi-tenant**: Suporte a múltiplos templos
- **Temas**: Modo claro e escuro
- **Responsivo**: Interface adaptada para desktop e mobile

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Exportação**: XLSX + jsPDF
- **Build**: Vite

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (para produção)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd gestao-aruanda
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Configure as variáveis do Supabase no arquivo .env
```

4. Configure o Supabase:
```bash
# Execute as migrations SQL no seu projeto Supabase
# Arquivo: supabase/migrations/create_complete_schema.sql
```

5. Execute em desenvolvimento:
```bash
npm run dev
```

6. Para produção:
```bash
npm run build
npm run preview
```

## 🌐 Implantação em VPS

### Configuração do Servidor

1. **Instale Node.js 18+**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Instale PM2** (gerenciador de processos):
```bash
sudo npm install -g pm2
```

3. **Configure Nginx** (proxy reverso):
```bash
sudo apt install nginx
```

### Deploy da Aplicação

1. **Clone e configure**:
```bash
git clone <repository-url> /var/www/gestao-aruanda
cd /var/www/gestao-aruanda
npm install
npm run build
```

2. **Configure PM2**:
```bash
pm2 start npm --name "gestao-aruanda" -- run start
pm2 save
pm2 startup
```

3. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL com Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🔐 Configuração de Segurança

### Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Backup Automático
```bash
# Adicione ao crontab
0 2 * * * /usr/bin/rsync -av /var/www/gestao-aruanda/ /backup/gestao-aruanda/
```

## 📊 Monitoramento

### Logs da Aplicação
```bash
pm2 logs gestao-aruanda
```

### Status do Sistema
```bash
pm2 status
pm2 monit
```

## 🔧 Manutenção

### Atualização
```bash
cd /var/www/gestao-aruanda
git pull origin main
npm install
npm run build
pm2 restart gestao-aruanda
```

### Backup de Dados
```bash
# Os dados são armazenados no localStorage do navegador
# Para backup em produção, implemente integração com banco de dados
```

## 📱 Uso do Sistema

### Primeiro Acesso
1. **Administrador Master**: admin@gestaoaruanda.com.br / 123@mudar
2. Crie templos e administradores via painel master
3. Administradores de templo podem cadastrar médiuns e usuários
4. Período de teste de 14 dias para cada templo
5. Após o teste, ativação via link de pagamento

### Funcionalidades Principais
- **Dashboard**: Visão geral com métricas e aniversariantes
- **Médiuns**: Cadastro completo com endereço e categorização
- **Fornecedores**: Gestão de fornecedores para controle financeiro
- **Financeiro**: Receitas, despesas e relatórios
- **Eventos**: Calendário com diferentes tipos de eventos
- **Relatórios**: Exportação em Excel e PDF
- **Configurações**: Perfil, dados do templo, cobrança e segurança

### Níveis de Acesso
- **Master Admin**: Acesso total, gerencia templos e administradores
- **Admin Templo**: Gerencia seu templo, médiuns e dados
- **Usuário/Médium**: Acesso de leitura e edição do próprio perfil

### Sistema de Cobrança
- **Período de Teste**: 14 dias gratuitos
- **Assinatura Mensal**: R$ 47,00 via Kiwify
- **Controle Automático**: Sistema monitora status da assinatura

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre o sistema, consulte a documentação interna ou entre em contato com o administrador do sistema.

## 📄 Licença

Sistema desenvolvido especificamente para templos de Umbanda. Todos os direitos reservados.