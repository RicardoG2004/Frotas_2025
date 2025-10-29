using System.ComponentModel.DataAnnotations.Schema;
using GACloud.API.Domain.Entities.Common;

namespace GACloud.API.Domain.Entities.Cemiterios
{
  [Table("Sepultura", Schema = "Cemiterios")]
  public class Sepultura : AuditableEntity
  {
    public string Nome { get; set; }
    public Guid TalhaoId { get; set; }
    public Talhao Talhao { get; set; }
    public Guid SepulturaTipoId { get; set; }
    public SepulturaTipo SepulturaTipo { get; set; }
    public int SepulturaEstadoId { get; set; }
    public int SepulturaSituacaoId { get; set; }

    [Column("Largura", TypeName = "decimal(10, 2)")]
    public decimal? Largura { get; set; }

    [Column("Comprimento", TypeName = "decimal(10, 2)")]
    public decimal? Comprimento { get; set; }

    [Column("Area", TypeName = "decimal(10, 2)")]
    public decimal? Area { get; set; }

    [Column("Profundidade", TypeName = "decimal(10, 2)")]
    public decimal? Profundidade { get; set; }

    [Column("Fila", TypeName = "varchar(10)")]
    public string Fila { get; set; }

    [Column("Coluna", TypeName = "varchar(10)")]
    public string Coluna { get; set; }
    public DateTime? DataConcessao { get; set; }
    public DateTime? DataInicioAluguer { get; set; }
    public DateTime? DataFimAluguer { get; set; }
    public DateTime? DataInicioReserva { get; set; }
    public DateTime? DataFimReserva { get; set; }
    public DateTime? DataConhecimento { get; set; }
    public DateTime? DataAnulacao { get; set; }

    [Column("NumeroConhecimento", TypeName = "varchar(10)")]
    public string NumeroConhecimento { get; set; }
    public bool Fundura1 { get; set; } = true;
    public bool Fundura2 { get; set; }
    public bool Fundura3 { get; set; }
    public bool Anulado { get; set; }
    public string Observacao { get; set; }
    public bool Bloqueada { get; set; }
    public bool? Litigio { get; set; }
    public bool TemSvgShape { get; set; }
    public string ShapeId { get; set; }
    public ICollection<ProprietarioSepultura> Proprietarios { get; set; } = [];
  }
}
