#!/usr/bin/env node

/**
 * Debug script para identificar problemas com Notion API
 */

const { Client } = require('@notionhq/client')
require('dotenv').config({ path: '.env.local' })

async function debugNotionConnection() {
  console.log('🔍 DIAGNÓSTICO DETALHADO DA CONEXÃO NOTION\n')
  
  // 1. Verificar variáveis de ambiente
  console.log('1. VERIFICANDO ENVIRONMENT VARIABLES:')
  const token = process.env.NOTION_TOKEN
  console.log(`Token length: ${token ? token.length : 'undefined'}`)
  console.log(`Token format: ${token ? (token.startsWith('secret_') ? '✅ Correto' : '❌ Formato inválido') : '❌ Não encontrado'}`)
  console.log(`Token preview: ${token ? token.substring(0, 20) + '...' : 'N/A'}\n`)
  
  if (!token) {
    console.log('❌ NOTION_TOKEN não encontrado')
    return
  }
  
  // 2. Testar diferentes formatos de token
  console.log('2. TESTANDO DIFERENTES FORMATOS DE TOKEN:\n')
  
  const testTokens = [
    { name: 'Token original', token: token },
    { name: 'Token sem prefixo secret_', token: token.replace('secret_', '') },
    { name: 'Token com ntn_', token: token.replace('secret_', 'secret_ntn_') }
  ]
  
  for (const test of testTokens) {
    console.log(`Testando: ${test.name}`)
    console.log(`Format: ${test.token.substring(0, 25)}...`)
    
    try {
      const notion = new Client({ auth: test.token })
      const response = await notion.users.me()
      console.log(`✅ SUCESSO! - ${test.name}`)
      console.log(`User: ${response.name || response.type || 'Integration'}`)
      console.log(`ID: ${response.id}\n`)
      break
    } catch (error) {
      console.log(`❌ FALHOU - ${error.message}\n`)
    }
  }
  
  // 3. Testar conectividade básica
  console.log('3. TESTANDO CONECTIVIDADE BÁSICA:\n')
  
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28'
      }
    })
    
    console.log(`Status HTTP: ${response.status}`)
    console.log(`Status Text: ${response.statusText}`)
    
    const data = await response.json()
    console.log('Response body:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.log('❌ Erro na requisição HTTP:', error.message)
  }
  
  // 4. Informações do ambiente
  console.log('\n4. INFORMAÇÕES DO AMBIENTE:')
  console.log(`Node version: ${process.version}`)
  console.log(`Platform: ${process.platform}`)
  console.log(`Working directory: ${process.cwd()}`)
  
  // 5. Verificar se .env.local está sendo carregado
  console.log('\n5. VERIFICANDO CARREGAMENTO .env.local:')
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`Outras vars carregadas: ${Object.keys(process.env).filter(k => k.startsWith('NOTION_')).length}`)
}

// Executar se for chamado diretamente
if (require.main === module) {
  debugNotionConnection().catch(error => {
    console.error('Erro no debug:', error)
  })
}