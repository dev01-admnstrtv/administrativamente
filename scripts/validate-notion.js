#!/usr/bin/env node

/**
 * Script para validar configuração do Notion
 * Execute: node scripts/validate-notion.js
 */

const { Client } = require('@notionhq/client')
require('dotenv').config({ path: '.env.local' })

// Cores para output no terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'bold')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// Propriedades obrigatórias para cada database
const REQUIRED_PROPERTIES = {
  posts: {
    'Title': 'title',
    'Slug': 'rich_text',
    'Status': 'select',
    'Published Date': 'date',
    'Author': 'relation',
    'Category': 'select',
    'Excerpt': 'rich_text',
    'Featured Image': 'files'
  },
  authors: {
    'Name': 'title',
    'Slug': 'rich_text',
    'Bio': 'rich_text',
    'Role': 'rich_text'
  },
  categories: {
    'Name': 'title',
    'Slug': 'rich_text',
    'Description': 'rich_text',
    'Color': 'select'
  }
}

async function validateEnvironment() {
  logStep(1, 'Validando variáveis de ambiente')
  
  const token = process.env.NOTION_TOKEN
  const mainDb = process.env.NOTION_DATABASE_ID
  const postsDb = process.env.NOTION_POSTS_DATABASE_ID
  const authorsDb = process.env.NOTION_AUTHORS_DATABASE_ID
  const categoriesDb = process.env.NOTION_CATEGORIES_DATABASE_ID
  
  if (!token) {
    logError('NOTION_TOKEN não encontrado no .env.local')
    return false
  }
  
  if (!token.startsWith('secret_') && !token.startsWith('ntn_')) {
    logError('NOTION_TOKEN deve começar com "secret_" ou "ntn_"')
    return false
  }
  
  logSuccess(`Token encontrado: ${token.substring(0, 15)}...`)
  
  if (!mainDb && !postsDb) {
    logError('NOTION_DATABASE_ID ou NOTION_POSTS_DATABASE_ID é obrigatório')
    return false
  }
  
  const postsDatabase = mainDb || postsDb
  logSuccess(`Posts Database ID: ${postsDatabase}`)
  
  if (authorsDb) {
    logInfo(`Authors Database ID: ${authorsDb}`)
  } else {
    logWarning('Authors Database não configurado (opcional)')
  }
  
  if (categoriesDb) {
    logInfo(`Categories Database ID: ${categoriesDb}`)
  } else {
    logWarning('Categories Database não configurado (opcional)')
  }
  
  return {
    token,
    databases: {
      posts: postsDatabase,
      authors: authorsDb,
      categories: categoriesDb
    }
  }
}

async function validateConnection(token) {
  logStep(2, 'Testando conexão com Notion API')
  
  // Tentar diferentes formatos de token
  const tokenVariations = [
    token, // formato original
    token.startsWith('secret_') ? token : `secret_${token}`, // adicionar secret_ se não tiver
    token.startsWith('ntn_') ? `secret_${token}` : token // converter ntn_ para secret_ntn_
  ]
  
  for (const testToken of tokenVariations) {
    try {
      const notion = new Client({ auth: testToken })
      const user = await notion.users.me()
      logSuccess(`Conectado como: ${user.name || 'Integration'}`)
      logInfo(`Token usado: ${testToken.substring(0, 15)}...`)
      return { success: true, workingToken: testToken, notion }
    } catch (error) {
      logWarning(`Falhou com token ${testToken.substring(0, 15)}...: ${error.message}`)
    }
  }
  
  logError('Falha na conexão com todos os formatos de token testados')
  return { success: false }
}

async function validateDatabase(notion, databaseId, name, required = true) {
  logStep(`3.${name}`, `Validando database ${name}`)
  
  if (!databaseId) {
    if (required) {
      logError(`Database ${name} não configurado`)
      return false
    } else {
      logWarning(`Database ${name} não configurado (opcional)`)
      return true
    }
  }
  
  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId
    })
    
    logSuccess(`Database encontrado: ${database.title[0]?.plain_text || 'Sem título'}`)
    
    // Validar propriedades
    const requiredProps = REQUIRED_PROPERTIES[name.toLowerCase()]
    if (requiredProps) {
      logInfo(`Validando propriedades obrigatórias:`)
      
      let missingProps = []
      for (const [propName, propType] of Object.entries(requiredProps)) {
        const property = database.properties[propName]
        
        if (!property) {
          logError(`  ❌ Propriedade "${propName}" não encontrada`)
          missingProps.push(propName)
        } else if (property.type !== propType) {
          logError(`  ❌ Propriedade "${propName}" deveria ser "${propType}", mas é "${property.type}"`)
          missingProps.push(propName)
        } else {
          logSuccess(`  ✅ ${propName} (${propType})`)
        }
      }
      
      if (missingProps.length > 0) {
        logError(`Database ${name} está faltando propriedades obrigatórias: ${missingProps.join(', ')}`)
        return false
      }
    }
    
    // Testar acesso aos dados
    const pages = await notion.databases.query({
      database_id: databaseId,
      page_size: 1
    })
    
    logInfo(`Database contém ${pages.results.length > 0 ? 'ao menos 1' : '0'} registro(s)`)
    
    return true
  } catch (error) {
    if (error.code === 'object_not_found') {
      logError(`Database ${name} não encontrado. Verifique o ID: ${databaseId}`)
    } else if (error.code === 'unauthorized') {
      logError(`Sem permissão para acessar database ${name}. Configure as permissões na integração.`)
    } else {
      logError(`Erro ao acessar database ${name}: ${error.message}`)
    }
    return false
  }
}

