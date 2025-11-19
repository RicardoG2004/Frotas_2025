# Guia de Implementação: Relacionar Tipo de Viatura com Inspeções

Este documento explica como implementar a funcionalidade de relacionar o tipo de viatura com as regras de inspeção em Portugal.

## 📋 Regras de Inspeção

### 1. LIGEIROS (Carros normais)
- **Primeira inspeção**: Ao 4º ano após a matrícula
- **4-8 anos**: Inspeção bienal (de 2 em 2 anos)
- **8+ anos**: Inspeção anual

### 2. LIGEIROS DE MERCADORIAS (Furgões, comerciais)
- **Primeira inspeção**: Ao 2º ano
- **Depois**: Inspeção todos os anos

### 3. PESADOS (Camiões, autocarros)
- **Primeira inspeção**: Ao 1º ano
- **Depois**: Inspeção todos os anos

---

## 🔧 Alterações Necessárias

### BACKEND (C#)

#### 1. Adicionar Enum e Campo na Entidade TipoViatura

**Arquivo**: `Frotas-client-api/Frotas.API.Domain/Entities/Frotas/TipoViatura.cs`

**Porquê**: 
- Precisamos categorizar cada tipo de viatura para aplicar as regras corretas de inspeção
- O enum garante que só existem 3 categorias válidas (Ligeiro, LigeiroMercadorias, Pesado)
- Cada tipo de viatura terá uma categoria associada que determina quando e com que frequência deve ser inspecionada
- O valor padrão `Ligeiro` garante compatibilidade com dados existentes

```csharp
// Enum que define as categorias de inspeção possíveis
// Cada categoria tem regras diferentes de quando fazer a primeira inspeção e frequência
public enum CategoriaInspecao
{
  Ligeiro = 0,              // Carros normais: 1ª inspeção aos 4 anos, depois bienal até 8 anos, depois anual
  LigeiroMercadorias = 1,    // Furgões/comerciais: 1ª inspeção aos 2 anos, depois sempre anual
  Pesado = 2                 // Camiões/autocarros: 1ª inspeção ao 1º ano, depois sempre anual
}

[Table("TipoViatura", Schema = "Frotas")]
public class TipoViatura : AuditableEntity
{
  public string Designacao { get; set; }
  // Campo que armazena a categoria de inspeção deste tipo de viatura
  // Valor padrão Ligeiro para manter compatibilidade com registos existentes
  public CategoriaInspecao CategoriaInspecao { get; set; } = CategoriaInspecao.Ligeiro;
}
```

#### 2. Atualizar DTOs de TipoViatura

**Porquê**: 
- Os DTOs são os objetos que trafegam entre as camadas da aplicação
- Precisamos incluir a categoria de inspeção em todos os DTOs para que ela possa ser enviada/recebida pela API
- A validação garante que apenas valores válidos do enum sejam aceites

**Arquivo**: `Frotas-client-api/Frotas.API.Application/Services/Frotas/TipoViaturaService/DTOs/TipoViaturaDTO.cs`

Adicionar:
```csharp
// Propriedade necessária para retornar a categoria quando consultamos um tipo de viatura
// Permite que o frontend saiba qual categoria está associada
public CategoriaInspecao CategoriaInspecao { get; set; }
```

**Arquivo**: `Frotas-client-api/Frotas.API.Application/Services/Frotas/TipoViaturaService/DTOs/CreateTipoViaturaRequest.cs`

Adicionar:
```csharp
// Propriedade necessária para criar um novo tipo de viatura com categoria
// Valor padrão Ligeiro para facilitar criação (pode ser alterado no frontend)
public CategoriaInspecao CategoriaInspecao { get; set; } = CategoriaInspecao.Ligeiro;
```

E no validator:
```csharp
// Validação para garantir que apenas valores válidos do enum são aceites
// Previne erros de dados inválidos e melhora a segurança da aplicação
_ = RuleFor(x => x.CategoriaInspecao)
  .IsInEnum()
  .WithMessage("A categoria de inspeção é inválida.");
```

**Arquivo**: `Frotas-client-api/Frotas.API.Application/Services/Frotas/TipoViaturaService/DTOs/UpdateTipoViaturaRequest.cs`

