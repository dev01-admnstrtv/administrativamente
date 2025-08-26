'use client'

import * as React from 'react'
import Link from 'next/link'
import { Twitter, Linkedin, Mail, Rss } from 'lucide-react'

const footerLinks = {
  main: [
    { name: 'Início', href: '/' },
    { name: 'Categorias', href: '/categories' },
    { name: 'Autores', href: '/authors' },
    { name: 'Newsletter', href: '/newsletter' },
  ],
  categories: [
    { name: 'Gestão', href: '/category/gestao' },
    { name: 'Liderança', href: '/category/lideranca' },
    { name: 'Estratégia', href: '/category/estrategia' },
    { name: 'Tecnologia', href: '/category/tecnologia' },
  ],
  legal: [
    { name: 'Política de Privacidade', href: '/privacy' },
    { name: 'Termos de Uso', href: '/terms' },
    { name: 'Contato', href: '/contact' },
  ],
} as const

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/administrativa-mente',
    icon: Twitter,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/administrativa-mente',
    icon: Linkedin,
  },
  {
    name: 'Email',
    href: 'mailto:contato@administrativa-mente.com',
    icon: Mail,
  },
  {
    name: 'RSS',
    href: '/feed.xml',
    icon: Rss,
  },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='border-t border-border bg-muted/30'>
      <div className='container py-12'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Brand */}
          <div className='lg:col-span-1'>
            <Link
              href='/'
              className='flex items-center space-x-2 text-foreground hover:opacity-80 transition-opacity'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-serif font-bold text-lg'>
                A
              </div>
              <span className='font-serif text-xl font-bold'>
                Administrativa<span className='text-muted-foreground'>(mente)</span>
              </span>
            </Link>
            
            <p className='mt-4 text-sm text-muted-foreground max-w-xs'>
              Blog premium sobre gestão administrativa, liderança e estratégia 
              corporativa para executivos e gestores de alto nível.
            </p>

            {/* Social Links */}
            <div className='flex items-center space-x-4 mt-6'>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target={social.name !== 'Email' && social.name !== 'RSS' ? '_blank' : undefined}
                    rel={social.name !== 'Email' && social.name !== 'RSS' ? 'noopener noreferrer' : undefined}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                    aria-label={social.name}
                  >
                    <Icon className='h-5 w-5' />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className='grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3'>
            <div>
              <h3 className='text-sm font-semibold text-foreground'>
                Navegação
              </h3>
              <ul className='mt-4 space-y-3'>
                {footerLinks.main.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-foreground'>
                Categorias
              </h3>
              <ul className='mt-4 space-y-3'>
                {footerLinks.categories.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-foreground'>
                Legal
              </h3>
              <ul className='mt-4 space-y-3'>
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className='lg:col-span-1'>
            <h3 className='text-sm font-semibold text-foreground'>
              Newsletter Premium
            </h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Receba insights exclusivos sobre gestão e liderança.
            </p>
            
            <div className='mt-4'>
              <Link
                href='/newsletter'
                className='inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors'
              >
                Inscrever-se
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
          <p className='text-sm text-muted-foreground'>
            © {currentYear} Administrativa(mente). Todos os direitos reservados.
          </p>
          
          <div className='mt-4 sm:mt-0'>
            <p className='text-xs text-muted-foreground'>
              Desenvolvido com Next.js e Notion API
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}