using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Frotas.API.Domain.Entities.Common;

namespace Frotas.API.Domain.Entities.Frotas
{
  public enum PeriodicidadeSeguro
  {
    Mensal = 0,
    Trimestral = 1,
    Anual = 2
  }

  public enum MetodoPagamentoSeguro
  {
    Transferencia = 0,
    MBWay = 2,
    Multibanco = 3,
    CartaoDebito = 4,
    CartaoCredito = 5,
    PayPal = 6,
    ApplePay = 7,
    GooglePay = 8,
    Dinheiro = 9,
    Cheque = 10,
    Outro = 11
  }

  [Table("Seguro", Schema = "Frotas")]
  public class Seguro : AuditableEntity
  {
    public string Designacao { get; set; }
    public string Apolice { get; set; }
    public Guid SeguradoraId { get; set; }
    public Seguradora Seguradora { get; set; }
    public bool AssistenciaViagem { get; set; }
    public bool CartaVerde { get; set; }
    public decimal ValorCobertura { get; set; }
    public decimal CustoAnual { get; set; }
    public string RiscosCobertos { get; set; }
    public DateTime DataInicial { get; set; }
    public DateTime DataFinal { get; set; }
    public PeriodicidadeSeguro Periodicidade { get; set; } = PeriodicidadeSeguro.Anual;
    public MetodoPagamentoSeguro? MetodoPagamento { get; set; }
    public DateTime? DataPagamento { get; set; }
    // Campo para armazenar documentos anexados ao seguro (JSON com array de documentos)
    public string? Documentos { get; set; }
    public ICollection<ViaturaSeguro> ViaturaSeguros { get; set; } = new List<ViaturaSeguro>();
  }
}