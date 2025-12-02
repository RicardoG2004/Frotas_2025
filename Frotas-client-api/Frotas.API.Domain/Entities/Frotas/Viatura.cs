using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  public enum TipoPropulsao
  {
    Combustao = 0,
    Hibrido = 1,
    Eletrico = 2,
    HibridoPlugIn = 3
  }

  [Table("Viatura", Schema = "Frotas")]
  public class Viatura : AuditableEntity
  {
    public string Matricula { get; set; }
    public string? CountryCode { get; set; }
    public int? AnoFabrico { get; set; }
    public int? MesFabrico { get; set; }
    public DateTime? DataAquisicao { get; set; }
    public DateTime? DataLivrete { get; set; }
    public Guid? MarcaId { get; set; }
    public Marca? Marca { get; set; }
    public Guid? ModeloId { get; set; }
    public Modelo? Modelo { get; set; }
    public Guid? TipoViaturaId { get; set; }
    public TipoViatura? TipoViatura { get; set; }
    public Guid? CorId { get; set; }
    public Cor? Cor { get; set; }
    public Guid? CombustivelId { get; set; }
    public Combustivel? Combustivel { get; set; }
    public TipoPropulsao? TipoPropulsao { get; set; }
    public Guid? ConservatoriaId { get; set; }
    public Conservatoria? Conservatoria { get; set; }
    public Guid? CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }
    public Guid? LocalizacaoId { get; set; }
    public Localizacao? Localizacao { get; set; }
    public Guid? SetorId { get; set; }
    public Setor? Setor { get; set; }
    public Guid? DelegacaoId { get; set; }
    public Delegacao? Delegacao { get; set; }
    public int? Numero { get; set; }
    public decimal? Custo { get; set; }
    public decimal? DespesasIncluidas { get; set; }
    public decimal? ConsumoMedio { get; set; }
    public decimal? Autonomia { get; set; }
    public Guid? TerceiroId { get; set; }
    public Terceiro? Terceiro { get; set; }
    public Guid? FornecedorId { get; set; }
    public Fornecedor? Fornecedor { get; set; }
    public int? NQuadro { get; set; }
    public int? NMotor { get; set; }
    public decimal? Cilindrada { get; set; }
    public decimal? CapacidadeBateria { get; set; }
    public int? Potencia { get; set; }
    public int? PotenciaMotorEletrico { get; set; }
    public int? PotenciaCombinada { get; set; }
    public decimal? ConsumoEletrico { get; set; }
    public decimal? TempoCarregamento { get; set; }
    public decimal? EmissoesCO2 { get; set; }
    public string? PadraoCO2 { get; set; }
    public decimal? VoltagemTotal { get; set; }
    public int? Tara { get; set; }
    public int? Lotacao { get; set; }
    public bool Marketing { get; set; }
    public bool Mercadorias { get; set; }
    public int? CargaUtil { get; set; }
    public int? Comprimento { get; set; }
    public int? Largura { get; set; }
    public string? PneusFrente { get; set; }
    public string? PneusTras { get; set; }
    public string? Contrato { get; set; }
    public DateTime? DataInicial { get; set; }
    public DateTime? DataFinal { get; set; }
    public decimal? ValorTotalContrato { get; set; }
    public bool OpcaoCompra { get; set; }
    public int? NRendas { get; set; }
    public decimal? ValorRenda { get; set; }
    public decimal? ValorResidual { get; set; }
    public ICollection<ViaturaSeguro> ViaturaSeguros { get; set; } = new List<ViaturaSeguro>();
    public string? NotasAdicionais { get; set; }
    public string? CartaoCombustivel { get; set; }
    public int? AnoImpostoSelo { get; set; }
    public int? AnoImpostoCirculacao { get; set; }
    public DateTime? DataValidadeSelo { get; set; }
    public string? Imagem { get; set; }
    public string? Documentos { get; set; }
    public ICollection<ViaturaEquipamento> ViaturaEquipamentos { get; set; } =
      new List<ViaturaEquipamento>();
    public ICollection<ViaturaGarantia> ViaturaGarantias { get; set; } = new List<ViaturaGarantia>();
    public ICollection<ViaturaInspecao> ViaturaInspecoes { get; set; } =
      new List<ViaturaInspecao>();
    public ICollection<ViaturaCondutor> ViaturaCondutores { get; set; } =
      new List<ViaturaCondutor>();
    public ICollection<ViaturaAcidente> ViaturaAcidentes { get; set; } =
      new List<ViaturaAcidente>();
    public ICollection<ViaturaMulta> ViaturaMultas { get; set; } =
      new List<ViaturaMulta>();
  }
}