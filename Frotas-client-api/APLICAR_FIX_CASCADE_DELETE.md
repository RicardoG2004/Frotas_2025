# 🔧 Aplicar Fix: Cascade Delete para Viaturas

## ✅ Alterações Feitas no Código

Foram adicionadas configurações de **cascade delete** no `ApplicationDbContext.cs` para as seguintes relações:

### Relações Many-to-Many (Tabelas de Junção)
- ✅ `ViaturaEquipamento` → Cascade ao remover viatura
- ✅ `ViaturaGarantia` → Cascade ao remover viatura  
- ✅ `ViaturaSeguro` → Cascade ao remover viatura
- ✅ `ViaturaCondutor` → Cascade ao remover viatura

### Relações One-to-Many (Entidades Dependentes)
- ✅ `ViaturaInspecao` → Cascade ao remover viatura
- ✅ `ViaturaAcidente` → Cascade ao remover viatura
- ✅ `ViaturaMulta` → Cascade ao remover viatura

---

## 📝 Passos para Aplicar

### 1. Criar Migration

Abra o **Package Manager Console** no Visual Studio ou use a linha de comandos:

```powershell
# No diretório: Frotas-client-api\Frotas.API.Infrastructure

# Via Package Manager Console (no Visual Studio)
Add-Migration -Context ApplicationDbContext -OutputDir Persistence/Migrations ConfigureCascadeDeleteViaturaRelations

# OU via .NET CLI
dotnet ef migrations add ConfigureCascadeDeleteViaturaRelations --context ApplicationDbContext --output-dir Persistence/Migrations --project Frotas.API.Infrastructure --startup-project ../Frotas.API.WebApi
```

### 2. Rever a Migration Gerada

Abra o ficheiro gerado em `Persistence/Migrations/[timestamp]_ConfigureCascadeDeleteViaturaRelations.cs`

**Verifique que contém algo como:**

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // Alterações nas foreign keys para adicionar ON DELETE CASCADE
    
    migrationBuilder.DropForeignKey(
        name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
        schema: "Frotas",
        table: "ViaturaEquipamento");
        
    migrationBuilder.AddForeignKey(
        name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
        schema: "Frotas",
        table: "ViaturaEquipamento",
        column: "ViaturaId",
        principalSchema: "Frotas",
        principalTable: "Viatura",
        principalColumn: "Id",
        onDelete: ReferentialAction.Cascade);
        
    // ... (repetir para outras tabelas)
}
```

### 3. Aplicar Migration em DEV

**⚠️ IMPORTANTE: Testar primeiro em ambiente de desenvolvimento!**

```powershell
# Via Package Manager Console
Update-Database -Context ApplicationDbContext

# OU via .NET CLI
dotnet ef database update --context ApplicationDbContext --project Frotas.API.Infrastructure --startup-project ../Frotas.API.WebApi
```

### 4. Testar a Correção

1. **Criar uma viatura** com 3 equipamentos
2. **Editar a viatura** e remover 1 equipamento
3. **Guardar** - deve funcionar sem erros
4. **Reabrir** a viatura - deve mostrar apenas 2 equipamentos
5. **Remover todos** os equipamentos - deve funcionar
6. Repetir teste com **garantias** e **seguros**

---

## 🧪 Script de Teste SQL (Opcional)

Para verificar se as constraints foram atualizadas:

```sql
-- Verificar as foreign keys da tabela ViaturaEquipamento
SELECT 
    fk.name AS constraint_name,
    tp.name AS parent_table,
    cp.name AS parent_column,
    tr.name AS referenced_table,
    cr.name AS referenced_column,
    fk.delete_referential_action_desc
FROM 
    sys.foreign_keys AS fk
    INNER JOIN sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.tables AS tp ON fkc.parent_object_id = tp.object_id
    INNER JOIN sys.columns AS cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
    INNER JOIN sys.tables AS tr ON fkc.referenced_object_id = tr.object_id
    INNER JOIN sys.columns AS cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
WHERE 
    tp.name IN ('ViaturaEquipamento', 'ViaturaGarantia', 'ViaturaSeguro', 'ViaturaCondutor')
    AND tr.name = 'Viatura'
ORDER BY 
    tp.name;
```

**Resultado esperado:**
- `delete_referential_action_desc` deve ser `CASCADE` para as relações com `Viatura`

---

## 📊 Aplicar em PRODUÇÃO

**⚠️ CUIDADO: Backup obrigatório antes de aplicar em produção!**

### Passo 1: Fazer Backup
```sql
-- No SQL Server Management Studio
-- Right-click na database → Tasks → Back Up...
-- OU executar:
BACKUP DATABASE [FrotasDB] TO DISK = 'C:\Backups\FrotasDB_BeforeCascadeDelete.bak'
```

### Passo 2: Aplicar Migration
```powershell
# Em PRODUÇÃO, com connection string de produção
Update-Database -Context ApplicationDbContext

# OU via script SQL direto (gerado pela migration)
dotnet ef migrations script --context ApplicationDbContext --output migration.sql
# Executar o migration.sql no SQL Server
```

### Passo 3: Verificar
- Testar remoção de equipamentos em viatura de teste
- Monitorizar logs de erro
- Verificar com utilizadores que tudo funciona

---

## 🔄 Rollback (Se Necessário)

Se algo correr mal, pode fazer rollback:

```powershell
# Voltar para a migration anterior
Update-Database -Context ApplicationDbContext -Migration PreviousMigrationName

# OU restaurar backup
RESTORE DATABASE [FrotasDB] FROM DISK = 'C:\Backups\FrotasDB_BeforeCascadeDelete.bak'
```

---

## ✅ Checklist Completo

- [ ] Código atualizado no `ApplicationDbContext.cs`
- [ ] Migration criada
- [ ] Migration revisada
- [ ] Backup da base de dados DEV
- [ ] Migration aplicada em DEV
- [ ] Testes funcionais em DEV
  - [ ] Remover 1 equipamento
  - [ ] Remover todos equipamentos
  - [ ] Remover garantias
  - [ ] Remover seguros
  - [ ] Remover condutores
- [ ] Backup da base de dados PROD
- [ ] Migration aplicada em PROD
- [ ] Testes em PROD
- [ ] Notificar utilizadores que o bug foi corrigido

---

## 📞 Suporte

Em caso de problemas:
1. Verificar logs do backend
2. Verificar constraints no SQL Server
3. Contactar desenvolvedor que implementou o fix

**Data da Correção:** 2025-01-03  
**Desenvolvedor:** IA Assistant  
**Issue:** Impossível remover equipamentos/garantias de viaturas (InvalidOperationException)

