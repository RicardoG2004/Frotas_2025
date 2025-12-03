# 🔧 Correção Urgente: Problema ao Remover Equipamentos de Viaturas

## 📋 Resumo do Problema

**Erro:** `InvalidOperationException` - The association between entity types 'Viatura' and 'ViaturaEquipamento' has been severed

**Impacto:** Impossível remover equipamentos, garantias ou seguros de viaturas existentes

**Causa:** Relação many-to-many não está configurada com cascade delete no Entity Framework

---

## 🔍 Análise Técnica

### Dados dos Logs

```
[UpdateViatura] Payload enviado:
{
  equipamentoIds: Array(1),  // Removeu equipamentos - tinha mais antes
  garantiaIds: Array(1),
  condutorIds: Array(0)
}

Resposta do Backend:
400 Bad Request
"The association between entity types 'Viatura' and 'ViaturaEquipamento' has been severed..."
```

### O Que Funciona ✅
- ✅ Criar viatura com equipamentos
- ✅ Adicionar mais equipamentos a viatura existente
- ✅ Atualizar viatura sem mexer nos equipamentos

### O Que NÃO Funciona ❌
- ❌ **Remover** equipamentos de viatura existente
- ❌ Limpar todos os equipamentos (enviar array vazio)

---

## 🛠️ Soluções (Backend .NET)

### **Solução 1: Configurar Cascade Delete (Recomendado)**

No `DbContext` ou na configuração da entidade:

```csharp
// Em ViaturaDbContext.cs ou ViaturaConfiguration.cs

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Configurar relação many-to-many com cascade delete
    modelBuilder.Entity<ViaturaEquipamento>()
        .HasOne(ve => ve.Viatura)
        .WithMany(v => v.ViaturaEquipamentos)
        .HasForeignKey(ve => ve.ViaturaId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<ViaturaEquipamento>()
        .HasOne(ve => ve.Equipamento)
        .WithMany(e => e.ViaturaEquipamentos)
        .HasForeignKey(ve => ve.EquipamentoId)
        .OnDelete(DeleteBehavior.Restrict); // Não deletar o equipamento

    // Repetir para ViaturaGarantia
    modelBuilder.Entity<ViaturaGarantia>()
        .HasOne(vg => vg.Viatura)
        .WithMany(v => v.ViaturaGarantias)
        .HasForeignKey(vg => vg.ViaturaId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<ViaturaGarantia>()
        .HasOne(vg => vg.Garantia)
        .WithMany(g => g.ViaturaGarantias)
        .HasForeignKey(vg => vg.GarantiaId)
        .OnDelete(DeleteBehavior.Restrict);

    // Repetir para ViaturaSeguro (se aplicável)
}
```

**Depois criar e aplicar migration:**
```bash
dotnet ef migrations add ConfigureCascadeDeleteViaturaRelations
dotnet ef database update
```

---

### **Solução 2: Limpar Manualmente as Relações (Alternativa)**

No serviço ou repositório que atualiza a Viatura:

```csharp
public async Task<Viatura> UpdateViaturaAsync(string id, UpdateViaturaDTO dto)
{
    var viatura = await _context.Viaturas
        .Include(v => v.ViaturaEquipamentos)
        .Include(v => v.ViaturaGarantias)
        .Include(v => v.ViaturaSeguros)
        .FirstOrDefaultAsync(v => v.Id == id);

    if (viatura == null)
        throw new NotFoundException("Viatura não encontrada");

    // *** SOLUÇÃO: Limpar relações existentes ANTES de atualizar ***
    
    // Remover todos os equipamentos atuais
    _context.ViaturaEquipamentos.RemoveRange(viatura.ViaturaEquipamentos);
    
    // Remover todas as garantias atuais
    _context.ViaturaGarantias.RemoveRange(viatura.ViaturaGarantias);
    
    // Remover todos os seguros atuais
    _context.ViaturaSeguros.RemoveRange(viatura.ViaturaSeguros);

    // Salvar as remoções
    await _context.SaveChangesAsync();

    // Agora atualizar a viatura com os novos dados
    _mapper.Map(dto, viatura);

    // Adicionar as novas relações
    if (dto.EquipamentoIds?.Any() == true)
    {
        foreach (var equipamentoId in dto.EquipamentoIds)
        {
            viatura.ViaturaEquipamentos.Add(new ViaturaEquipamento
            {
                ViaturaId = viatura.Id,
                EquipamentoId = equipamentoId
            });
        }
    }

    if (dto.GarantiaIds?.Any() == true)
    {
        foreach (var garantiaId in dto.GarantiaIds)
        {
            viatura.ViaturaGarantias.Add(new ViaturaGarantia
            {
                ViaturaId = viatura.Id,
                GarantiaId = garantiaId
            });
        }
    }

    if (dto.SeguroIds?.Any() == true)
    {
        foreach (var seguroId in dto.SeguroIds)
        {
            viatura.ViaturaSeguros.Add(new ViaturaSeguro
            {
                ViaturaId = viatura.Id,
                SeguroId = seguroId
            });
        }
    }

    await _context.SaveChangesAsync();
    return viatura;
}
```

