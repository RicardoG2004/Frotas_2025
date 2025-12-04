using System;
using System.Collections.Generic;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
using Frotas.API.Application.Services.Base.GarantiaService.DTOs;
using Frotas.API.Application.Services.Base.FornecedorService.DTOs;
using Frotas.API.Application.Services.Base.LocalizacaoService.DTOs;
using Frotas.API.Application.Services.Base.SetorService.DTOs;
using Frotas.API.Application.Services.Base.TerceiroService.DTOs;
using Frotas.API.Application.Services.Frotas.CombustivelService.DTOs;
using Frotas.API.Application.Services.Frotas.CorService.DTOs;
using Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs;
using Frotas.API.Application.Services.Frotas.CategoriaService.DTOs;
using Frotas.API.Application.Services.Frotas.MarcaService.DTOs;
using Frotas.API.Application.Services.Frotas.ModeloService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguroService.DTOs;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs;
using Frotas.API.Application.Services.Base.ConservatoriaService.DTOs;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs
{
  public class ViaturaDTO : IDto
  {
    public Guid Id { get; set; }
    public string Matricula { get; set; }
    public int AnoFabrico { get; set; }
    public int MesFabrico { get; set; }
    public DateTime DataAquisicao { get; set; }
    public DateTime DataLivrete { get; set; }
    public Guid MarcaId { get; set; }
    public MarcaDTO Marca { get; set; }
    public Guid ModeloId { get; set; }
    public ModeloDTO Modelo { get; set; }
    public Guid TipoViaturaId { get; set; }
    public TipoViaturaDTO TipoViatura { get; set; }
    public Guid CorId { get; set; }
    public CorDTO Cor { get; set; }
    public Guid CombustivelId { get; set; }
    public CombustivelDTO Combustivel { get; set; }
    public TipoPropulsao? TipoPropulsao { get; set; }
    public Guid ConservatoriaId { get; set; }
    public ConservatoriaDTO Conservatoria { get; set; }
    public Guid CategoriaId { get; set; }
    public CategoriaDTO Categoria { get; set; }
    public Guid LocalizacaoId { get; set; }
    public LocalizacaoDTO Localizacao { get; set; }
    public Guid SetorId { get; set; }
    public SetorDTO Setor { get; set; }
    public Guid DelegacaoId { get; set; }
    public DelegacaoDTO Delegacao { get; set; }
    public int Numero { get; set; }
    public decimal Custo { get; set; }
    public decimal DespesasIncluidas { get; set; }
    public decimal ConsumoMedio { get; set; }
    public Guid? TerceiroId { get; set; }
    public TerceiroDTO? Terceiro { get; set; }
    public Guid? FornecedorId { get; set; }
    public FornecedorDTO? Fornecedor { get; set; }
    public string? EntidadeFornecedoraTipo { get; set; }
    public int NQuadro { get; set; }
    public int NMotor { get; set; }
    public decimal Cilindrada { get; set; }
    public int Potencia { get; set; }
    public int? PotenciaMotorEletrico { get; set; }
    public int? PotenciaCombinada { get; set; }
    public decimal? CapacidadeBateria { get; set; }
    public decimal? ConsumoEletrico { get; set; }
    public decimal? TempoCarregamento { get; set; }
    public decimal? Autonomia { get; set; }
    public decimal? EmissoesCO2 { get; set; }
    public string? PadraoCO2 { get; set; }
    public decimal? VoltagemTotal { get; set; }
    public int Tara { get; set; }
    public int Lotacao { get; set; }
    public bool Marketing { get; set; }
    public bool Mercadorias { get; set; }
    public int CargaUtil { get; set; }
    public int Comprimento { get; set; }
    public int Largura { get; set; }
    public string PneusFrente { get; set; }
    public string PneusTras { get; set; }
    public string Contrato { get; set; }
    public DateTime DataInicial { get; set; }
    public DateTime DataFinal { get; set; }
    public decimal ValorTotalContrato { get; set; }
    public bool OpcaoCompra { get; set; }
    public int NRendas { get; set; }
    public decimal ValorRenda { get; set; }
    public decimal ValorResidual { get; set; }
    public ICollection<Guid> SeguroIds { get; set; } = new List<Guid>();
    public ICollection<SeguroDTO> Seguros { get; set; } = new List<SeguroDTO>();
    public string NotasAdicionais { get; set; }
    public int AnoImpostoSelo { get; set; }
    public int AnoImpostoCirculacao { get; set; }
    public DateTime DataValidadeSelo { get; set; }
    public string? Imagem { get; set; }
    public string? Documentos { get; set; }
    public string? CartaoCombustivel { get; set; }
    public ICollection<Guid> EquipamentoIds { get; set; } = new List<Guid>();
    public ICollection<Guid> GarantiaIds { get; set; } = new List<Guid>();
    public ICollection<EquipamentoDTO> Equipamentos { get; set; } = new List<EquipamentoDTO>();
    public ICollection<GarantiaDTO> Garantias { get; set; } = new List<GarantiaDTO>();
    public ICollection<Guid> CondutorIds { get; set; } = new List<Guid>();
    public ICollection<ViaturaCondutorDTO> Condutores { get; set; } = new List<ViaturaCondutorDTO>();
    public ICollection<ViaturaInspecaoDTO> Inspecoes { get; set; } = new List<ViaturaInspecaoDTO>();
    public ICollection<ViaturaAcidenteDTO> Acidentes { get; set; } = new List<ViaturaAcidenteDTO>();
    public ICollection<ViaturaMultaDTO> Multas { get; set; } = new List<ViaturaMultaDTO>();
    public DateTime CreatedOn { get; set; }
  }
}