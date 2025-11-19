# 🎯 Explicação Visual: Como Funciona a Funcionalidade de Inspeções

Este documento explica **visualmente** como a funcionalidade funciona e o que você deve ver na interface.

---

## 📋 **FLUXO COMPLETO**

### **PASSO 1: Configurar Tipo de Viatura com Categoria**

#### **Onde:** Formulário de Criar/Editar Tipo de Viatura
**Caminho:** `/frotas/configuracoes/tipo-viaturas/create` ou `/update`

#### **O que você vê:**
```
┌─────────────────────────────────────────┐
│  Criar Tipo de Viatura                  │
├─────────────────────────────────────────┤
│                                          │
│  Designação: [________________]          │
│  * Campo obrigatório                     │
│                                          │
│  Categoria de Inspeção: [▼ Selecionar] │
│  * Campo obrigatório                     │
│    ┌─────────────────────────────────┐  │
│    │ Ligeiro                          │  │
│    │ Ligeiro de Mercadorias           │  │
│    │ Pesado                           │  │
│    └─────────────────────────────────┘  │
│                                          │
│  [Cancelar]  [Guardar]                   │
└─────────────────────────────────────────┘
```

#### **O que fazer:**
1. Preencher a **Designação** (ex: "Carro de Passageiros", "Furgão", "Camião")
2. Selecionar a **Categoria de Inspeção**:
   - **Ligeiro** → Para carros normais
   - **Ligeiro de Mercadorias** → Para furgões/comerciais
   - **Pesado** → Para camiões/autocarros
3. Clicar em **Guardar**

#### **Exemplo:**
- Tipo: "Furgão Comercial" → Categoria: **Ligeiro de Mercadorias**
- Tipo: "Camião de Carga" → Categoria: **Pesado**
- Tipo: "Carro Executivo" → Categoria: **Ligeiro**

---

### **PASSO 2: Criar/Editar uma Viatura**

#### **Onde:** Formulário de Criar/Editar Viatura
**Caminho:** `/frotas/viaturas/create` ou `/update`

#### **O que você vê (aba "Identificação"):**
```
┌─────────────────────────────────────────┐
│  Criar Viatura                          │
├─────────────────────────────────────────┤
│  [Identificação] [Mecânica] [Outros]    │
│                                          │
│  Matrícula: [AA-00-00]                  │
│  Data de Matrícula: [📅 01/01/2020]     │
│                                          │
│  Tipo de Viatura: [▼ Selecionar]        │
│    ┌─────────────────────────────────┐  │
│    │ Carro Executivo                  │  │
│    │ Furgão Comercial                 │  │
│    │ Camião de Carga                  │  │
│    └─────────────────────────────────┘  │
│                                          │
│  ... outros campos ...                   │
└─────────────────────────────────────────┘
```

#### **O que fazer:**
1. Preencher os dados da viatura
2. **Importante:** Selecionar o **Tipo de Viatura** (que já tem a categoria configurada)
3. Preencher a **Data de Matrícula** (essencial para calcular inspeções)

---

### **PASSO 3: Adicionar Inspeções (AUTOMÁTICO)**

#### **Onde:** Aba "Inspeções" no formulário de Viatura

#### **CENÁRIO A: Primeira Inspeção (Nenhuma inspeção ainda)**

**O que você vê ANTES de clicar "Adicionar Inspeção":**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  [Nenhuma inspeção registada]           │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**O que acontece quando clica "Adicionar Inspeção":**

**Se a viatura é LIGEIRO (e ainda não chegou aos 4 anos):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2024]     │ │ ← Calculado: 4 anos após matrícula
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 01/01/2026] │ │ ← Calculado: +2 anos (bienal)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Se a viatura é LIGEIRO (já tem mais de 4 anos - veículo antigo):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 15/01/2025]     │ │ ← HOJE (cliente começa a registar agora)
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 15/01/2026] │ │ ← Calculado baseado na idade atual
│  │ [🗑️ Remover]                      │ │   (bienal se 4-8 anos, anual se 8+ anos)
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Se a viatura é LIGEIRO DE MERCADORIAS (e ainda não chegou aos 2 anos):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2022]     │ │ ← Calculado: 2 anos após matrícula
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 01/01/2023] │ │ ← Calculado: +1 ano (anual)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Se a viatura é LIGEIRO DE MERCADORIAS (já tem mais de 2 anos - veículo antigo):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 15/01/2025]     │ │ ← HOJE (cliente começa a registar agora)
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 15/01/2026] │ │ ← Calculado: +1 ano (sempre anual)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Se a viatura é PESADO (e ainda não chegou ao 1º ano):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2021]     │ │ ← Calculado: 1 ano após matrícula
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 01/01/2022] │ │ ← Calculado: +1 ano (anual)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Se a viatura é PESADO (já tem mais de 1 ano - veículo antigo):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 15/01/2025]     │ │ ← HOJE (cliente começa a registar agora)
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 15/01/2026] │ │ ← Calculado: +1 ano (sempre anual)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

