using System.Linq;
using AutoMapper;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.ConcelhoService.DTOs;
using Frotas.API.Application.Services.Base.DistritoService.DTOs;
using Frotas.API.Application.Services.Base.FreguesiaService.DTOs;
using Frotas.API.Application.Services.Base.PaisService.DTOs;
using Frotas.API.Application.Services.Base.RuaService.DTOs;
using Frotas.API.Application.Services.Base.LocalizacaoService.DTOs;
using Frotas.API.Application.Services.Base.TaxaIvaService.DTOs;
using Frotas.API.Application.Services.Base.SetorService.DTOs;
using Frotas.API.Application.Services.Base.ConservatoriaService.DTOs;
using Frotas.API.Application.Services.Base.DelegacaoService.DTOs;
using Frotas.API.Application.Services.Base.TerceiroService.DTOs;
using Frotas.API.Application.Services.Base.EntidadeService.DTOs;
using Frotas.API.Application.Services.Base.CargoService.DTOs;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Application.Services.Base.FornecedorService.DTOs;
using Frotas.API.Application.Services.Base.FseService.DTOs;
using Frotas.API.Application.Services.Base.GarantiaService.DTOs;
using Frotas.API.Application.Services.Frotas.CorService.DTOs;
using Frotas.API.Application.Services.Frotas.CategoriaService.DTOs;
using Frotas.API.Application.Services.Frotas.MarcaService.DTOs;
using Frotas.API.Application.Services.Frotas.ModeloService.DTOs;
using Frotas.API.Application.Services.Frotas.CombustivelService.DTOs;
using Frotas.API.Application.Services.Frotas.PecaService.DTOs;
using Frotas.API.Application.Services.Frotas.ServicoService.DTOs;
using Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs;
using Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs;
using Frotas.API.Application.Services.Frotas.SeguroService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.ManutencaoService.DTOs;
using Frotas.API.Domain.Entities.Base;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Infrastructure.Mapper
{
  public class MappingProfiles : Profile // automapper mapping configurations
  {
    public MappingProfiles()
    {
      // pais mappings
      _ = CreateMap<Pais, PaisDTO>();
      _ = CreateMap<CreatePaisRequest, Pais>();
      _ = CreateMap<UpdatePaisRequest, Pais>();

      // codigopostal mappings
      _ = CreateMap<CodigoPostal, CodigoPostalDTO>();
      _ = CreateMap<CreateCodigoPostalRequest, CodigoPostal>();
      _ = CreateMap<UpdateCodigoPostalRequest, CodigoPostal>();

      // distrito mappings
      _ = CreateMap<Distrito, DistritoDTO>();
      _ = CreateMap<CreateDistritoRequest, Distrito>()
        .ForMember(dest => dest.Pais, opt => opt.Ignore());
      _ = CreateMap<UpdateDistritoRequest, Distrito>()
        .ForMember(dest => dest.Pais, opt => opt.Ignore());

      // concelho mappings
      _ = CreateMap<Concelho, ConcelhoDTO>();
      _ = CreateMap<CreateConcelhoRequest, Concelho>()
        .ForMember(dest => dest.Distrito, opt => opt.Ignore());
      _ = CreateMap<UpdateConcelhoRequest, Concelho>()
        .ForMember(dest => dest.Distrito, opt => opt.Ignore());

      // freguesia mappings
      _ = CreateMap<Freguesia, FreguesiaDTO>();
      _ = CreateMap<CreateFreguesiaRequest, Freguesia>()
        .ForMember(dest => dest.Concelho, opt => opt.Ignore());
      _ = CreateMap<UpdateFreguesiaRequest, Freguesia>()
        .ForMember(dest => dest.Concelho, opt => opt.Ignore());

      // rua mappings
      _ = CreateMap<Rua, RuaDTO>();
      _ = CreateMap<CreateRuaRequest, Rua>()
        .ForMember(dest => dest.Freguesia, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore());
      _ = CreateMap<UpdateRuaRequest, Rua>()
        .ForMember(dest => dest.Freguesia, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore());

      // localizacao mappings
      _ = CreateMap<Localizacao, LocalizacaoDTO>();
      _ = CreateMap<CreateLocalizacaoRequest, Localizacao>();
      _ = CreateMap<UpdateLocalizacaoRequest, Localizacao>();


      // TaxasIva mappings
      _ = CreateMap<TaxaIva, TaxaIvaDTO>();
      _ = CreateMap<CreateTaxaIvaRequest, TaxaIva>();
      _ = CreateMap<UpdateTaxaIvaRequest, TaxaIva>(); 
      
      // Setores mappings
      _ = CreateMap<Setor, SetorDTO>();
      _ = CreateMap<CreateSetorRequest, Setor>();
      _ = CreateMap<UpdateSetorRequest, Setor>();
      
      // Conservatorias mappings
      _ = CreateMap<Conservatoria, ConservatoriaDTO>();
      _ = CreateMap<CreateConservatoriaRequest, Conservatoria>();
      _ = CreateMap<UpdateConservatoriaRequest, Conservatoria>();

      // Delegacoes mappings
      _ = CreateMap<Delegacao, DelegacaoDTO>();
      _ = CreateMap<CreateDelegacaoRequest, Delegacao>();
      _ = CreateMap<UpdateDelegacaoRequest, Delegacao>();

      // Terceiros mappings
      _ = CreateMap<Terceiro, TerceiroDTO>();
      _ = CreateMap<CreateTerceiroRequest, Terceiro>();
      _ = CreateMap<UpdateTerceiroRequest, Terceiro>();
      
      // Entidades mappings
      _ = CreateMap<Entidade, EntidadeDTO>();
      _ = CreateMap<CreateEntidadeRequest, Entidade>();
      _ = CreateMap<UpdateEntidadeRequest, Entidade>();

      // Cargos mappings
      _ = CreateMap<Cargo, CargoDTO>();
      _ = CreateMap<CreateCargoRequest, Cargo>();
      _ = CreateMap<UpdateCargoRequest, Cargo>();

      // Funcionarios mappings
      _ = CreateMap<Funcionario, FuncionarioDTO>();
      _ = CreateMap<CreateFuncionarioRequest, Funcionario>();
      _ = CreateMap<UpdateFuncionarioRequest, Funcionario>();

      // Cores mappings
      _ = CreateMap<Cor, CorDTO>();
      _ = CreateMap<CreateCorRequest, Cor>();
      _ = CreateMap<UpdateCorRequest, Cor>();
      
      // Garantias mappings
      _ = CreateMap<Garantia, GarantiaDTO>();
      _ = CreateMap<CreateGarantiaRequest, Garantia>();
      _ = CreateMap<UpdateGarantiaRequest, Garantia>();

      // Marcas mappings
      _ = CreateMap<Marca, MarcaDTO>();
      _ = CreateMap<CreateMarcaRequest, Marca>();
      _ = CreateMap<UpdateMarcaRequest, Marca>();

      // Modelos mappings
      _ = CreateMap<Modelo, ModeloDTO>();
      _ = CreateMap<CreateModeloRequest, Modelo>()
        .ForMember(dest => dest.Marca, opt => opt.Ignore());
      _ = CreateMap<UpdateModeloRequest, Modelo>()
        .ForMember(dest => dest.Marca, opt => opt.Ignore());

      // Categorias mappings
      _ = CreateMap<Categoria, CategoriaDTO>();
      _ = CreateMap<CreateCategoriaRequest, Categoria>();
      _ = CreateMap<UpdateCategoriaRequest, Categoria>();

      // Combustiveis mappings
      _ = CreateMap<Combustivel, CombustivelDTO>();
      _ = CreateMap<CreateCombustivelRequest, Combustivel>();
      _ = CreateMap<UpdateCombustivelRequest, Combustivel>();

      // Fornecedores mappings
      _ = CreateMap<Fornecedor, FornecedorDTO>();
      _ = CreateMap<CreateFornecedorRequest, Fornecedor>()
        .ForMember(dest => dest.CodigoPostalEscritorio, opt => opt.Ignore())
        .ForMember(dest => dest.PaisEscritorio, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostalCarga, opt => opt.Ignore())
        .ForMember(dest => dest.PaisCarga, opt => opt.Ignore());
      _ = CreateMap<UpdateFornecedorRequest, Fornecedor>()
        .ForMember(dest => dest.CodigoPostalEscritorio, opt => opt.Ignore())
        .ForMember(dest => dest.PaisEscritorio, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostalCarga, opt => opt.Ignore())
        .ForMember(dest => dest.PaisCarga, opt => opt.Ignore());

      // Fses mappings
      _ = CreateMap<Fse, FseDTO>();
      _ = CreateMap<CreateFseRequest, Fse>()
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore())
        .ForMember(dest => dest.Pais, opt => opt.Ignore());
      _ = CreateMap<UpdateFseRequest, Fse>()
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore())
        .ForMember(dest => dest.Pais, opt => opt.Ignore());

      // Pecas mappings
      _ = CreateMap<Peca, PecaDTO>();
      _ = CreateMap<CreatePecaRequest, Peca>()
        .ForMember(dest => dest.TaxaIva, opt => opt.Ignore())
        .ForMember(dest => dest.CustoTotal, opt => opt.Ignore());
      _ = CreateMap<UpdatePecaRequest, Peca>()
        .ForMember(dest => dest.TaxaIva, opt => opt.Ignore())
        .ForMember(dest => dest.CustoTotal, opt => opt.Ignore());

      // Servicos mappings
      _ = CreateMap<Servico, ServicoDTO>();
      _ = CreateMap<CreateServicoRequest, Servico>()
        .ForMember(dest => dest.TaxaIva, opt => opt.Ignore())
        .ForMember(dest => dest.CustoTotal, opt => opt.Ignore());
      _ = CreateMap<UpdateServicoRequest, Servico>()
        .ForMember(dest => dest.TaxaIva, opt => opt.Ignore())
        .ForMember(dest => dest.CustoTotal, opt => opt.Ignore());

      // Equipamentos mappings
      _ = CreateMap<Equipamento, EquipamentoDTO>();
      _ = CreateMap<CreateEquipamentoRequest, Equipamento>();
      _ = CreateMap<UpdateEquipamentoRequest, Equipamento>();

      // TipoViaturas mappings
      _ = CreateMap<TipoViatura, TipoViaturaDTO>();
      _ = CreateMap<CreateTipoViaturaRequest, TipoViatura>();
      _ = CreateMap<UpdateTipoViaturaRequest, TipoViatura>();

      // Seguradoras mappings
      _ = CreateMap<Seguradora, SeguradoraDTO>();
      _ = CreateMap<CreateSeguradoraRequest, Seguradora>();
      _ = CreateMap<UpdateSeguradoraRequest, Seguradora>();

      // Seguros mappings
      _ = CreateMap<Seguro, SeguroDTO>();
      _ = CreateMap<CreateSeguroRequest, Seguro>();
      _ = CreateMap<UpdateSeguroRequest, Seguro>();

      // Viaturas mappings
      _ = CreateMap<ViaturaInspecao, ViaturaInspecaoDTO>();
      _ = CreateMap<ViaturaAcidente, ViaturaAcidenteDTO>();
      _ = CreateMap<ViaturaMulta, ViaturaMultaDTO>();
      _ = CreateMap<ViaturaCondutor, ViaturaCondutorDTO>()
        .ForMember(
          dest => dest.FuncionarioId,
          opt => opt.MapFrom(src => src.FuncionarioId)
        )
        .ForMember(
          dest => dest.Nome,
          opt => opt.MapFrom(src => src.Funcionario != null ? src.Funcionario.Nome : null)
        )
        .ForMember(
          dest => dest.Documentos,
          opt => opt.MapFrom(src => src.Documentos)
        );
      _ = CreateMap<ViaturaCondutorUpsertDTO, ViaturaCondutor>()
        .ForMember(dest => dest.FuncionarioId, opt => opt.MapFrom(src => src.FuncionarioId))
        .ForMember(dest => dest.Documentos, opt => opt.MapFrom(src => src.Documentos))
        .ForMember(dest => dest.Funcionario, opt => opt.Ignore())
        .ForMember(dest => dest.Viatura, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaId, opt => opt.Ignore())
        .ForMember(dest => dest.Id, opt => opt.Ignore())
        .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
        .ForMember(dest => dest.CreatedOn, opt => opt.Ignore())
        .ForMember(dest => dest.LastModifiedBy, opt => opt.Ignore())
        .ForMember(dest => dest.LastModifiedOn, opt => opt.Ignore());
      _ = CreateMap<Viatura, ViaturaDTO>()
        .ForMember(
          dest => dest.Marca,
          opt => opt.MapFrom(src => src.Marca)
        )
        .ForMember(
          dest => dest.Modelo,
          opt => opt.MapFrom(src => src.Modelo)
        )
        .ForMember(
          dest => dest.Equipamentos,
          opt => opt.MapFrom(src => src.ViaturaEquipamentos.Select(ve => ve.Equipamento))
        )
        .ForMember(
          dest => dest.EquipamentoIds,
          opt => opt.MapFrom(src => src.ViaturaEquipamentos.Select(ve => ve.EquipamentoId))
        )
        .ForMember(
          dest => dest.Garantias,
          opt => opt.MapFrom(src => src.ViaturaGarantias.Select(vg => vg.Garantia))
        )
        .ForMember(
          dest => dest.GarantiaIds,
          opt => opt.MapFrom(src => src.ViaturaGarantias.Select(vg => vg.GarantiaId))
        )
        .ForMember(
          dest => dest.Seguros,
          opt => opt.MapFrom(src => src.ViaturaSeguros.Select(vs => vs.Seguro))
        )
        .ForMember(
          dest => dest.SeguroIds,
          opt => opt.MapFrom(src => src.ViaturaSeguros.Select(vs => vs.SeguroId))
        )
        .ForMember(
          dest => dest.Condutores,
          opt => opt.MapFrom(src => src.ViaturaCondutores)
        )
        .ForMember(
          dest => dest.CondutorIds,
          opt => opt.MapFrom(src => src.ViaturaCondutores.Select(vc => vc.FuncionarioId))
        )
        .ForMember(
          dest => dest.Inspecoes,
          opt => opt.MapFrom(src => src.ViaturaInspecoes)
        )
        .ForMember(
          dest => dest.Acidentes,
          opt => opt.MapFrom(src => src.ViaturaAcidentes)
        )
        .ForMember(
          dest => dest.Multas,
          opt => opt.MapFrom(src => src.ViaturaMultas)
        )
        .ForMember(
          dest => dest.EntidadeFornecedoraTipo,
          opt => opt.MapFrom(src => 
            src.FornecedorId.HasValue ? "fornecedor" : 
            src.TerceiroId.HasValue ? "terceiro" : 
            null)
        );
      _ = CreateMap<CreateViaturaRequest, Viatura>()
        .ForMember(dest => dest.Marca, opt => opt.Ignore())
        .ForMember(dest => dest.Modelo, opt => opt.Ignore())
        .ForMember(dest => dest.TipoViatura, opt => opt.Ignore())
        .ForMember(dest => dest.Cor, opt => opt.Ignore())
        .ForMember(dest => dest.Combustivel, opt => opt.Ignore())
        .ForMember(dest => dest.Conservatoria, opt => opt.Ignore())
        .ForMember(dest => dest.Categoria, opt => opt.Ignore())
        .ForMember(dest => dest.Localizacao, opt => opt.Ignore())
        .ForMember(dest => dest.Setor, opt => opt.Ignore())
        .ForMember(dest => dest.Delegacao, opt => opt.Ignore())
        .ForMember(dest => dest.Terceiro, opt => opt.Ignore())
        .ForMember(dest => dest.Fornecedor, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaEquipamentos, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaGarantias, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaSeguros, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaInspecoes, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaAcidentes, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaMultas, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaCondutores, opt => opt.Ignore());
      _ = CreateMap<UpdateViaturaRequest, Viatura>()
        .ForMember(dest => dest.Marca, opt => opt.Ignore())
        .ForMember(dest => dest.Modelo, opt => opt.Ignore())
        .ForMember(dest => dest.MarcaId, opt => opt.MapFrom(src => src.MarcaId))
        .ForMember(dest => dest.ModeloId, opt => opt.MapFrom(src => src.ModeloId))
        .ForMember(dest => dest.TipoViatura, opt => opt.Ignore())
        .ForMember(dest => dest.Cor, opt => opt.Ignore())
        .ForMember(dest => dest.Combustivel, opt => opt.Ignore())
        .ForMember(dest => dest.Conservatoria, opt => opt.Ignore())
        .ForMember(dest => dest.Categoria, opt => opt.Ignore())
        .ForMember(dest => dest.Localizacao, opt => opt.Ignore())
        .ForMember(dest => dest.Setor, opt => opt.Ignore())
        .ForMember(dest => dest.Delegacao, opt => opt.Ignore())
        .ForMember(dest => dest.Terceiro, opt => opt.Ignore())
        .ForMember(dest => dest.Fornecedor, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaEquipamentos, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaGarantias, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaSeguros, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaInspecoes, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaAcidentes, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaMultas, opt => opt.Ignore())
        .ForMember(dest => dest.ViaturaCondutores, opt => opt.Ignore());

      // Manutencoes mappings
      _ = CreateMap<Manutencao, ManutencaoDTO>();
      _ = CreateMap<CreateManutencaoRequest, Manutencao>()
        .ForMember(dest => dest.Fse, opt => opt.Ignore())
        .ForMember(dest => dest.Funcionario, opt => opt.Ignore())
        .ForMember(dest => dest.Viatura, opt => opt.Ignore());
      _ = CreateMap<UpdateManutencaoRequest, Manutencao>()
        .ForMember(dest => dest.Fse, opt => opt.Ignore())
        .ForMember(dest => dest.Funcionario, opt => opt.Ignore())
        .ForMember(dest => dest.Viatura, opt => opt.Ignore())
        .ForMember(dest => dest.ManutencaoServicos, opt => opt.Ignore());
      _ = CreateMap<CreateManutencaoRequest, Manutencao>()
        .ForMember(dest => dest.Fse, opt => opt.Ignore())
        .ForMember(dest => dest.Funcionario, opt => opt.Ignore())
        .ForMember(dest => dest.Viatura, opt => opt.Ignore())
        .ForMember(dest => dest.ManutencaoServicos, opt => opt.Ignore());
      _ = CreateMap<ManutencaoServico, ManutencaoServicoDTO>();
      _ = CreateMap<CreateManutencaoServicoRequest, ManutencaoServico>()
        .ForMember(dest => dest.Manutencao, opt => opt.Ignore())
        .ForMember(dest => dest.Servico, opt => opt.Ignore());

      // add new entity mappings here...
    }
  }
}
