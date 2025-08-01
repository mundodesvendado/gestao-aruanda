# 🚀 Guia de Deploy - Gestão Aruanda

## Pré-requisitos

- [ ] Conta no Supabase
- [ ] Servidor web (Netlify, Vercel, ou VPS)
- [ ] Node.js 18+ instalado

## Passo 1: Configuração do Supabase

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima

### 1.2 Executar Migrations
```sql
-- Execute o arquivo: supabase/migrations/create_complete_schema.sql
-- No SQL Editor do Supabase
```

### 1.3 Configurar RLS
- As políticas RLS já estão incluídas nas migrations
- Verifique se todas as tabelas têm RLS habilitado

## Passo 2: Configuração do Ambiente

### 2.1 Variáveis de Ambiente
Crie o arquivo `.env.production`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/lV2nT9Y
```

### 2.2 Build da Aplicação
```bash
npm install
npm run build
```

## Passo 3: Deploy

### Opção A: Netlify
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

### Opção B: Vercel
1. Importe o projeto
2. Configure as variáveis de ambiente
3. Deploy automático

### Opção C: VPS
1. Faça upload da pasta `dist`
2. Configure nginx/apache
3. Configure SSL

## Passo 4: Configuração Inicial

### 4.1 Usuário Master
- Email: admin@gestaoaruanda.com.br
- Senha: 123@mudar (altere imediatamente)

### 4.2 Primeiro Templo
1. Faça login como master admin
2. Crie o primeiro templo
3. Defina um administrador

## Passo 5: Testes

- [ ] Login master admin
- [ ] Criação de templo
- [ ] Cadastro de usuário
- [ ] Aprovação de usuário
- [ ] Funcionalidades básicas

## Suporte

Para suporte técnico:
- Email: suporte@gestaoaruanda.com.br
- Documentação: [link-da-documentacao]

## Checklist de Deploy

- [ ] Supabase configurado
- [ ] Migrations executadas
- [ ] Variáveis de ambiente configuradas
- [ ] Build realizado com sucesso
- [ ] Deploy realizado
- [ ] Testes básicos executados
- [ ] Usuário master configurado
- [ ] Primeiro templo criado
- [ ] Sistema funcionando em produção