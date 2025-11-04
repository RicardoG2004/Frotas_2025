using AutoMapper;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.ConcelhoService.DTOs;
using Frotas.API.Application.Services.Base.DistritoService.DTOs;
using Frotas.API.Application.Services.Base.EntidadeContactoService.DTOs;
using Frotas.API.Application.Services.Base.EntidadeService.DTOs;
using Frotas.API.Application.Services.Base.EpocaService.DTOs;
using Frotas.API.Application.Services.Base.FreguesiaService.DTOs;
using Frotas.API.Application.Services.Base.PaisService.DTOs;
using Frotas.API.Application.Services.Base.RuaService.DTOs;
using Frotas.API.Application.Services.Base.RubricaService.DTOs;
using Frotas.API.Application.Services.Base.TaxaIvaService.DTOs;
using Frotas.API.Application.Services.Base.SetorService.DTOs;
using Frotas.API.Application.Services.Frotas.CoveiroService.DTOs;
using Frotas.API.Application.Services.Frotas.CategoriaService.DTOs;
using Frotas.API.Application.Services.Frotas.MarcaService.DTOs;
using Frotas.API.Application.Services.Frotas.ModeloService.DTOs;
using Frotas.API.Application.Services.Frotas.CombustivelService.DTOs;
using Frotas.API.Application.Services.Frotas.FornecedorService.DTOs;
using Frotas.API.Application.Services.Frotas.PecaService.DTOs;
using Frotas.API.Application.Services.Frotas.ServicoService.DTOs;
using Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs;

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

      // entidade mappings
      _ = CreateMap<Entidade, EntidadeDTO>()
        .ForMember(dest => dest.Contactos, opt => opt.MapFrom(src => src.Contactos)); // Explicitly map Contactos (safe - no circular ref in DTO)
      _ = CreateMap<CreateEntidadeRequest, Entidade>()
        .ForMember(dest => dest.Contactos, opt => opt.Ignore());
      _ = CreateMap<UpdateEntidadeRequest, Entidade>()
        .ForMember(dest => dest.Contactos, opt => opt.Ignore());


      // entidade contacto mappings
      _ = CreateMap<EntidadeContacto, EntidadeContactoDTO>(); // Note: Does not map back to Entidade (safe)
      _ = CreateMap<CreateEntidadeContactoRequest, EntidadeContacto>()
        .ForMember(dest => dest.Entidade, opt => opt.Ignore());
      _ = CreateMap<UpdateEntidadeContactoRequest, EntidadeContacto>()
        .ForMember(dest => dest.Entidade, opt => opt.Ignore());

      // epoca mappings
      _ = CreateMap<Epoca, EpocaDTO>()
        .ForMember(
          dest => dest.EpocaAnterior,
          opt =>
            opt.MapFrom(src =>
              src.EpocaAnterior != null
                ? new EpocaDTO
                {
                  Id = src.EpocaAnterior.Id,
                  Ano = src.EpocaAnterior.Ano,
                  Descricao = src.EpocaAnterior.Descricao,
                  Predefinida = src.EpocaAnterior.Predefinida,
                  Bloqueada = src.EpocaAnterior.Bloqueada,
                  EpocaAnteriorId = src.EpocaAnterior.EpocaAnteriorId,
                  CreatedOn = src.EpocaAnterior.CreatedOn,
                }
                : null
            )
        );
      _ = CreateMap<CreateEpocaRequest, Epoca>()
        .ForMember(dest => dest.Ano, opt => opt.MapFrom(src => src.Ano))
        .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
        .ForMember(dest => dest.Predefinida, opt => opt.MapFrom(src => src.Predefinida))
        .ForMember(dest => dest.Bloqueada, opt => opt.MapFrom(src => src.Bloqueada))
        .ForMember(
          dest => dest.EpocaAnteriorId,
          opt =>
            opt.MapFrom(src =>
              string.IsNullOrEmpty(src.EpocaAnteriorId)
                ? (Guid?)null
                : Guid.Parse(src.EpocaAnteriorId)
            )
        );
      _ = CreateMap<UpdateEpocaRequest, Epoca>();

      // rubrica mappings
      _ = CreateMap<Rubrica, RubricaDTO>();
      _ = CreateMap<CreateRubricaRequest, Rubrica>();
      _ = CreateMap<UpdateRubricaRequest, Rubrica>();

      // TaxasIva mappings
      _ = CreateMap<TaxaIva, TaxaIvaDTO>();
      _ = CreateMap<CreateTaxaIvaRequest, TaxaIva>();
      _ = CreateMap<UpdateTaxaIvaRequest, TaxaIva>(); 
      
      // Setores mappings
      _ = CreateMap<Setor, SetorDTO>();
      _ = CreateMap<CreateSetorRequest, Setor>();
      _ = CreateMap<UpdateSetorRequest, Setor>();

       // Coveiros mappings
      _ = CreateMap<Coveiro, CoveiroDTO>();
      _ = CreateMap<CreateCoveiroRequest, Coveiro>()
        .ForMember(dest => dest.Rua, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore());
      _ = CreateMap<UpdateCoveiroRequest, Coveiro>()
        .ForMember(dest => dest.Rua, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore());

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

      // add new entity mappings here...
    }
  }
}
