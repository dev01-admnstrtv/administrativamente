'use client'

import * as React from 'react'
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription,
  Badge, 
  LoadingSpinner, 
  PulseSpinner, 
  DotsSpinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ThemeToggle,
  ThemeSwitch,
  ThemeIndicator
} from '@/components/ui'
import { Search, Mail, Star, Download, Settings, Eye } from 'lucide-react'

export default function ComponentsShowcase() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<string>('')

  const openModal = (type: string) => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="content-container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-display-medium mb-4">
            Design System Premium
          </h1>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Componentes UI inspirados no design da Apple com paleta zinc/slate 
            premium e efeitos de glassmorphism.
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Buttons</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Botões com diferentes estilos e tamanhos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="premium">Premium</Button>
                </div>
              </div>

              {/* Semantic variants */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Semantic Colors</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Inputs</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Input Variants</CardTitle>
              <CardDescription>
                Campos de entrada com diferentes estilos e funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input 
                    label="Nome completo" 
                    placeholder="Digite seu nome" 
                  />
                  
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="seu@email.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                  
                  <Input 
                    label="Senha" 
                    type="password" 
                    placeholder="Digite sua senha"
                    showPasswordToggle
                  />
                  
                  <Input 
                    label="Buscar" 
                    placeholder="Buscar artigos..."
                    leftIcon={<Search className="h-4 w-4" />}
                    variant="ghost"
                  />
                </div>
                
                <div className="space-y-4">
                  <Input 
                    label="Nome (Floating)" 
                    placeholder="Digite seu nome"
                    floatingLabel
                  />
                  
                  <Input 
                    label="Email Premium" 
                    type="email" 
                    placeholder="seu@email.com"
                    variant="premium"
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                  
                  <Input 
                    label="Com erro" 
                    placeholder="Campo obrigatório"
                    error="Este campo é obrigatório"
                  />
                  
                  <Input 
                    label="Com sucesso" 
                    placeholder="Email válido"
                    variant="success"
                    helperText="Email verificado com sucesso"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Card Padrão</CardTitle>
                <CardDescription>
                  Card com estilo padrão e sombra sutil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Conteúdo do card com texto de exemplo.
                </p>
              </CardContent>
            </Card>

            <Card variant="premium">
              <CardHeader>
                <CardTitle>Card Premium</CardTitle>
                <CardDescription>
                  Card com blur backdrop e efeito premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Card com glassmorphism e efeitos visuais.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Card Glass</CardTitle>
                <CardDescription>
                  Card com efeito de vidro completo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Máximo efeito de glassmorphism aplicado.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" interactive>
              <CardHeader>
                <CardTitle>Card Interativo</CardTitle>
                <CardDescription>
                  Card com hover effects e elevação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Passe o mouse para ver o efeito.
                </p>
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardHeader>
                <CardTitle>Card Outline</CardTitle>
                <CardDescription>
                  Card apenas com borda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Estilo minimalista com borda.
                </p>
              </CardContent>
            </Card>

            <Card variant="subtle">
              <CardHeader>
                <CardTitle>Card Sutil</CardTitle>
                <CardDescription>
                  Card com background sutil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Background suave e discreto.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Badges</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>
                Tags e badges com cores semânticas e categorias específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic variants */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Basic Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="glass">Glass</Badge>
                </div>
              </div>

              {/* Semantic colors */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Semantic Colors</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              {/* Blog categories */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Blog Categories</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="gestao">Gestão</Badge>
                  <Badge variant="lideranca">Liderança</Badge>
                  <Badge variant="estrategia">Estratégia</Badge>
                  <Badge variant="tecnologia">Tecnologia</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge size="xs">Extra Small</Badge>
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                  <Badge size="xl">Extra Large</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Loading Spinners Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Loading Spinners</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Spinner Variants</CardTitle>
              <CardDescription>
                Indicadores de carregamento com diferentes estilos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Standard spinners */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Standard Spinners</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                  <LoadingSpinner size="xl" />
                </div>
              </div>

              {/* Semantic variants */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Semantic Colors</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner variant="success" />
                  <LoadingSpinner variant="warning" />
                  <LoadingSpinner variant="error" />
                  <LoadingSpinner variant="subtle" />
                </div>
              </div>

              {/* Alternative spinners */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Alternative Styles</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <PulseSpinner />
                  <DotsSpinner />
                  <LoadingSpinner showLabel label="Carregando..." />
                </div>
              </div>

              {/* Speed variants */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Speed Variants</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner speed="slow" />
                  <LoadingSpinner speed="normal" />
                  <LoadingSpinner speed="fast" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Theme Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Theme Controls</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Theme Components</CardTitle>
              <CardDescription>
                Componentes para controle de tema com suporte a light/dark mode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme toggles */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Toggle Variants</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ThemeToggle variant="button" />
                    <span className="text-sm text-muted-foreground">Button</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ThemeToggle variant="minimal" />
                    <span className="text-sm text-muted-foreground">Minimal</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ThemeSwitch />
                    <span className="text-sm text-muted-foreground">Switch</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ThemeToggle variant="dropdown" showLabel />
                  </div>
                </div>
              </div>

              {/* Theme indicator */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Theme Indicator</h3>
                <ThemeIndicator />
              </div>

              {/* Demo cards showing theme colors */}
              <div>
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Theme Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium text-foreground mb-2">Background</h4>
                    <p className="text-sm text-muted-foreground">Primary background color</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <h4 className="font-medium text-foreground mb-2">Muted</h4>
                    <p className="text-sm text-muted-foreground">Secondary backgrounds</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-accent border border-border">
                    <h4 className="font-medium text-accent-foreground mb-2">Accent</h4>
                    <p className="text-sm text-muted-foreground">Accent elements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Modals Section */}
        <section className="mb-16">
          <h2 className="text-headline-large mb-8">Modals</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Modal Examples</CardTitle>
              <CardDescription>
                Modais com glassmorphism e diferentes tamanhos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => openModal('small')}>
                  Modal Pequeno
                </Button>
                <Button onClick={() => openModal('default')}>
                  Modal Padrão
                </Button>
                <Button onClick={() => openModal('large')}>
                  Modal Grande
                </Button>
                <Button onClick={() => openModal('form')}>
                  Modal com Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Modal Examples */}
        <Modal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)}
          size={modalType === 'small' ? 'sm' : modalType === 'large' ? 'lg' : 'md'}
          title={modalType === 'form' ? 'Formulário de Contato' : 'Exemplo de Modal'}
          description="Este é um exemplo de modal com glassmorphism."
        >
          {modalType === 'form' ? (
            <div className="space-y-4">
              <Input label="Nome" placeholder="Seu nome completo" />
              <Input label="Email" type="email" placeholder="seu@email.com" />
              <Input label="Mensagem" placeholder="Sua mensagem..." />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setModalOpen(false)}>
                  Enviar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Este é um exemplo de modal usando a paleta de cores premium zinc/slate 
                com efeitos de glassmorphism. O modal possui backdrop blur e sombras 
                suaves que seguem o design system da Apple.
              </p>
              
              <div className="flex gap-3">
                <Badge variant="success">Premium</Badge>
                <Badge variant="gestao">Design</Badge>
                <Badge variant="tecnologia">UI/UX</Badge>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => setModalOpen(false)}>
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}