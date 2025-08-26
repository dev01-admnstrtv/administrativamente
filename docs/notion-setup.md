# Configuração do Notion - Tutorial Completo

Este tutorial mostra como configurar as databases no Notion para o blog Administrativa(mente) conforme especificado no CLAUDE.md.

## 📋 Visão Geral

O blog utiliza 3 databases principais no Notion:
1. **Posts Database** - Conteúdo principal do blog
2. **Authors Database** - Informações dos autores (opcional)
3. **Categories Database** - Categorias dos posts (opcional)

## 🚀 Passo 1: Criar Integração do Notion

### 1.1 Criar Nova Integração
1. Acesse [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em **"+ New Integration"**
3. Preencha os dados:
   - **Name**: `Administrativa(mente) Blog`
   - **Associated workspace**: Selecione seu workspace
   - **Type**: `Internal`
4. Clique em **"Submit"**
5. **Copie o Integration Token** (começará com `secret_`)

### 1.2 Salvar Token no Environment
```bash
# .env.local
NOTION_TOKEN=secret_seu_token_aqui
```

## 📝 Passo 2: Database de Posts (Principal)

Esta é a database **obrigatória** onde ficará todo o conteúdo do blog.

### 2.1 Criar Database
1. No Notion, crie uma nova página
2. Digite `/database` e selecione **"Full page database"**
3. Nomeie como **"Blog Posts"**
4. Configure as seguintes propriedades:

### 2.2 Propriedades da Database Posts

| Propriedade | Tipo | Configuração | Obrigatório |
|-------------|------|--------------|-------------|
| **Title** | Title | (padrão) | ✅ Sim |
| **Slug** | Text | Único para cada post | ✅ Sim |
| **Status** | Select | `draft`, `published`, `archived` | ✅ Sim |
| **Published Date** | Date | Data de publicação | ✅ Sim |
| **Author** | Relation | → Authors Database | ❌ Opcional |
| **Category** | Select | Gestão, Liderança, Estratégia, etc. | ✅ Sim |
| **Tags** | Multi-select | Tags livres | ❌ Opcional |
| **Excerpt** | Text | Resumo do post | ✅ Sim |
| **Featured Image** | Files | Imagem de destaque | ❌ Opcional |
| **Content** | Text | (usa o corpo da página) | ✅ Sim |
| **SEO Title** | Text | Título otimizado para SEO | ❌ Opcional |
| **SEO Description** | Text | Meta description | ❌ Opcional |
| **Reading Time** | Number | Minutos de leitura | ❌ Opcional |
| **Featured** | Checkbox | Post em destaque | ❌ Opcional |

### 2.3 Configuração Detalhada das Propriedades

#### Status (Select)
Criar opções:
- `draft` (cor cinza)
- `published` (cor verde) 
- `archived` (cor vermelha)

#### Category (Select)
Baseado no CLAUDE.md, criar opções:
- `Gestão` (cor azul)
- `Liderança` (cor laranja)
- `Estratégia` (cor roxo)
- `Tecnologia` (cor verde)
- `Pessoas` (cor rosa)
- `Processos` (cor cinza)

#### Tags (Multi-select)
Algumas sugestões iniciais:
- `produtividade`
- `metodologia`
- `ferramentas`
- `soft-skills`
- `hard-skills`
- `casos-de-estudo`

### 2.4 Configurar Permissões
1. Na database, clique em **"..."** (três pontos)
2. Selecione **"Add connections"**
3. Encontre sua integração **"Administrativa(mente) Blog"**
4. Clique em **"Confirm"**

### 2.5 Copiar Database ID
1. Na database, clique em **"..."** → **"Copy link"**
2. O link terá formato: `https://notion.so/workspace/DATABASE_ID?v=...`
3. Copie o `DATABASE_ID` (32 caracteres)
4. Adicione no `.env.local`:

```bash
NOTION_DATABASE_ID=sua_database_id_aqui
```

## 👥 Passo 3: Database de Authors (Opcional)

Se você quer ter múltiplos autores com perfis detalhados:

### 3.1 Criar Database Authors
1. Crie nova página → Database
2. Nome: **"Authors"**

### 3.2 Propriedades Authors

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| **Name** | Title | Nome do autor |
| **Slug** | Text | URL slug do autor |
| **Bio** | Text | Biografia do autor |
| **Avatar** | Files | Foto do autor |
| **Role** | Text | Cargo/função |
| **Social Links** | Text | JSON com links sociais |

### 3.3 Exemplo Social Links (JSON)
```json
{
  "twitter": "https://twitter.com/usuario",
  "linkedin": "https://linkedin.com/in/usuario",
  "email": "usuario@email.com",
  "website": "https://website.com"
}
```

### 3.4 Conectar Authors à Posts
1. Na database Posts, vá na propriedade **Author**
2. Configure como **Relation** → selecione a database **Authors**
3. Configure permissões da database Authors para a integração

### 3.5 Salvar Database ID
```bash
NOTION_AUTHORS_DATABASE_ID=authors_database_id_aqui
```

## 🏷️ Passo 4: Database de Categories (Opcional)

Para categorias mais ricas com descrições e ícones:

### 4.1 Criar Database Categories
1. Crie nova página → Database  
2. Nome: **"Categories"**

### 4.2 Propriedades Categories

| Propriedade | Tipo | Configuração |
|-------------|------|--------------|
| **Name** | Title | Nome da categoria |
| **Slug** | Text | URL slug |
| **Description** | Text | Descrição da categoria |
| **Color** | Select | Cores do Notion |
| **Icon** | Text | Emoji ou ícone |

### 4.3 Dados Iniciais (baseado CLAUDE.md)

| Name | Slug | Description | Color | Icon |
|------|------|-------------|-------|------|
| Gestão | gestao | Processos administrativos, workflows | Blue | 📋 |
| Liderança | lideranca | Management, team building | Orange | 👥 |
| Estratégia | estrategia | Planejamento, business strategy | Purple | 🎯 |
| Tecnologia | tecnologia | Digital transformation, tools | Green | 💻 |
| Pessoas | pessoas | HR, cultura organizacional | Pink | 🤝 |
| Processos | processos | Otimização, automação | Gray | ⚙️ |

### 4.4 Salvar Database ID
```bash
NOTION_CATEGORIES_DATABASE_ID=categories_database_id_aqui
```

## ⚙️ Passo 5: Configuração Final

### 5.1 Arquivo .env.local Completo
```bash
# Notion API Configuration
NOTION_TOKEN=secret_seu_token_notion_aqui

# Main database (obrigatório)
NOTION_DATABASE_ID=posts_database_id_aqui

# Optional databases
NOTION_AUTHORS_DATABASE_ID=authors_database_id_aqui
NOTION_CATEGORIES_DATABASE_ID=categories_database_id_aqui

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Administrativa(mente)"

# Webhooks (opcional)
NOTION_WEBHOOK_SECRET=webhook_secret_aqui
REVALIDATE_SECRET=revalidate_secret_aqui
```

### 5.2 Testar Configuração
Execute o health check para verificar se tudo está funcionando:

```bash
npm run dev
curl http://localhost:3000/api/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "dataSources": {
    "notion": {
      "status": "healthy", 
      "databases": {
        "posts": true,
        "authors": true,
        "categories": true
      }
    }
  }
}
```

## 📝 Passo 6: Criar Conteúdo de Teste

### 6.1 Post de Exemplo
Na database Posts, criar uma nova página:

**Propriedades:**
- **Title**: `Como Implementar Gestão Ágil na sua Empresa`
- **Slug**: `gestao-agil-empresa`  
- **Status**: `published`
- **Published Date**: data atual
- **Category**: `Gestão`
- **Tags**: `metodologia`, `agilidade`
- **Excerpt**: `Descubra como implementar práticas ágeis que transformam a produtividade da sua equipe e aceleram resultados.`
- **Featured**: ✅ marcado

**Conteúdo da página:**
```markdown
# Introdução

A gestão ágil transformou a forma como empresas modernas operam...

## Por que Implementar?

1. **Maior produtividade**
2. **Flexibilidade nas mudanças** 
3. **Melhor comunicação da equipe**

## Passos para Implementação

### 1. Avaliação do Estado Atual
Antes de implementar qualquer metodologia...

### 2. Treinamento da Equipe
O sucesso da gestão ágil depende...

## Conclusão

A implementação da gestão ágil é um processo gradual...
```

### 6.2 Author de Exemplo (se usando Authors database)
Na database Authors:

- **Name**: `João Silva`
- **Slug**: `joao-silva`
- **Bio**: `Especialista em gestão empresarial com 15 anos de experiência ajudando empresas a otimizar processos e aumentar produtividade.`
- **Role**: `Consultor em Gestão`
- **Social Links**: `{"linkedin": "https://linkedin.com/in/joaosilva", "email": "joao@email.com"}`

## 🔄 Passo 7: Webhooks (Opcional)

Para revalidação automática quando conteúdo é atualizado:

### 7.1 Configurar Webhook no Notion
1. Nas configurações da integração no Notion
2. Adicionar webhook URL: `https://seudominio.com/api/webhook/notion`
3. Configurar eventos: `page.updated`, `page.created`

### 7.2 Configurar Secret
```bash
NOTION_WEBHOOK_SECRET=seu_webhook_secret_aqui
```

## ✅ Checklist Final

- [ ] Integração criada no Notion
- [ ] Token salvo no .env.local  
- [ ] Database Posts criada com todas as propriedades
- [ ] Permissões configuradas para a integração
- [ ] Database ID salvo no ambiente
- [ ] Authors database criada (opcional)
- [ ] Categories database criada (opcional)  
- [ ] Post de teste criado
- [ ] Health check retornando status healthy
- [ ] Webhook configurado (opcional)

## 🚨 Troubleshooting

### Erro: "object_not_found"
- Verifique se a database ID está correta
- Confirme se a integração tem permissão para acessar a database

### Erro: "unauthorized" 
- Verifique se o token está correto
- Confirme se o token não expirou

### Database não aparece no health check
- Verifique se todas as propriedades obrigatórias existem
- Confirme se os nomes das propriedades estão exatos (case-sensitive)

### Posts não aparecem no blog
- Verifique se o Status está como "published"
- Confirme se a Published Date não está no futuro
- Verifique se o Slug está preenchido e único

## 📚 Recursos Adicionais

- [Notion API Documentation](https://developers.notion.com/)
- [Database Properties Guide](https://developers.notion.com/reference/property-object)
- [Webhook Setup Guide](https://developers.notion.com/docs/create-a-notion-integration)

---

Com essa configuração, seu blog estará conectado ao Notion e pronto para receber conteúdo!