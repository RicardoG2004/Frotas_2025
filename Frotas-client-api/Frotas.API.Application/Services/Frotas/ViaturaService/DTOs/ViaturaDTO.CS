using System;
using System.Collections.Generic;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
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
    public Guid TerceiroId { get; set; }
    public TerceiroDTO Terceiro { get; set; }
    public Guid FornecedorId { get; set; }
    public FornecedorDTO Fornecedor { get; set; }
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
    public ICollection<SeguroDTO> Seguros { get; set; } = new List<SeguroDTO>();
    public string NotasAdicionais { get; set; }
    public int AnoImpostoSelo { get; set; }
    public int AnoImpostoCirculacao { get; set; }
    public DateTime DataValidadeSelo { get; set; }
    public string URLImagem1 { get; set; }
    public string URLImagem2 { get; set; }
    public ICollection<Guid> EquipamentoIds { get; set; } = new List<Guid>();
    public ICollection<EquipamentoDTO> Equipamentos { get; set; } = new List<EquipamentoDTO>();
    public DateTime CreatedOn { get; set; }
  }
}