---

### **Solução 3: Usar Clear() e AddRange() (Mais Elegante)**

```csharp
public async Task<Viatura> UpdateViaturaAsync(string id, UpdateViaturaDTO dto)
{
    var viatura = await _context.Viaturas
        .Include(v => v.ViaturaEquipamentos)
        .Include(v => v.ViaturaGarantias)
        .Include(v => v.ViaturaSeguros)
        .FirstOrDefaultAsync(v => v.Id == id);

    if (viatura == null)
        throw new NotFoundException("Viatura não encontrada");

    // Atualizar campos simples
    _mapper.Map(dto, viatura);

    // Atualizar equipamentos - limpar e adicionar novos
    viatura.ViaturaEquipamentos.Clear();
    if (dto.EquipamentoIds?.Any() == true)
    {
        var novosEquipamentos = dto.EquipamentoIds.Select(id => new ViaturaEquipamento
        {
            ViaturaId = viatura.Id,
            EquipamentoId = id
        }).ToList();
        
        viatura.ViaturaEquipamentos.AddRange(novosEquipamentos);
    }

    // Atualizar garantias
    viatura.ViaturaGarantias.Clear();
    if (dto.GarantiaIds?.Any() == true)
    {
        var novasGarantias = dto.GarantiaIds.Select(id => new ViaturaGarantia
        {
            ViaturaId = viatura.Id,
            GarantiaId = id
        }).ToList();
        
        viatura.ViaturaGarantias.AddRange(novasGarantias);
    }

    // Atualizar seguros
    viatura.ViaturaSeguros.Clear();
    if (dto.SeguroIds?.Any() == true)
    {
        var novosSeguros = dto.SeguroIds.Select(id => new ViaturaSeguro
        {
            ViaturaId = viatura.Id,
            SeguroId = id
        }).ToList();
        
        viatura.ViaturaSeguros.AddRange(novosSeguros);
    }

    await _context.SaveChangesAsync();
    return viatura;
}
```

---

## 🎯 Recomendação

**Implementar SOLUÇÃO 1 (Cascade Delete)** + **SOLUÇÃO 3 (Clear/AddRange)**

1. Configurar cascade delete nas migrations
2. Usar `Clear()` + `AddRange()` no update
3. Isso garante que funciona mesmo sem a migration aplicada

---

## 📝 Checklist

- [ ] Configurar `OnDelete(DeleteBehavior.Cascade)` para `ViaturaEquipamento`
- [ ] Configurar `OnDelete(DeleteBehavior.Cascade)` para `ViaturaGarantia`
- [ ] Configurar `OnDelete(DeleteBehavior.Cascade)` para `ViaturaSeguro` (se existe)
- [ ] Criar migration
- [ ] Aplicar migration em DEV
- [ ] Atualizar método `UpdateViaturaAsync` para usar `Clear()` + `AddRange()`
- [ ] Testar remoção de equipamento
- [ ] Testar remoção de garantia
- [ ] Testar enviar arrays vazios
- [ ] Aplicar migration em PROD

---

## 🧪 Como Testar

1. Criar uma viatura com 3 equipamentos
2. Editar a viatura e remover 1 equipamento (deixar só 2)
3. Guardar
4. **Resultado esperado:** Viatura guardada com sucesso, apenas 2 equipamentos
5. **Resultado atual (sem fix):** Erro 400 - InvalidOperationException

---

## 🚨 Impacto

**Severidade:** ALTA  
**Urgência:** ALTA  
**Módulos Afetados:** Viaturas, Equipamentos, Garantias, Seguros  
**Utilizadores Afetados:** Todos que tentarem remover equipamentos/garantias

---

## 📞 Contacto

Se tiver dúvidas sobre esta correção, contacte o desenvolvedor frontend que reportou o problema.

**Data do Report:** 2025-01-03  
**Versão Frontend:** Atual  
**Backend Framework:** .NET Entity Framework Core