Mesmas alterações do CreateTipoViaturaRequest.

#### 3. Criar Helper para Calcular Próxima Inspeção

**Arquivo**: `Frotas-client-api/Frotas.API.Application/Utility/InspecaoHelper.cs`

**Porquê**: 
- Centraliza a lógica de cálculo de inspeções num único local, facilitando manutenção
- Permite reutilização em diferentes partes da aplicação (API, serviços, etc.)
- Facilita testes unitários da lógica de negócio
- Garante consistência: as mesmas regras são aplicadas em todo o sistema

Criar um helper estático com métodos:
- `CalcularPrimeiraInspecao(CategoriaInspecao categoriaInspecao, DateTime? dataLivrete)`
  - **Porquê**: Calcula quando deve ser feita a primeira inspeção obrigatória baseado na categoria e data de matrícula
  - Retorna null se não houver data de matrícula (não é possível calcular)
  
- `CalcularProximaInspecao(CategoriaInspecao categoriaInspecao, DateTime dataUltimaInspecao, DateTime? dataLivrete)`
  - **Porquê**: Calcula quando deve ser feita a próxima inspeção após uma inspeção realizada
  - Precisa da data de matrícula para calcular a idade do veículo (especialmente importante para Ligeiros)

A lógica deve considerar:
- **Para Ligeiro**: 
  - Calcular idade do veículo na data da última inspeção
  - Se idade entre 4-8 anos: próxima inspeção em 2 anos (bienal)
  - Se idade 8+ anos: próxima inspeção em 1 ano (anual)
  - **Porquê**: As regras portuguesas mudam a frequência baseado na idade do veículo
  
- **Para LigeiroMercadorias**: 
  - Sempre anual após primeira inspeção
  - **Porquê**: Regra fixa para veículos comerciais
  
- **Para Pesado**: 
  - Sempre anual após primeira inspeção
  - **Porquê**: Regra fixa para veículos pesados (maior desgaste, inspeção mais frequente)

#### 4. Criar Migration

**Porquê**: 
- O Entity Framework precisa de uma migration para adicionar a nova coluna `CategoriaInspecao` na tabela `TipoViatura` do banco de dados
- A migration garante que a estrutura do banco fica sincronizada com o modelo de dados
- Permite versionamento e controlo das alterações na base de dados

Após adicionar o campo `CategoriaInspecao` na entidade, criar uma migration:
```bash
dotnet ef migrations add AddCategoriaInspecaoToTipoViatura
```

**Nota**: A migration criará uma coluna do tipo `int` (pois o enum é mapeado para inteiro) com valor padrão 0 (Ligeiro), garantindo compatibilidade com dados existentes.

---

### FRONTEND (TypeScript/React)

#### 1. Atualizar DTOs de TipoViatura

**Arquivo**: `Frotas-client-frontend/src/types/dtos/frotas/tipo-viaturas.dtos.ts`

**Porquê**: 
- Os tipos TypeScript precisam corresponder aos DTOs do backend
- O tipo union garante type-safety: apenas valores válidos podem ser usados
- Facilita autocomplete e detecção de erros em tempo de desenvolvimento

Adicionar:
```typescript
// Tipo que representa as categorias de inspeção possíveis
// Deve corresponder ao enum C# do backend (mas em camelCase para TypeScript)
export type CategoriaInspecao = 'ligeiro' | 'ligeiroMercadorias' | 'pesado'

export interface TipoViaturaDTO {
  id: string
  designacao: string
  // Propriedade necessária para saber a categoria quando recebemos dados do backend
  categoriaInspecao: CategoriaInspecao
}

export interface CreateTipoViaturaDTO {
  designacao: string
  // Propriedade necessária para enviar a categoria ao criar um novo tipo
  categoriaInspecao: CategoriaInspecao
}

export interface UpdateTipoViaturaDTO {
  designacao: string
  // Propriedade necessária para enviar a categoria ao atualizar um tipo
  categoriaInspecao: CategoriaInspecao
}
```

#### 2. Atualizar ViaturaDTO

**Arquivo**: `Frotas-client-frontend/src/types/dtos/frotas/viaturas.dtos.ts`

