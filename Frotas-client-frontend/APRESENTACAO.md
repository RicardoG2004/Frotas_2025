# Sistema de Gestão de Frotas

## 📋 Visão Geral

Sistema completo de gestão de frotas desenvolvido para autarquias, permitindo o controlo total sobre veículos, manutenções, utilizações e todas as operações relacionadas com a gestão de uma frota de viaturas.

---

## 🚗 Módulo de Frotas

### 1. Gestão de Viaturas

**Funcionalidade principal do sistema** - Gestão completa do registo e informações de todas as viaturas da frota.

#### Informações Gerais
- Matrícula e código do país
- Ano e mês de fabrico
- Data de aquisição e data do livrete
- Marca, modelo e tipo de viatura
- Cor e categoria
- Localização, setor e delegação

#### Informações Técnicas
- Tipo de propulsão (Combustão, Híbrido, Elétrico, Híbrido Plug-in)
- Combustível utilizado
- Número de quadro e motor
- Cilindrada, potência e capacidade da bateria
- Consumo médio e autonomia
- Emissões de CO₂
- Dimensões (comprimento, largura)
- Pneus (dianteiros e traseiros)
- Tara, lotação e carga útil

#### Informações Contratuais
- Contrato de arrendamento
- Datas inicial e final do contrato
- Valor total do contrato
- Opção de compra
- Número de rendas e valor da renda
- Valor residual
- Fornecedor ou terceiro associado

#### Informações Administrativas
- Conservatória
- Cartão de combustível
- Anos de imposto de selo e circulação
- Data de validade do selo
- Imagem da viatura
- Documentos associados
- Notas adicionais

#### Funcionalidades Adicionais
- Gestão de seguros associados
- Gestão de equipamentos instalados
- Gestão de garantias
- Gestão de inspecções
- Cálculo automático de IUC (Imposto Único de Circulação) baseado nos dados da viatura
- Registo de acidentes com histórico completo (condutor, data/hora, localização, culpa, descrição, danos, local de reparação)
- Registo de multas com controlo de custos (condutor, data/hora, local, motivo, valor)

---

### 2. Configurações de Frotas

#### 2.1 Peças
Gestão do catálogo de peças utilizadas nas manutenções e reparações das viaturas.

#### 2.2 Serviços
Gestão dos serviços disponíveis para as viaturas (reparações, revisões, etc.).

#### 2.3 Marcas
Gestão das marcas de veículos disponíveis no sistema.

#### 2.4 Modelos
Gestão dos modelos de veículos, associados às respetivas marcas.

#### 2.5 Categorias
Gestão das categorias de veículos (ligeiros, pesados, etc.).

#### 2.6 Tipos de Viatura
Gestão dos diferentes tipos de viaturas (automóvel, motociclo, camião, etc.).

#### 2.7 Cores
Gestão do catálogo de cores disponíveis para as viaturas.

#### 2.8 Seguradoras
Gestão das seguradoras com quem a autarquia trabalha.

#### 2.9 Seguros
Gestão dos tipos de seguros disponíveis (seguro automóvel, seguro de responsabilidade civil, etc.).

#### 2.10 Equipamentos
Gestão dos equipamentos que podem ser instalados nas viaturas (GPS, rádios, etc.).

---

### 3. Gestão de Utilizações

Controlo das utilizações de viaturas por funcionários, permitindo:
- Registar quando um funcionário utiliza uma viatura
- Controlar períodos de utilização
- Histórico de utilizações por funcionário e por viatura

---

### 4. Gestão de Abastecimentos

Controlo dos abastecimentos de combustível:
- Registar abastecimentos por funcionário
- Controlar custos de combustível
- Análise de consumo por viatura
- Histórico completo de abastecimentos

---

### 5. Gestão de Oficina

#### 5.1 Manutenções
Gestão completa das manutenções realizadas nas viaturas:
- Registar manutenções preventivas e corretivas
- Associar peças e serviços utilizados
- Cálculo automático de totais (sem IVA, IVA e total com IVA)
- Controlo de custos de manutenção
- Histórico completo de manutenções por viatura
- Gestão de fornecedores de serviços externos

#### 5.2 Reservas de Oficinas
Gestão de reservas de oficinas por funcionário:
- Agendar manutenções e reparações
- Controlar disponibilidade de viaturas
- Gestão de períodos de indisponibilidade

