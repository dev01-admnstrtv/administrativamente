import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Apple-inspired premium palette
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          muted: 'hsl(var(--foreground-muted))',
        },
        // Premium zinc/slate palette inspired by Apple
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5', 
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        // Surface colors for glassmorphism
        surface: {
          primary: 'hsl(var(--surface-primary))',
          secondary: 'hsl(var(--surface-secondary))',
          tertiary: 'hsl(var(--surface-tertiary))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'SF Pro Display', 'system-ui', 'sans-serif'],
        serif: ['var(--font-charter)', 'New York', 'Georgia Pro', 'serif'],
        mono: ['SF Mono', 'JetBrains Mono Variable', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
      },
      scale: {
        '98': '0.98',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
        'screen-2xl': '1536px',
      },
      minHeight: {
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-down': 'fadeDown 0.5s ease-out',
        'fade-left': 'fadeLeft 0.5s ease-out',
        'fade-right': 'fadeRight 0.5s ease-out',
        
        // Scale animations
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'scale-pulse': 'scalePulse 2s ease-in-out infinite',
        
        // Slide animations
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        
        // Apple-inspired animations
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        
        // Interactive animations
        'press': 'press 0.1s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        // Fade keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        fadeDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        fadeLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        fadeRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        
        // Scale keyframes
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        scaleOut: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        
        // Slide keyframes
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        slideRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        
        // Apple-inspired keyframes
        bounceGentle: {
          '0%': { transform: 'translateY(-3px)' },
          '50%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        
        // Interactive keyframes
        press: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            lineHeight: '1.7',
            color: 'hsl(var(--foreground))',
            fontFamily: 'var(--font-charter), Charter, "New York", Georgia Pro, Georgia, serif',
            
            // Typography scale
            fontSize: '1.125rem', // 18px base for better readability
            
            // Headings
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'var(--font-charter), Charter, "New York", Georgia Pro, Georgia, serif',
              fontWeight: '700',
              color: 'hsl(var(--foreground))',
              lineHeight: '1.2',
              letterSpacing: '-0.025em',
            },
            
            h1: {
              fontSize: '2.5rem',
              fontWeight: '800',
              marginTop: '0',
              marginBottom: '1rem',
            },
            
            h2: {
              fontSize: '2rem',
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            
            h4: {
              fontSize: '1.25rem',
              fontWeight: '600',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            
            // Paragraphs and text
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              lineHeight: '1.8',
            },
            
            '[class~="lead"]': {
              color: 'hsl(var(--foreground-muted))',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            
            // Links
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderBottomColor: 'hsl(var(--primary))',
                textDecoration: 'none',
              },
            },
            
            // Emphasis
            strong: {
              color: 'hsl(var(--foreground))',
              fontWeight: '700',
            },
            
            em: {
              fontStyle: 'italic',
              color: 'hsl(var(--foreground-muted))',
            },
            
            // Lists
            'ul, ol': {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.5rem',
            },
            
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              lineHeight: '1.7',
            },
            
            // Code
            code: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.375rem',
              fontSize: '0.875em',
              fontWeight: '600',
              fontFamily: 'SF Mono, JetBrains Mono Variable, Consolas, monospace',
            },
            
            'code::before': {
              content: '""',
            },
            
            'code::after': {
              content: '""',
            },
            
            pre: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.7',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            
            'pre code': {
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              fontSize: 'inherit',
              color: 'inherit',
              borderRadius: '0',
            },
            
            // Blockquotes
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: 'hsl(var(--foreground-muted))',
              borderLeftWidth: '4px',
              borderLeftColor: 'hsl(var(--border))',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '2rem',
              marginBottom: '2rem',
              paddingLeft: '1.5rem',
              fontSize: '1.1em',
              lineHeight: '1.6',
            },
            
            'blockquote p:first-of-type::before': {
              content: 'open-quote',
            },
            
            'blockquote p:last-of-type::after': {
              content: 'close-quote',
            },
            
            // Tables
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
            },
            
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'hsl(var(--border))',
            },
            
            'thead th': {
              color: 'hsl(var(--foreground))',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '0.75rem',
            },
            
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'hsl(var(--border))',
            },
            
            'tbody td': {
              verticalAlign: 'baseline',
              paddingTop: '0.75rem',
              paddingRight: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '0.75rem',
            },
            
            // Images
            img: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderRadius: '0.75rem',
            },
            
            // Horizontal rules
            hr: {
              borderColor: 'hsl(var(--border))',
              borderTopWidth: '1px',
              marginTop: '3rem',
              marginBottom: '3rem',
            },
          },
        },
        
        // Additional typography sizes
        sm: {
          css: {
            fontSize: '0.875rem',
            lineHeight: '1.6',
            
            h1: {
              fontSize: '2rem',
            },
            h2: {
              fontSize: '1.5rem',
            },
            h3: {
              fontSize: '1.25rem',
            },
            h4: {
              fontSize: '1.125rem',
            },
          },
        },
        
        lg: {
          css: {
            fontSize: '1.25rem',
            lineHeight: '1.8',
            
            h1: {
              fontSize: '3rem',
            },
            h2: {
              fontSize: '2.25rem',
            },
            h3: {
              fontSize: '1.75rem',
            },
            h4: {
              fontSize: '1.375rem',
            },
          },
        },
        
        xl: {
          css: {
            fontSize: '1.375rem',
            lineHeight: '1.8',
            
            h1: {
              fontSize: '3.5rem',
            },
            h2: {
              fontSize: '2.75rem',
            },
            h3: {
              fontSize: '2rem',
            },
            h4: {
              fontSize: '1.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config