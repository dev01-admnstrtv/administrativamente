#!/usr/bin/env node

/**
 * Teste específico para validar token do Notion
 */

const { Client } = require('@notionhq/client')
require('dotenv').config({ path: '.env.local' })

async function testToken() {
  console.log('🔍 TESTE ESPECÍFICO DO TOKEN NOTION\n')
  
  const token = process.env.NOTION_TOKEN
  
  console.log('TOKEN DETAILS:')
  console.log(`Length: ${token.length}`)
  console.log(`First 20 chars: ${token.substring(0, 20)}`)
  console.log(`Last 10 chars: ...${token.substring(token.length - 10)}`)
  console.log(`Contains spaces: ${token.includes(' ') ? 'YES (PROBLEMA!)' : 'NO'}`)
  console.log(`Contains line breaks: ${token.includes('\n') || token.includes('\r') ? 'YES (PROBLEMA!)' : 'NO'}`)
  console.log(`Exact format: "${token}"\n`)
  
  // Teste com diferentes versões da API
  const apiVersions = ['2022-06-28', '2022-02-22', '2021-08-16']
  
  for (const version of apiVersions) {
    console.log(`Testando com Notion-Version: ${version}`)
    
    try {
      const notion = new Client({ 
        auth: token,
        notionVersion: version
      })
      
      const response = await notion.users.me()
      console.log(`✅ SUCESSO com versão ${version}!`)
      console.log(`User: ${response.name || response.type}`)
      console.log(`ID: ${response.id}\n`)
      return true
      
    } catch (error) {
      console.log(`❌ Falhou com versão ${version}: ${error.message}`)
    }
  }
  
  // Teste com curl-like request
  console.log('\nTESTE MANUAL COM FETCH:')
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`Status: ${response.status}`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ SUCESSO com fetch manual!')
      console.log('User data:', data)
    } else {
      console.log('❌ Erro com fetch manual:')
      console.log('Response:', JSON.stringify(data, null, 2))
    }
    
  } catch (error) {
    console.log('❌ Erro na requisição fetch:', error.message)
  }
  
  return false
}

testToken().then(success => {
  if (!success) {
    console.log('\n🚨 POSSÍVEIS SOLUÇÕES:')
    console.log('1. Copie o token novamente do Notion (pode ter espaços extras)')
    console.log('2. Verifique se a integração tem as permissões corretas')
    console.log('3. Tente criar uma nova integração')
    console.log('4. Verifique se está no workspace correto')
  }
})