**Porquê**: 
- Quando recebemos uma viatura do backend, ela pode incluir o objeto `tipoViatura` completo
- Precisamos da `categoriaInspecao` para calcular as datas de inspeção no frontend
- É opcional porque pode não vir preenchido em todas as consultas (depende do include do backend)

No `tipoViatura` dentro de `ViaturaDTO`, adicionar:
```typescript
tipoViatura?: {
  id?: string
  designacao?: string
  // Categoria necessária para calcular as datas de inspeção baseado nas regras
  categoriaInspecao?: CategoriaInspecao
}
```

#### 3. Criar Helper de Inspeção no Frontend

**Arquivo**: `Frotas-client-frontend/src/utils/inspecao-helper.ts`

**Porquê**: 
- Reutiliza a mesma lógica do backend no frontend para cálculos em tempo real
- Permite calcular datas de inspeção sem fazer chamadas à API
- Melhora UX: o utilizador vê imediatamente a próxima data sugerida
- Mantém consistência: mesma lógica em backend e frontend

Criar funções:
- `calcularPrimeiraInspecao(categoriaInspecao, dataLivrete)`
  - **Porquê**: Calcula quando deve ser feita a primeira inspeção obrigatória
  - Útil para sugerir a data da primeira inspeção quando o utilizador adiciona uma nova
  
- `calcularProximaInspecao(categoriaInspecao, dataUltimaInspecao, dataLivrete)`
  - **Porquê**: Calcula a próxima data de inspeção após uma inspeção realizada
  - Usado quando o utilizador adiciona uma nova inspeção após uma existente
  - Considera a idade do veículo para aplicar regras diferentes (especialmente Ligeiros)

#### 4. Atualizar Formulário de TipoViatura

**Arquivos**:
- `Frotas-client-frontend/src/pages/frotas/tipo-viaturas/components/tipo-viaturas-create-page/`
- `Frotas-client-frontend/src/pages/frotas/tipo-viaturas/components/tipo-viaturas-update-page/`

**Porquê**: 
- O utilizador precisa poder definir a categoria de inspeção ao criar/editar um tipo de viatura
- Esta categoria será usada para calcular automaticamente as datas de inspeção das viaturas deste tipo
- Campo obrigatório para garantir que todos os tipos têm categoria definida

Adicionar um campo Select/Dropdown para escolher a `CategoriaInspecao` com as opções:
- **Ligeiro**: Para carros normais (primeira aos 4 anos, depois bienal até 8 anos, depois anual)
- **Ligeiro de Mercadorias**: Para furgões e comerciais (primeira aos 2 anos, depois sempre anual)
- **Pesado**: Para camiões e autocarros (primeira ao 1º ano, depois sempre anual)

**Sugestão de implementação**:
```typescript
// No formulário, adicionar um Select com as opções
<Select
  value={form.watch('categoriaInspecao')}
  onValueChange={(value) => form.setValue('categoriaInspecao', value as CategoriaInspecao)}
>
  <SelectItem value="ligeiro">Ligeiro</SelectItem>
  <SelectItem value="ligeiroMercadorias">Ligeiro de Mercadorias</SelectItem>
  <SelectItem value="pesado">Pesado</SelectItem>
</Select>
```

#### 5. Atualizar viatura-form-container

**Arquivo**: `Frotas-client-frontend/src/pages/frotas/viaturas/components/viaturas-forms/viatura-form-container.tsx`

**Alterações necessárias**:

1. **Importar o helper**:
```typescript
// Importar função para calcular próxima inspeção baseado nas regras
import { calcularProximaInspecao } from '@/utils/inspecao-helper'
// Importar tipo para type-safety
import type { CategoriaInspecao } from '@/types/dtos/frotas/tipo-viaturas.dtos'
```

2. **Criar um Map para associar tipoViaturaId à categoriaInspecao**:
```typescript
// Map criado para lookup rápido: dado um tipoViaturaId, retorna a categoriaInspecao
// Porquê usar Map: O(1) lookup time, muito mais rápido que array.find() em loops
// useMemo: só recalcula quando tipoViaturas muda, otimiza performance
const tipoViaturasCategoriaMap = useMemo(() => {
  const map = new Map<string, CategoriaInspecao>()
  tipoViaturas.forEach((tipoViatura) => {
    if (tipoViatura.id && tipoViatura.categoriaInspecao) {
      map.set(tipoViatura.id, tipoViatura.categoriaInspecao)
    }
  })
  return map
}, [tipoViaturas])
```