---

## ⚙️ Módulo de Utilitários

### 1. Tabelas Geográficas

Gestão completa da estrutura geográfica:

#### 1.1 Países
Gestão do registo de países.

#### 1.2 Distritos
Gestão dos distritos de Portugal.

#### 1.3 Concelhos
Gestão dos concelhos, associados aos respetivos distritos.

#### 1.4 Freguesias
Gestão das freguesias, associadas aos respetivos concelhos.

#### 1.5 Códigos Postais
Gestão dos códigos postais, permitindo localização precisa.

#### 1.6 Ruas
Gestão do registo de ruas e vias públicas.

#### 1.7 Localizações
Gestão de localizações específicas utilizadas no sistema.

---

### 2. Tabelas de Configurações

#### 2.1 Conservatórias
Gestão das conservatórias do registo automóvel.

#### 2.2 Delegações
Gestão das delegações da autarquia.

#### 2.3 Garantias
Gestão dos tipos de garantias disponíveis.

#### 2.4 Entidades
Gestão das entidades relacionadas com a autarquia.

#### 2.5 Cargos
Gestão dos cargos dos funcionários.

#### 2.6 Fornecedores
Gestão dos fornecedores de produtos e serviços.

#### 2.7 Fornecedores Serviços Externos (FSE)
Gestão específica de fornecedores de serviços externos (oficinas, etc.).

#### 2.8 Funcionários
Gestão do registo de funcionários da autarquia.

#### 2.9 Taxas de IVA
Gestão das taxas de IVA aplicáveis.

#### 2.10 Setores
Gestão dos setores/departamentos da autarquia.

#### 2.11 Outros Devedores/Credores (Terceiros)
Gestão de terceiros (devedores e credores) relacionados com a autarquia.

---

## 🔐 Sistema de Permissões

O sistema possui um controlo rigoroso de permissões:
- **Módulos**: Acesso controlado por módulo (Frotas, Utilitários)
- **Funcionalidades**: Permissões específicas por funcionalidade dentro de cada módulo
- **Ações**: Controlo de acções (Ver, Adicionar, Alterar, Eliminar)
- **Roles**: Diferentes níveis de acesso (Client, Guest)

---

## 🎨 Características Técnicas

### Interface do Utilizador
- Interface moderna e responsiva
- Suporte a múltiplos temas (colorful, theme-color, pastel, vibrant, neon, neon-cyberpunk)
- Sistema de janelas múltiplas
- Dashboard personalizado
- Navegação intuitiva com menus hierárquicos

### Funcionalidades Avançadas
- Gestão de múltiplas janelas
- Histórico de navegação
- Sistema de abas (tabs)
- Upload de imagens e documentos
- Validação de formulários
- Tratamento de erros robusto
- Gestão de memória otimizada

### Segurança
- Autenticação de utilizadores
- Protecção de rotas por licença
- Protecção de rotas por permissões
- Armazenamento seguro de dados sensíveis

---

## 📊 Benefícios do Sistema

1. **Controlo Total**: Gestão completa de todas as viaturas e operações relacionadas
2. **Rastreabilidade**: Histórico completo de utilizações, manutenções, abastecimentos, acidentes e multas
3. **Otimização de Custos**: Controlo detalhado de custos de manutenção, combustível, seguros, IUC, multas e acidentes
4. **Conformidade**: Gestão de documentos, inspecções e seguros em dia
5. **Eficiência**: Agendamento e gestão de reservas de oficinas
6. **Análise**: Dados organizados para análise de consumo, custos e padrões de utilização
7. **Flexibilidade**: Sistema configurável e adaptável às necessidades da autarquia
8. **Automação**: Cálculos automáticos (IUC, totais de manutenção) que poupam tempo e reduzem erros
9. **Gestão de Riscos**: Controlo de acidentes e multas permite identificar padrões e tomar acções preventivas

---

## 🚀 Conclusão

O Sistema de Gestão de Frotas oferece uma solução completa e integrada para a gestão de frotas de autarquias, cobrindo desde o registo de viaturas até à gestão de manutenções, utilizações, abastecimentos, acidentes e multas, com um sistema robusto de permissões e uma interface moderna e intuitiva.

