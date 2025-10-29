# Relatório: Botões de Limpeza de Memória

## Visão Geral

O sistema de monitorização de memória possui dois botões de limpeza com funcionalidades distintas:

1. **Botão "Limpar"** (ícone RefreshCw) - Limpeza Inteligente
2. **Botão "Limpar Tudo"** (ícone Trash2) - Limpeza Forçada

---

## 🔄 Botão "Limpar" - Limpeza Inteligente

### O que faz:
Executa uma limpeza **seletiva e inteligente** dos dados, removendo apenas:
- Estados de formulários antigos ou não utilizados
- Estados de páginas de janelas fechadas
- Cache de janelas excedente
- Estados de mapas de janelas inativas
- Dados temporários do localStorage

### Critérios de Limpeza:

#### Estados de Formulários:
- Remove formulários que excedem o limite de **50 estados**
- Remove formulários não modificados há mais de **1 hora**
- Remove formulários que não foram alterados (`hasBeenModified = false`)
- Mantém os formulários mais recentemente ativos

#### Estados de Páginas:
- Remove páginas de janelas que foram fechadas
- Remove estados órfãos (sem janela correspondente)
- Mantém apenas páginas de janelas ativas

#### Cache de Janelas:
- Remove entradas que excedem o limite de **20 itens**
- Remove as entradas menos recentemente utilizadas
- Mantém cache das janelas mais ativas

#### Estados de Mapas:
- Remove mapas de janelas fechadas
- Mantém apenas mapas de janelas ativas

#### LocalStorage:
- Remove dados de sessão antigos (mais de 2 horas)
- Remove dados temporários corrompidos
- Mantém dados essenciais da aplicação

### Quando usar:
- ✅ **Uso regular** - Para manutenção preventiva
- ✅ **Quando a memória está média** (2MB - 10MB)
- ✅ **Antes de trabalhar com muitos formulários**
- ✅ **Após fechar várias janelas**
- ✅ **Para libertar espaço sem perder dados importantes**

### Vantagens:
- ⚡ **Rápido** - Apenas remove dados desnecessários
- 🔒 **Seguro** - Preserva dados ativos e importantes
- 🎯 **Inteligente** - Usa critérios baseados em atividade
- 🔄 **Automático** - Executa periodicamente em background

---

## 🗑️ Botão "Limpar Tudo" - Limpeza Forçada

### O que faz:
Executa uma limpeza **completa e agressiva** de todos os dados:

#### Limpa TODOS os stores:
- **Formulários**: Remove todos os estados de formulários
- **Páginas**: Remove todos os estados de páginas
- **Janelas**: Limpa todo o cache de janelas
- **Mapas**: Remove todos os estados de mapas

#### Limpa localStorage:
- Remove todas as chaves que contêm "storage" ou "cache"
- Mantém apenas dados essenciais (autenticação, configurações)

### Quando usar:
- ⚠️ **Apenas em emergências** - Quando a memória está muito alta (>10MB)
- ⚠️ **Quando a aplicação está lenta** - Performance degradada
- ⚠️ **Após problemas de memória** - Erros de memória
- ⚠️ **Antes de reiniciar a aplicação** - Como último recurso

### ⚠️ Avisos Importantes:
- **Perde dados não guardados** - Formulários em edição serão perdidos
- **Reinicia estados** - Páginas voltam ao estado inicial
- **Cache limpo** - Janelas podem demorar mais a carregar
- **Mapas reset** - Posições e zoom dos mapas são perdidos

---

## 📊 Comparação dos Botões

| Característica | Botão "Limpar" | Botão "Limpar Tudo" |
|---|---|---|
| **Tipo de Limpeza** | Seletiva e inteligente | Completa e agressiva |
| **Velocidade** | Rápida | Muito rápida |
| **Segurança** | Alta - preserva dados ativos | Baixa - remove tudo |
| **Perda de Dados** | Mínima | Significativa |
| **Uso Recomendado** | Regular | Emergências apenas |
| **Impacto na Performance** | Melhora gradualmente | Melhora imediatamente |

---

## 🎯 Recomendações de Uso

### Uso Diário:
```typescript
// Use o botão "Limpar" regularmente
// - Após trabalhar com muitos formulários
// - Após fechar várias janelas
// - Quando a memória está média (2-10MB)
```

### Uso de Emergência:
```typescript
// Use o botão "Limpar Tudo" apenas quando:
// - Memória > 10MB
// - Aplicação muito lenta
// - Erros de memória
// - Como último recurso
```

---

## 🔧 Limpeza Automática

O sistema também executa limpeza automática:

### Periodicamente:
- A cada **5 minutos** - Limpeza inteligente automática
- Baseada nos mesmos critérios do botão "Limpar"

### Eventos Específicos:
- **Logout** - Limpeza completa
- **Mudança de aba** - Limpeza inteligente
- **Foco da janela** - Verificação de memória
- **Fecho da página** - Limpeza final

---

## 📈 Monitorização

O painel mostra estatísticas em tempo real:

- **Utilização Total**: Soma de todos os dados em KB
- **Estados de Formulários**: Número e tamanho em bytes
- **Estados de Páginas**: Número e tamanho em bytes
- **Cache de Janelas**: Número de itens
- **Estados de Mapas**: Número de itens
- **LocalStorage**: Tamanho em KB

### Níveis de Memória:
- 🟢 **Baixa**: < 2MB
- 🟡 **Média**: 2MB - 10MB
- 🔴 **Alta**: > 10MB

---

## 💡 Dicas de Otimização

1. **Use o botão "Limpar" regularmente** para manutenção preventiva
2. **Guarde formulários importantes** antes de usar "Limpar Tudo"
3. **Monitore a utilização** através do painel
4. **Feche janelas não utilizadas** para libertar memória
5. **Evite manter muitos formulários abertos** simultaneamente

---

## 🔍 Logs de Debug

Ambos os botões registam logs no console:

```javascript
// Botão "Limpar"
[MemoryManager] A iniciar limpeza...
[MemoryManager] Removidos X estados de formulários
[MemoryManager] Removidos Y estados de páginas
[MemoryManager] Limpeza concluída

// Botão "Limpar Tudo"
[MemoryManager] Limpeza forçada iniciada
[MemoryManager] Limpeza forçada concluída
```

Estes logs ajudam a monitorizar a eficácia da limpeza e identificar problemas de memória. 