import { NextResponse } from 'next/server'
import { checkDataHealth } from '@/lib/api/data'
import { CacheManager } from '@/lib/cache'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Check data sources
    const dataHealth = await checkDataHealth()
    
    // Check cache
    const cache = CacheManager.getInstance()
    const cacheStats = cache.getStats()
    
    const responseTime = Date.now() - startTime
    
    // Determine overall health
    const isHealthy = dataHealth.notion && dataHealth.posts
    const status = isHealthy ? 'healthy' : 'degraded'
    
    const healthData = {
      status,
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
      
      // Data sources
      dataSources: {
        notion: {
          status: dataHealth.notion ? 'healthy' : 'error',
          databases: {
            posts: dataHealth.posts,
            categories: dataHealth.categories,
            authors: dataHealth.authors
          },
          errors: dataHealth.errors
        }
      },
      
      // Cache info
      cache: {
        status: 'healthy',
        stats: {
          totalEntries: cacheStats.totalEntries,
          expiredEntries: cacheStats.expiredEntries,
          totalSizeKB: Math.round(cacheStats.totalSizeBytes / 1024)
        }
      },
      
      // Environment info
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasMainDatabase: !!process.env.NOTION_DATABASE_ID,
        hasWebhookSecret: !!process.env.NOTION_WEBHOOK_SECRET
      },
      
      // System info
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      }
    }
    
    const statusCode = isHealthy ? 200 : 503
    
    return NextResponse.json(healthData, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

// Simple ping endpoint
export async function HEAD() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache'
    }
  })
}