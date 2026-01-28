
# Plano de Melhorias para o Painel Admin

Com base na análise do código atual, identifiquei várias oportunidades de melhoria organizadas por prioridade e impacto.

---

## 1. Funcionalidades Ausentes ou Incompletas

### 1.1 Relatórios (Prioridade Alta)
Atualmente a aba "Relatórios" exibe apenas "em breve". Implementar:

- **Relatório de Desempenho por Período**: Gráficos comparativos mês a mês
- **Relatório de Origem dos Leads**: De onde vêm os leads (fonte)
- **Relatório de Motivos de Perda**: Análise dos leads perdidos
- **Exportação em PDF**: Gerar relatórios para impressão/compartilhamento
- **Comparativo SDR vs Closer**: Performance individual detalhada

### 1.2 Notificações em Tempo Real (Prioridade Alta)
- Notificação quando Admin/Manager atribuir lead ao SDR/Closer
- Notificação quando lead mudar de estágio no pipeline
- Alerta quando reunião estiver chegando (15min antes)
- Badge com contador de notificações não lidas no sidebar

### 1.3 Atividades/Histórico de Lead (Prioridade Média)
A tabela `activities` existe mas não está sendo utilizada na UI:
- Linha do tempo de atividades em cada lead
- Registro automático de mudanças de status
- Histórico de ligações, emails e reuniões

---

## 2. Melhorias de UX/Interface

### 2.1 Pipeline - Indicadores Visuais (Prioridade Alta)
- Mostrar avatar do responsável em cada card
- Indicador visual diferenciando leads criados pelo SDR vs atribuídos
- Contador de leads por membro no filtro
- Cores de urgência para leads parados há muito tempo
- Indicador de valor total por coluna (já existe, mas pode melhorar)

### 2.2 Validações e Feedback (Prioridade Média)
- Validar email duplicado ao cadastrar membro da equipe
- Confirmação antes de excluir membro/lead
- Indicador de "salvando..." ao atualizar metas
- Mensagens de erro mais descritivas

### 2.3 Modo Mobile (Prioridade Média)
- Pipeline com scroll horizontal otimizado
- Cards compactos em telas menores
- Menu bottom-sheet para ações

---

## 3. Novas Funcionalidades

### 3.1 Atribuição Inteligente de Leads (Prioridade Alta)
- Botão "Atribuir Lead" mais visível
- Atribuição automática baseada em carga de trabalho
- Rodízio entre SDRs/Closers

### 3.2 Templates de Follow-up (Prioridade Média)
- Mensagens pré-definidas para WhatsApp
- Templates personalizáveis por estágio do pipeline
- Variáveis dinâmicas (nome, valor, etc.)

### 3.3 Integração com WhatsApp (Prioridade Média)
- Botão de envio rápido de mensagem
- Link direto para WhatsApp Web
- Registro automático de tentativa de contato

### 3.4 Dashboard Personalizado (Prioridade Baixa)
- Widgets arrastáveis
- Seleção de métricas favoritas
- Salvar layout preferido

---

## 4. Melhorias de Performance e Dados

### 4.1 Filtros Avançados (Prioridade Média)
- Filtro por origem do lead
- Filtro por valor (faixa de preço)
- Filtro por responsável na tabela de leads
- Salvar filtros favoritos

### 4.2 Busca Global (Prioridade Média)
- Busca unificada no header
- Pesquisar em leads, reuniões, membros
- Atalho de teclado (Cmd+K)

---

## 5. Segurança e Administração

### 5.1 Logs de Auditoria (Prioridade Baixa)
- Registro de quem fez qual alteração
- Histórico de logins
- Relatório de ações por usuário

### 5.2 Configurações de Empresa (Prioridade Baixa)
- Logo personalizado
- Cores do tema
- Configurações de notificação por email

---

## Sugestão de Implementação por Fase

**Fase 1 (Impacto Imediato):**
1. Notificações em tempo real
2. Validação de email duplicado
3. Indicadores visuais no pipeline
4. Loading states nas metas

**Fase 2 (Melhorias de UX):**
1. Relatórios básicos
2. Histórico de atividades do lead
3. Templates de mensagem
4. Filtros avançados

**Fase 3 (Novas Features):**
1. Busca global
2. Atribuição inteligente
3. Relatórios avançados com PDF
4. Dashboard personalizável

---

## Detalhes Técnicos

### Notificações em Tempo Real
Utilizar Supabase Realtime já configurado + sistema de notificação local:
- Criar tabela `notifications`
- Trigger no banco para eventos importantes
- Badge no sidebar com contador

### Histórico de Atividades
A tabela `activities` já existe, necessário:
- Componente de timeline no LeadDetailDialog
- Inserção automática via triggers ou código
- Filtros por tipo de atividade

### Relatórios
Utilizar Recharts (já instalado):
- Componentes reutilizáveis de gráfico
- Agregação de dados no frontend
- Opção de exportação CSV/PDF

---

Qual melhoria você gostaria de implementar primeiro?
