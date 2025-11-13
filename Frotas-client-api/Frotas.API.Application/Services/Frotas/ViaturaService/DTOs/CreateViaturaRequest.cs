using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs
{
  public class CreateViaturaRequest : IDto
  {
    public required string Matricula { get; set; }
    public int AnoFabrico { get; set; }
    public int MesFabrico { get; set; }
    public DateTime DataAquisicao { get; set; }
    public DateTime DataLivrete { get; set; }
    public Guid MarcaId { get; set; }
    public Guid ModeloId { get; set; }
    public Guid TipoViaturaId { get; set; }
    public Guid CorId { get; set; }
    public Guid CombustivelId { get; set; }
    public Guid ConservatoriaId { get; set; }
    public Guid CategoriaId { get; set; }
    public Guid LocalizacaoId { get; set; }
    public Guid SetorId { get; set; }
    public Guid DelegacaoId { get; set; }
    public int Numero { get; set; }
    public decimal Custo { get; set; }
    public decimal DespesasIncluidas { get; set; }
    public decimal ConsumoMedio { get; set; }
    public Guid? TerceiroId { get; set; }
    public Guid? FornecedorId { get; set; }
    public string EntidadeFornecedoraTipo { get; set; } = string.Empty;
    public int NQuadro { get; set; }
    public int NMotor { get; set; }
    public decimal Cilindrada { get; set; }
    public int Potencia { get; set; }
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
    public string NotasAdicionais { get; set; }
    public int AnoImpostoSelo { get; set; }
    public int AnoImpostoCirculacao { get; set; }
    public DateTime DataValidadeSelo { get; set; }
    public string URLImagem1 { get; set; }
    public string URLImagem2 { get; set; }
    public ICollection<Guid> EquipamentoIds { get; set; } = new List<Guid>();
    public ICollection<Guid> GarantiaIds { get; set; } = new List<Guid>();
    public ICollection<ViaturaInspecaoUpsertDTO> Inspecoes { get; set; } = new List<ViaturaInspecaoUpsertDTO>();
  }

  public class CreateViaturaValidator : AbstractValidator<CreateViaturaRequest>
  {
    public CreateViaturaValidator()
    {
      _ = RuleFor(x => x.Matricula).NotEmpty();
      _ = RuleFor(x => x.AnoFabrico).GreaterThan(1900);
      _ = RuleFor(x => x.MesFabrico).InclusiveBetween(1, 12);
      _ = RuleFor(x => x.DataAquisicao).NotEmpty();
      _ = RuleFor(x => x.DataLivrete).NotEmpty();
      _ = RuleFor(x => x.MarcaId).NotEmpty();
      _ = RuleFor(x => x.ModeloId).NotEmpty();
      _ = RuleFor(x => x.TipoViaturaId).NotEmpty();
      _ = RuleFor(x => x.CorId).NotEmpty();
      _ = RuleFor(x => x.CombustivelId).NotEmpty();
      _ = RuleFor(x => x.ConservatoriaId).NotEmpty();
      _ = RuleFor(x => x.CategoriaId).NotEmpty();
      _ = RuleFor(x => x.LocalizacaoId).NotEmpty();
      _ = RuleFor(x => x.SetorId).NotEmpty();
      _ = RuleFor(x => x.DelegacaoId).NotEmpty();
      _ = RuleFor(x => x.Numero).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Custo).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.DespesasIncluidas).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.ConsumoMedio).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.EntidadeFornecedoraTipo)
        .NotEmpty()
        .Must(tipo =>
        {
          string? trimmed = tipo?.Trim();
          return string.Equals(trimmed, "fornecedor", StringComparison.OrdinalIgnoreCase)
            || string.Equals(trimmed, "terceiro", StringComparison.OrdinalIgnoreCase);
        })
        .WithMessage("O tipo de entidade fornecedora é inválido. Selecione 'Fornecedor' ou 'Outros Devedores/Credores'.");
      _ = RuleFor(x => x)
        .Custom((request, context) =>
        {
          string? tipo = request.EntidadeFornecedoraTipo?.Trim();
          if (string.Equals(tipo, "fornecedor", StringComparison.OrdinalIgnoreCase))
          {
            if (!request.FornecedorId.HasValue || request.FornecedorId == Guid.Empty)
            {
              context.AddFailure(nameof(request.FornecedorId), "Selecione o fornecedor.");
            }
          }
          else if (string.Equals(tipo, "terceiro", StringComparison.OrdinalIgnoreCase))
          {
            if (!request.TerceiroId.HasValue || request.TerceiroId == Guid.Empty)
            {
              context.AddFailure(nameof(request.TerceiroId), "Selecione o outro devedor/credor.");
            }
          }
          else
          {
            context.AddFailure(nameof(request.EntidadeFornecedoraTipo), "Selecione o tipo de entidade fornecedora.");
          }
        });
      _ = RuleFor(x => x.NQuadro).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.NMotor).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Cilindrada).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Potencia).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Tara).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Lotacao).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.CargaUtil).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Comprimento).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.Largura).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.DataInicial).NotEmpty();
      _ = RuleFor(x => x.DataFinal).NotEmpty().GreaterThanOrEqualTo(x => x.DataInicial);
      _ = RuleFor(x => x.ValorTotalContrato).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.NRendas).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.ValorRenda).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.ValorResidual).GreaterThanOrEqualTo(0);
      _ = RuleFor(x => x.SeguroIds)
        .NotNull()
        .Must(ids => ids.Count > 0)
        .WithMessage("Selecione pelo menos um seguro");
      _ = RuleFor(x => x.AnoImpostoSelo).GreaterThanOrEqualTo(1900);
      _ = RuleFor(x => x.AnoImpostoCirculacao).GreaterThanOrEqualTo(1900);
      _ = RuleFor(x => x.DataValidadeSelo).NotEmpty();
      _ = RuleFor(x => x.EquipamentoIds)
        .NotNull()
        .Must(ids => ids.Count > 0)
        .WithMessage("Selecione pelo menos um equipamento");
      _ = RuleFor(x => x.GarantiaIds)
        .NotNull()
        .Must(ids => ids.Count > 0)
        .WithMessage("Selecione pelo menos uma garantia");
      _ = RuleForEach(x => x.Inspecoes).ChildRules(inspection =>
      {
        _ = inspection.RuleFor(i => i.DataInspecao).NotEmpty();
        _ = inspection.RuleFor(i => i.Resultado).NotEmpty();
        _ = inspection.RuleFor(i => i.DataProximaInspecao)
          .NotEmpty()
          .GreaterThan(i => i.DataInspecao)
          .WithMessage("A data da próxima inspeção deve ser posterior à data da inspeção.");
      });
      _ = RuleFor(x => x.Inspecoes).Custom((inspecoes, context) =>
      {
        if (inspecoes == null)
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