#### **CENÁRIO B: Adicionar Segunda Inspeção (Já existe uma)**

**O que você vê ANTES:**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2024]     │ │
│  │ Resultado: [Aprovado]              │ │
│  │ Próxima Inspeção: [📅 01/01/2026] │ │
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**O que acontece quando clica "Adicionar Inspeção":**

**Para LIGEIRO (idade 5 anos - entre 4-8 anos):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2024]     │ │
│  │ Resultado: [Aprovado]              │ │
│  │ Próxima Inspeção: [📅 01/01/2026] │ │ ← Atualizado automaticamente
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2026]     │ │ ← Nova inspeção (data da próxima anterior)
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 01/01/2028] │ │ ← Calculado: +2 anos (bienal)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Para LIGEIRO (idade 9 anos - mais de 8 anos):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2024]     │ │
│  │ Resultado: [Aprovado]              │ │
│  │ Próxima Inspeção: [📅 01/01/2025] │ │ ← Atualizado automaticamente
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2025]     │ │ ← Nova inspeção
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 01/01/2026] │ │ ← Calculado: +1 ano (anual)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

**Para LIGEIRO DE MERCADORIAS ou PESADO (sempre anual):**
```
┌─────────────────────────────────────────┐
│  Inspeções                              │
├─────────────────────────────────────────┤
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2022]     │ │
│  │ Resultado: [Aprovado]              │ │
│  │ Próxima Inspeção: [📅 01/01/2023] │ │ ← Atualizado automaticamente
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  ┌───────────────────────────────────┐ │
│  │ Data Inspeção: [📅 01/01/2023]     │ │ ← Nova inspeção
│  │ Resultado: [_____________]         │ │
│  │ Próxima Inspeção: [📅 01/01/2024] │ │ ← Calculado: +1 ano (anual)
│  │ [🗑️ Remover]                      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [+ Adicionar Inspeção]                 │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🎯 **RESUMO VISUAL DO QUE ACONTECE**

### **1. Configuração (Uma vez por Tipo de Viatura)**
```
Tipo de Viatura: "Furgão Comercial"
    ↓
Categoria: "Ligeiro de Mercadorias"
    ↓
[Guardado no banco de dados]
```

### **2. Criação de Viatura**
```
Viatura criada:
  - Tipo: "Furgão Comercial" (já tem categoria)
  - Data Matrícula: 01/01/2020
    ↓
Sistema sabe: Esta viatura é "Ligeiro de Mercadorias"
```

### **3. Adicionar Primeira Inspeção**
```
Clica "Adicionar Inspeção"
    ↓
Sistema verifica:
  - Se primeira inspeção obrigatória AINDA NÃO chegou:
    → Usa a data calculada (ex: 01/01/2022)
  - Se primeira inspeção obrigatória JÁ PASSOU (veículo antigo):
    → Usa HOJE (cliente começa a registar a partir de agora)
    ↓
Sistema calcula próxima inspeção baseado na idade atual:
  - Ligeiros: bienal (4-8 anos) ou anual (8+ anos)
  - Mercadorias/Pesados: sempre anual
    ↓
Campos preenchidos AUTOMATICAMENTE
```

### **4. Adicionar Segunda Inspeção**
```
Clica "Adicionar Inspeção" novamente
    ↓
Sistema calcula:
  - Data nova inspeção: 01/01/2023 (data da próxima anterior)
  - Próxima inspeção: 01/01/2024 (+1 ano, sempre anual)
    ↓