3. **Atualizar a função `getNextInspectionDate`** (linha ~2133):
```typescript
// Função que calcula a próxima data de inspeção baseado nas regras portuguesas
// Porquê atualizar: Antes sempre adicionava 1 ano, agora aplica regras corretas
const getNextInspectionDate = (date: Date) => {
  // Obter o tipo de viatura selecionado no formulário
  const tipoViaturaId = form.getValues('tipoViaturaId')
  // Obter a data de matrícula (necessária para calcular idade do veículo)
  const dataLivrete = form.getValues('dataLivrete')
  // Buscar a categoria de inspeção do tipo de viatura selecionado
  const categoriaInspecao = tipoViaturaId ? tipoViaturasCategoriaMap.get(tipoViaturaId) : undefined
  
  // Se temos categoria e data de matrícula, usar as regras específicas
  if (categoriaInspecao && dataLivrete) {
    return calcularProximaInspecao(categoriaInspecao, date, dataLivrete)
  }
  
  // Fallback: se não temos categoria ou data de matrícula, usar regra padrão anual
  // Porquê fallback: Garante que sempre retorna uma data válida, mesmo sem dados completos
  const next = new Date(date.getTime())
  next.setFullYear(next.getFullYear() + 1)
  return next
}
```

4. **Atualizar `handleAddInspection`** para usar a nova lógica quando não há inspeções anteriores:
```typescript
// Função chamada quando o utilizador clica para adicionar uma nova inspeção
// Porquê atualizar: Agora calcula automaticamente datas baseadas nas regras portuguesas
const handleAddInspection = () => {
  const inspections = form.getValues('inspecoes') ?? []
  const lastInspection = inspections[inspections.length - 1]
  // Obter dados necessários para cálculo
  const tipoViaturaId = form.getValues('tipoViaturaId')
  const dataLivrete = form.getValues('dataLivrete')
  const categoriaInspecao = tipoViaturaId ? tipoViaturasCategoriaMap.get(tipoViaturaId) : undefined

  if (lastInspection) {
    // Se já existe uma inspeção anterior, a nova deve começar na data da próxima da anterior
    if (!(lastInspection.dataProximaInspecao instanceof Date)) {
      toast.warning('Defina a data da próxima inspeção antes de adicionar uma nova.')
      return
    }

    // A data da nova inspeção é a data da próxima inspeção da anterior
    const dataInspecao = new Date(lastInspection.dataProximaInspecao)
    // Calcular próxima inspeção usando as regras (bienal/anual conforme categoria e idade)
    const proximaInspecao = categoriaInspecao && dataLivrete
      ? calcularProximaInspecao(categoriaInspecao, dataInspecao, dataLivrete)
      : getNextInspectionDate(dataInspecao) // Fallback se não temos dados completos
    
    appendInspection({
      id: undefined,
      dataInspecao,
      resultado: '',
      dataProximaInspecao: proximaInspecao,
    })

    // Atualizar a data da próxima inspeção da inspeção anterior para coincidir com esta
    form.setValue(`inspecoes.${inspections.length - 1}.dataProximaInspecao`, dataInspecao, {
      shouldDirty: true,
      shouldValidate: true,
    })
  } else {
    // Primeira inspeção - calcular baseado na primeira inspeção obrigatória
    // Porquê: A primeira inspeção tem datas específicas (4 anos para ligeiros, 2 para mercadorias, 1 para pesados)
    const hoje = new Date()
    let dataPrimeiraInspecao = hoje
    
    // Se temos categoria e data de matrícula, calcular quando deveria ser a primeira inspeção
    if (categoriaInspecao && dataLivrete) {
      const primeiraInspecao = calcularPrimeiraInspecao(categoriaInspecao, dataLivrete)
      // Se a primeira inspeção já passou, usar hoje; senão usar a data calculada
      if (primeiraInspecao && primeiraInspecao <= hoje) {
        dataPrimeiraInspecao = primeiraInspecao
      }
    }
    
    // Calcular quando será a próxima inspeção após esta primeira
    // Porquê: Já preenche automaticamente a próxima data, facilitando para o utilizador
    const proximaInspecao = categoriaInspecao && dataLivrete
      ? calcularProximaInspecao(categoriaInspecao, dataPrimeiraInspecao, dataLivrete)
      : getNextInspectionDate(dataPrimeiraInspecao)
    
    appendInspection({
      id: undefined,
      dataInspecao: dataPrimeiraInspecao,
      resultado: '',
      dataProximaInspecao: proximaInspecao,
    })
  }
}
```