async function validatePostsContent(notion, databaseId) {
  logStep(4, 'Validando conteúdo dos posts')
  
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'published'
        }
      },
      page_size: 5
    })
    
    const publishedPosts = response.results
    
    if (publishedPosts.length === 0) {
      logWarning('Nenhum post publicado encontrado')
      logInfo('Crie pelo menos um post com Status = "published" para testar o blog')
      return true
    }
    
    logSuccess(`${publishedPosts.length} post(s) publicado(s) encontrado(s)`)
    
    // Validar primeiro post
    const firstPost = publishedPosts[0]
    const props = firstPost.properties
    
    logInfo('Validando primeiro post:')
    
    const title = props.Title?.title?.[0]?.plain_text
    const slug = props.Slug?.rich_text?.[0]?.plain_text
    const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text
    const category = props.Category?.select?.name
    
    if (!title) logWarning('  Título não preenchido')
    else logSuccess(`  Título: ${title}`)
    
    if (!slug) logWarning('  Slug não preenchido')
    else logSuccess(`  Slug: ${slug}`)
    
    if (!excerpt) logWarning('  Excerpt não preenchido')
    else logSuccess(`  Excerpt: ${excerpt.substring(0, 50)}...`)
    
    if (!category) logWarning('  Categoria não selecionada')
    else logSuccess(`  Categoria: ${category}`)
    
    return true
  } catch (error) {
    logError(`Erro ao validar conteúdo: ${error.message}`)
    return false
  }
}

async function generateSummary(results) {
  logStep(5, 'Resumo da Validação')
  
  const { connection, databases } = results
  
  if (connection && databases.posts) {
    logSuccess('✅ Configuração válida! O blog está pronto para funcionar.')
    
    if (databases.authors && databases.categories) {
      logInfo('📚 Configuração completa com Authors e Categories')
    } else if (databases.authors || databases.categories) {
      logInfo('📖 Configuração parcial - algumas databases opcionais não estão configuradas')
    } else {
      logInfo('📄 Configuração básica - usando apenas Posts database')
    }
    
    log('\n🚀 Próximos passos:')
    log('1. Execute "npm run dev" para iniciar o blog')
    log('2. Acesse http://localhost:3000 para ver o resultado')
    log('3. Teste o health check: http://localhost:3000/api/health')
    
  } else {
    logError('❌ Configuração inválida. Corrija os erros acima.')
    
    log('\n🔧 Para corrigir:')
    log('1. Verifique o tutorial em docs/notion-setup.md')
    log('2. Confirme as permissões da integração')
    log('3. Valide os IDs das databases')
  }
}

async function main() {
  log(`${colors.bold}${colors.blue}`)
  log('==========================================')
  log('    VALIDADOR DE CONFIGURAÇÃO NOTION')
  log('    Administrativa(mente) Blog')
  log('==========================================')
  log(`${colors.reset}`)
  
  try {
    // 1. Validar environment
    const env = await validateEnvironment()
    if (!env) {
      process.exit(1)
    }
    
    // 2. Testar conexão
    const connectionResult = await validateConnection(env.token)
    if (!connectionResult.success) {
      process.exit(1)
    }
    
    const notion = connectionResult.notion
    
    // 3. Validar databases
    const postsValid = await validateDatabase(notion, env.databases.posts, 'Posts', true)
    const authorsValid = await validateDatabase(notion, env.databases.authors, 'Authors', false)
    const categoriesValid = await validateDatabase(notion, env.databases.categories, 'Categories', false)
    
    if (!postsValid) {
      logError('Database Posts é obrigatória. Corrija os erros acima.')
      process.exit(1)
    }
    
    // 4. Validar conteúdo
    if (postsValid) {
      await validatePostsContent(notion, env.databases.posts)
    }
    
    // 5. Gerar resumo
    await generateSummary({
      connection: connectionResult.success,
      databases: {
        posts: postsValid,
        authors: authorsValid,
        categories: categoriesValid
      }
    })
    
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`)
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { validateEnvironment, validateConnection, validateDatabase }