Campos preenchidos AUTOMATICAMENTE
```

---

## 📊 **EXEMPLOS PRÁTICOS**

### **Exemplo 1: Carro Ligeiro (5 anos de idade)**

**Dados:**
- Tipo: "Carro Executivo" → Categoria: **Ligeiro**
- Data Matrícula: 01/01/2019
- Hoje: 01/01/2024 (veículo tem 5 anos)

**Primeira Inspeção:**
- Data Inspeção: **01/01/2023** (4 anos após matrícula)
- Próxima Inspeção: **01/01/2025** (+2 anos, bienal porque tem 4-8 anos)

**Segunda Inspeção (adicionada hoje):**
- Data Inspeção: **01/01/2025** (data da próxima anterior)
- Próxima Inspeção: **01/01/2027** (+2 anos, ainda bienal porque tem 5-7 anos)

**Terceira Inspeção (quando o veículo tiver 9 anos):**
- Data Inspeção: **01/01/2027**
- Próxima Inspeção: **01/01/2028** (+1 ano, agora anual porque tem 9+ anos)

---

### **Exemplo 2: Furgão de Mercadorias**

**Dados:**
- Tipo: "Furgão Comercial" → Categoria: **Ligeiro de Mercadorias**
- Data Matrícula: 01/01/2020

**Primeira Inspeção:**
- Data Inspeção: **01/01/2022** (2 anos após matrícula)
- Próxima Inspeção: **01/01/2023** (+1 ano, sempre anual)

**Segunda Inspeção:**
- Data Inspeção: **01/01/2023**
- Próxima Inspeção: **01/01/2024** (+1 ano, sempre anual)

**Todas as seguintes:** Sempre +1 ano (anual)

---

### **Exemplo 3: Camião Pesado**

**Dados:**
- Tipo: "Camião de Carga" → Categoria: **Pesado**
- Data Matrícula: 01/01/2021

**Primeira Inspeção:**
- Data Inspeção: **01/01/2022** (1 ano após matrícula)
- Próxima Inspeção: **01/01/2023** (+1 ano, sempre anual)

**Todas as seguintes:** Sempre +1 ano (anual)

---

## ⚠️ **O QUE VOCÊ DEVE VER**

### ✅ **Funcionando Corretamente:**
1. Ao criar um Tipo de Viatura, aparece o campo **"Categoria de Inspeção"**
2. Ao adicionar a primeira inspeção, as datas são **preenchidas automaticamente**
3. Ao adicionar inspeções seguintes, as datas são **calculadas corretamente**:
   - Ligeiros: bienal (2 anos) se idade 4-8 anos, anual (1 ano) se 8+ anos
   - Mercadorias/Pesados: sempre anual (1 ano)
4. A data da "Próxima Inspeção" da inspeção anterior é **atualizada automaticamente** quando adiciona uma nova

### ❌ **Se algo não estiver funcionando:**
- Verifique se o Tipo de Viatura tem categoria definida
- Verifique se a Data de Matrícula está preenchida
- Se as datas não aparecem automaticamente, pode ser que:
  - O tipo de viatura não tenha categoria configurada
  - A data de matrícula não esteja preenchida
  - O sistema está usando fallback (regra padrão anual)

---

## 🔍 **COMO TESTAR**

1. **Criar um Tipo de Viatura:**
   - Designação: "Teste Ligeiro"
   - Categoria: **Ligeiro**
   - Guardar

2. **Criar uma Viatura:**
   - Tipo: "Teste Ligeiro"
   - Data Matrícula: **01/01/2020** (há 4+ anos)
   - Guardar

3. **Adicionar Primeira Inspeção:**
   - Ir à aba "Inspeções"
   - Clicar "Adicionar Inspeção"
   - **Verificar:** Data Inspeção deve ser **01/01/2024** (4 anos após matrícula)
   - **Verificar:** Próxima Inspeção deve ser **01/01/2026** (+2 anos, bienal)

4. **Adicionar Segunda Inspeção:**
   - Clicar "Adicionar Inspeção" novamente
   - **Verificar:** Data Inspeção deve ser **01/01/2026** (data da próxima anterior)
   - **Verificar:** Próxima Inspeção deve ser **01/01/2028** (+2 anos, ainda bienal)

---

## 💡 **DICA IMPORTANTE**

**As datas são calculadas AUTOMATICAMENTE** baseado em:
- ✅ Categoria do Tipo de Viatura
- ✅ Data de Matrícula da Viatura
- ✅ Idade do veículo (para Ligeiros)

**Você NÃO precisa calcular manualmente!** O sistema faz tudo por si.

### ⚠️ **COMPORTAMENTO ESPECIAL PARA VEÍCULOS ANTIGOS**

**Se o veículo já passou da primeira inspeção obrigatória:**
- A primeira inspeção registada será **HOJE** (não a data histórica)
- Isso permite que clientes comecem a registar inspeções a partir de agora
- Não é necessário registar todas as inspeções antigas
- A próxima inspeção será calculada baseado na **idade atual** do veículo

**Exemplo:**
- Veículo ligeiro de 2015 (10 anos de idade)
- Primeira inspeção registada: **15/01/2025** (hoje)
- Próxima inspeção: **15/01/2026** (+1 ano, porque já tem mais de 8 anos)

