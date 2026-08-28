# Manual Completo - App Pr. Gilberto Penido

Este é o documento oficial e completo com todas as informações, funções e abas do aplicativo do Pr. Gilberto Penido.

---

## 1. Visão Geral
O **App Pr. Gilberto** é uma plataforma premium projetada para centralizar treinamentos, discipulado, estudos bíblicos, materiais em áudio, vídeo e PDFs, além de recursos para gestão de crescimento de igrejas (como a estratégia do Culto 10).

A aplicação conta com um painel (Dashboard) restrito a assinantes e um sistema administrativo completo.

---

## 2. Acesso e Níveis de Usuário

Existem três níveis principais de acesso dentro do aplicativo:

*   **Administrador (Pr. Gilberto)**: Tem acesso a todas as métricas reais (número de audiobooks, playbooks, artigos, vídeos) no Dashboard. Tem permissão para acessar o Painel de Controle (`/painel-root.html`), gerenciar usuários, adicionar ou remover conteúdos.
*   **Usuário Comum (Assinante / Degustação)**: Tem acesso aos conteúdos da plataforma. No Dashboard, os números estatísticos são ocultos, mostrando apenas os atalhos para as abas.
*   **Visitante**: Acesso apenas à página inicial (Apresentação), planos de assinatura, login e formulário de testemunho.

### Sistema de Degustação e Mensalidade
A plataforma possui um sistema automatizado para gerenciar pagamentos:
*   **Aviso Automático**: O servidor envia um e-mail 3 dias antes do vencimento (tanto da degustação quanto da assinatura mensal).
*   **Expiração**: Quando o tempo expira, o status do usuário muda para `expired` e o acesso é bloqueado até a renovação.

---

## 3. Todas as Abas e Funções

Ao fazer o login, o usuário tem acesso a um menu lateral (Sidebar) com todos os módulos do sistema. A seguir, o detalhamento de cada aba:

### 🏠 Dashboard Principal (Início)
*   **O que faz**: É a central de entrada do usuário.
*   **Funções**:
    *   Exibe atalhos rápidos para as áreas mais importantes: Audio Books, Play Books, Vídeos e Artigos.
    *   Para o administrador, mostra o **número real** de conteúdos cadastrados.
    *   Acesso direto aos últimos conteúdos adicionados.

### 📚 Play Books
*   **O que faz**: Biblioteca de materiais de leitura, cartilhas e e-books.
*   **Funções**:
    *   Acesso a PDFs e manuais de discipulado (ex: "O Discipulado Prático").
    *   Possibilidade de ler o conteúdo integrado ou baixar o material (quando permitido).
    *   Informações sobre duração estimada de leitura e avaliações.

### 🎧 Audio Books
*   **O que faz**: Central de estudos e áudios gravados.
*   **Funções**:
    *   Player de áudio customizado integrado na plataforma.
    *   Os usuários podem escutar as séries de pregações, estudos do Culto 10, e módulos de liderança.
    *   As faixas mostram o tempo de duração e a categoria do conteúdo.

### 📰 Artigos
*   **O que faz**: Uma biblioteca de textos de aprofundamento teológico e ministerial.
*   **Funções**:
    *   Leitura de textos organizados por categorias e tags.
    *   Indicador de "Tempo de Leitura" para ajudar o usuário a se programar.
    *   Interface limpa, focada em conforto de leitura.

### 🎥 Vídeos
*   **O que faz**: Galeria de vídeos de treinamento, mensagens e discipulado.
*   **Funções**:
    *   Video player integrado, compatível com diversas resoluções.
    *   Vídeos separados por destaque e listas de reprodução.
    *   Exibe título, descrição e tempo de duração do vídeo.

### 📈 Projetos
*   **O que faz**: Painel para acompanhar as iniciativas e métricas da igreja.
*   **Funções**:
    *   Mostra o andamento de estratégias (como o Projeto Culto 10).
    *   Contadores de tarefas e barras de progresso (em porcentagem) para engajar os líderes.
    *   Status de metas alcançadas.

### 📊 Relatórios
*   **O que faz**: Área de estatísticas e desempenho pessoal ou do ministério.
*   **Funções**:
    *   Tabelas de desempenho e gráficos de barras visuais.
    *   Indicadores de performance (comparativos de crescimento).
    *   Apresenta um resumo executivo dos resultados da igreja local.

### ⚙️ Configurações / Perfil
*   **O que faz**: Área pessoal do usuário logado.
*   **Funções**:
    *   Alterar tema do sistema (Claro / Escuro). O modo noturno aplica cores suaves para descanso visual.
    *   Verificar status da assinatura e dias restantes.
    *   Opção de "Sair" (Logout) da plataforma.

---

## 4. Recursos Externos (Páginas Públicas)

Além do acesso restrito, o aplicativo possui páginas públicas voltadas para atrair novos assinantes:

*   **Página Inicial (Apresentação)**: Uma landing page premium explicando o conceito do app, com animações e apelo visual dourado/escuro.
*   **Aba Proposta**: Explica o projeto Culto 10 e o discipulado prático.
*   **Aba Testemunhos**: Mostra depoimentos de pastores que usaram a estratégia. Contém também um **Formulário** para novos pastores enviarem seus próprios testemunhos, que vão direto para o e-mail do Pr. Gilberto.
*   **Apoio**: Mostra os parceiros ministeriais do projeto (Colégio Batista, Rádio Nova Jerusalém, etc.).
*   **Planos (Venda)**: Página apresentando as vantagens de ser um assinante (mensalidade) e com botão para iniciar testes ou falar no WhatsApp.

---

## 5. Painel do Administrador (Gestão)
O Pr. Gilberto possui ferramentas exclusivas para gerenciar a plataforma:

*   **Painel Root (`/painel-root.html`)**: Permite cadastrar, editar ou deletar usuários, gerenciar datas de vencimento de assinaturas e aprovar novos membros.
*   **Adicionar Conteúdo**: Páginas secretas (`/adicionar-video.html`, `/adicionar-artigo.html`, `/adicionar-projeto.html`, etc.) para fazer o upload de novas mídias e materiais para os alunos, enviando os arquivos diretamente para o servidor.
*   **Gerenciador de Áudio com Inteligência Artificial**: O backend possui scripts integrados (Python) que podem gerar faixas de áudio realistas a partir de textos digitados, criando novos audiobooks automaticamente (estúdio de áudio IA).

---

*Gerado automaticamente pelo sistema de suporte AntiGravity AI.*
