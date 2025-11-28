using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs
{
  public class UpdateViaturaRequest : IDto
  {
    public required string Matricula { get; set; }
    public string? CountryCode { get; set; }
    public int? AnoFabrico { get; set; }
    public int? MesFabrico { get; set; }
    public DateTime? DataAquisicao { get; set; }
    public DateTime? DataLivrete { get; set; }
    public Guid? MarcaId { get; set; }
    public Guid? ModeloId { get; set; }
    public Guid? TipoViaturaId { get; set; }
    public Guid? CorId { get; set; }
    public Guid? CombustivelId { get; set; }
    public TipoPropulsao? TipoPropulsao { get; set; }
    public Guid? ConservatoriaId { get; set; }
    public Guid? CategoriaId { get; set; }
    public Guid? LocalizacaoId { get; set; }
    public Guid? SetorId { get; set; }
    public Guid? DelegacaoId { get; set; }
    public int? Numero { get; set; }
    public decimal? Custo { get; set; }
    public decimal? DespesasIncluidas { get; set; }
    public decimal? ConsumoMedio { get; set; }
    public decimal? Autonomia { get; set; }
    public Guid? TerceiroId { get; set; }
    public Guid? FornecedorId { get; set; }
    public string? EntidadeFornecedoraTipo { get; set; }
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
    public ICollection<Guid> SeguroIds { get; set; } = new List<Guid>();
    public string? NotasAdicionais { get; set; }
    public string? CartaoCombustivel { get; set; }
    public int? AnoImpostoSelo { get; set; }
    public int? AnoImpostoCirculacao { get; set; }
    public DateTime? DataValidadeSelo { get; set; }
    public ICollection<Guid> EquipamentoIds { get; set; } = new List<Guid>();
    public ICollection<Guid> GarantiaIds { get; set; } = new List<Guid>();
    public ICollection<Guid> CondutorIds { get; set; } = new List<Guid>();
    public ICollection<ViaturaInspecaoUpsertDTO> Inspecoes { get; set; } = new List<ViaturaInspecaoUpsertDTO>();
    public ICollection<ViaturaAcidenteUpsertDTO> Acidentes { get; set; } = new List<ViaturaAcidenteUpsertDTO>();
    public ICollection<ViaturaMultaUpsertDTO> Multas { get; set; } = new List<ViaturaMultaUpsertDTO>();
  }

  public class UpdateViaturaValidator : AbstractValidator<UpdateViaturaRequest>
  {
    public UpdateViaturaValidator()
    {
      // Campos obrigatórios
      _ = RuleFor(x => x.Matricula).NotEmpty();

      // Validações condicionais apenas quando os campos são preenchidos
      _ = RuleFor(x => x.AnoFabrico)
        .GreaterThan(1900)
        .When(x => x.AnoFabrico.HasValue && x.AnoFabrico.Value > 0);
      _ = RuleFor(x => x.MesFabrico)
        .InclusiveBetween(1, 12)
        .When(x => x.MesFabrico.HasValue && x.MesFabrico.Value > 0);
      _ = RuleFor(x => x.Numero)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Numero.HasValue);
      _ = RuleFor(x => x.Custo)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Custo.HasValue);
      _ = RuleFor(x => x.DespesasIncluidas)
        .GreaterThanOrEqualTo(0)
        .When(x => x.DespesasIncluidas.HasValue);
      _ = RuleFor(x => x.ConsumoMedio)
        .GreaterThanOrEqualTo(0)
        .When(x => x.ConsumoMedio.HasValue);
      _ = RuleFor(x => x.NQuadro)
        .GreaterThanOrEqualTo(0)
        .When(x => x.NQuadro.HasValue);
      _ = RuleFor(x => x.NMotor)
        .GreaterThanOrEqualTo(0)
        .When(x => x.NMotor.HasValue);
      _ = RuleFor(x => x.Cilindrada)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Cilindrada.HasValue);
      _ = RuleFor(x => x.Potencia)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Potencia.HasValue);
      _ = RuleFor(x => x.Tara)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Tara.HasValue);
      _ = RuleFor(x => x.Lotacao)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Lotacao.HasValue);
      _ = RuleFor(x => x.CargaUtil)
        .GreaterThanOrEqualTo(0)
        .When(x => x.CargaUtil.HasValue);
      _ = RuleFor(x => x.Comprimento)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Comprimento.HasValue);
      _ = RuleFor(x => x.Largura)
        .GreaterThanOrEqualTo(0)
        .When(x => x.Largura.HasValue);
      _ = RuleFor(x => x.ValorTotalContrato)
        .GreaterThanOrEqualTo(0)
        .When(x => x.ValorTotalContrato.HasValue);
      _ = RuleFor(x => x.NRendas)
        .GreaterThanOrEqualTo(0)
        .When(x => x.NRendas.HasValue);
      _ = RuleFor(x => x.ValorRenda)
        .GreaterThanOrEqualTo(0)
        .When(x => x.ValorRenda.HasValue);
      _ = RuleFor(x => x.ValorResidual)
        .GreaterThanOrEqualTo(0)
        .When(x => x.ValorResidual.HasValue);
      _ = RuleFor(x => x.AnoImpostoSelo)
        .GreaterThanOrEqualTo(1900)
        .When(x => x.AnoImpostoSelo.HasValue && x.AnoImpostoSelo.Value > 0);
      _ = RuleFor(x => x.AnoImpostoCirculacao)
        .GreaterThanOrEqualTo(1900)
        .When(x => x.AnoImpostoCirculacao.HasValue && x.AnoImpostoCirculacao.Value > 0);

      // Validação condicional para entidade fornecedora removida
      // A normalização no service já garante que o tipo e os IDs sejam consistentes
      // Se o tipo estiver definido mas o ID não estiver, a normalização limpa o tipo

      // Validação condicional para datas (apenas se preenchidas)
      _ = RuleFor(x => x.DataFinal)
        .GreaterThanOrEqualTo(x => x.DataInicial)
        .When(x => x.DataInicial != default && x.DataFinal != default);

      // Validações para inspeções (apenas se houver inspeções)
      _ = RuleForEach(x => x.Inspecoes).ChildRules(inspection =>
      {
        _ = inspection.RuleFor(i => i.DataProximaInspecao)
          .GreaterThan(i => i.DataInspecao)
          .When(i => i.DataInspecao != default && i.DataProximaInspecao != default)
          .WithMessage("A data da próxima inspeção deve ser posterior à data da inspeção.");
      });
      _ = RuleFor(x => x.Inspecoes).Custom((inspecoes, context) =>
      {
        if (inspecoes == null || inspecoes.Count < 2)
        {
          return;
        }

        List<ViaturaInspecaoUpsertDTO> ordered = inspecoes.ToList();
        for (int i = 0; i < ordered.Count - 1; i++)
        {
          ViaturaInspecaoUpsertDTO current = ordered[i];
          ViaturaInspecaoUpsertDTO next = ordered[i + 1];

          if (next.DataInspecao <= current.DataInspecao)
          {
            context.AddFailure(
              $"Inspecoes[{i + 1}].DataInspecao",
              "As inspeções devem ser registadas por ordem cronológica."
            );
          }

          if (next.DataInspecao != current.DataProximaInspecao)
          {
            context.AddFailure(
              $"Inspecoes[{i}].DataProximaInspecao",
              "A data da próxima inspeção deve coincidir com a data da inspeção seguinte."
            );
          }
        }
      });
    }
  }
}