---

## 📝 Resumo dos Arquivos a Modificar

### Backend:
1. ✅ `Frotas.API.Domain/Entities/Frotas/TipoViatura.cs` - Adicionar enum e campo
2. ✅ `Frotas.API.Application/Services/Frotas/TipoViaturaService/DTOs/TipoViaturaDTO.cs` - Adicionar propriedade
3. ✅ `Frotas.API.Application/Services/Frotas/TipoViaturaService/DTOs/CreateTipoViaturaRequest.cs` - Adicionar propriedade e validação
4. ✅ `Frotas.API.Application/Services/Frotas/TipoViaturaService/DTOs/UpdateTipoViaturaRequest.cs` - Adicionar propriedade e validação
5. ✅ `Frotas.API.Application/Utility/InspecaoHelper.cs` - Criar novo arquivo com helper
6. ⚠️ Criar migration para adicionar coluna no banco de dados

### Frontend:
1. ✅ `src/types/dtos/frotas/tipo-viaturas.dtos.ts` - Adicionar tipo e propriedades
2. ✅ `src/types/dtos/frotas/viaturas.dtos.ts` - Atualizar tipoViatura
3. ✅ `src/utils/inspecao-helper.ts` - Criar novo arquivo com helper
4. ✅ `src/pages/frotas/viaturas/components/viaturas-forms/viatura-form-container.tsx` - Atualizar lógica de cálculo
5. ⚠️ Formulários de TipoViatura (create/update) - Adicionar campo de seleção

---

## ⚠️ Notas Importantes

1. **Migration**: 
   - **Porquê**: O Entity Framework precisa sincronizar o modelo com o banco de dados
   - Após adicionar o campo `CategoriaInspecao`, será necessário criar e executar uma migration
   - A migration adicionará a coluna com valor padrão 0 (Ligeiro), garantindo compatibilidade

2. **Dados Existentes**: 
   - **Porquê**: Tipos de viatura já criados não têm categoria definida
   - Tipos de viatura existentes terão o valor padrão `Ligeiro` (0) automaticamente
   - **Ação necessária**: Pode ser necessário atualizar manualmente os registros existentes se alguns forem Pesados ou Ligeiros de Mercadorias
   - **Sugestão**: Criar um script SQL ou usar a interface para atualizar em massa

3. **Validação**: 
   - **Porquê**: O AutoMapper precisa saber como mapear o novo campo entre entidades e DTOs
   - Certifique-se de que o AutoMapper está configurado para mapear o novo campo `CategoriaInspecao`
   - **Onde verificar**: `Frotas.API.Infrastructure/Mapper/MappingProfiles.cs`
   - Geralmente o AutoMapper mapeia automaticamente campos com o mesmo nome, mas verifique se há configurações customizadas

4. **Testes**: 
   - **Porquê**: A lógica de cálculo é complexa, especialmente para Ligeiros
   - Teste especialmente o cálculo para veículos ligeiros, pois tem lógica mais complexa (bienal vs anual baseado na idade)
   - **Cenários a testar**:
     - Veículo ligeiro com 3 anos: não deve ter inspeção ainda
     - Veículo ligeiro com 5 anos: próxima inspeção em 2 anos (bienal)
     - Veículo ligeiro com 9 anos: próxima inspeção em 1 ano (anual)
     - Veículo de mercadorias: sempre anual após primeira inspeção
     - Veículo pesado: sempre anual após primeira inspeção

