using AutoMapper;
using GACloud.API.Application.Services.Base.CodigoPostalService.DTOs;
using GACloud.API.Application.Services.Base.ConcelhoService.DTOs;
using GACloud.API.Application.Services.Base.DistritoService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs;
using GACloud.API.Application.Services.Base.EntidadeService.DTOs;
using GACloud.API.Application.Services.Base.EpocaService.DTOs;
using GACloud.API.Application.Services.Base.FreguesiaService.DTOs;
using GACloud.API.Application.Services.Base.PaisService.DTOs;
using GACloud.API.Application.Services.Base.RuaService.DTOs;
using GACloud.API.Application.Services.Base.RubricaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CoveiroService.DTOs;
using GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs;
using GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs;
using GACloud.API.Domain.Entities.Base;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Infrastructure.Mapper
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
        .ForMember(dest => dest.Contactos, opt => opt.Ignore())
        .ForMember(dest => dest.Proprietarios, opt => opt.Ignore());
      _ = CreateMap<UpdateEntidadeRequest, Entidade>()
        .ForMember(dest => dest.Contactos, opt => opt.Ignore())
        .ForMember(dest => dest.Proprietarios, opt => opt.Ignore());

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

      // cemiterio mappings
      _ = CreateMap<Cemiterio, CemiterioDTO>(); // Note: Proprietarios collection not mapped in DTO (safe)
      _ = CreateMap<CreateCemiterioRequest, Cemiterio>()
        .ForMember(dest => dest.Proprietarios, opt => opt.Ignore());
      _ = CreateMap<UpdateCemiterioRequest, Cemiterio>()
        .ForMember(dest => dest.Proprietarios, opt => opt.Ignore());

      // Zona mappings
      _ = CreateMap<Zona, ZonaDTO>();
      _ = CreateMap<CreateZonaRequest, Zona>()
        .ForMember(dest => dest.Cemiterio, opt => opt.Ignore());
      _ = CreateMap<UpdateZonaRequest, Zona>()
        .ForMember(dest => dest.Cemiterio, opt => opt.Ignore());

      // Talhao mappings
      _ = CreateMap<Talhao, TalhaoDTO>();
      _ = CreateMap<CreateTalhaoRequest, Talhao>()
        .ForMember(dest => dest.Zona, opt => opt.Ignore());
      _ = CreateMap<UpdateTalhaoRequest, Talhao>()
        .ForMember(dest => dest.Zona, opt => opt.Ignore());

      // SepulturaTipodescricao mappings
      _ = CreateMap<SepulturaTipoDescricao, SepulturaTipoDescricaoDTO>();
      _ = CreateMap<CreateSepulturaTipoDescricaoRequest, SepulturaTipoDescricao>();
      _ = CreateMap<UpdateSepulturaTipoDescricaoRequest, SepulturaTipoDescricao>();

      // SepulturaTipo mappings
      _ = CreateMap<SepulturaTipo, SepulturaTipoDTO>();
      _ = CreateMap<CreateSepulturaTipoRequest, SepulturaTipo>()
        .ForMember(dest => dest.Epoca, opt => opt.Ignore())
        .ForMember(dest => dest.SepulturaTipoDescricao, opt => opt.Ignore());
      _ = CreateMap<UpdateSepulturaTipoRequest, SepulturaTipo>()
        .ForMember(dest => dest.Epoca, opt => opt.Ignore())
        .ForMember(dest => dest.SepulturaTipoDescricao, opt => opt.Ignore());

      // Sepultura mappings
      _ = CreateMap<Sepultura, SepulturaDTO>();
      _ = CreateMap<CreateSepulturaRequest, Sepultura>()
        .ForMember(dest => dest.Proprietarios, opt => opt.Ignore())
        .ForMember(dest => dest.Talhao, opt => opt.Ignore())
        .ForMember(dest => dest.SepulturaTipo, opt => opt.Ignore());
      _ = CreateMap<UpdateSepulturaRequest, Sepultura>()
        .ForMember(dest => dest.Proprietarios, opt => opt.Ignore())
        .ForMember(dest => dest.Talhao, opt => opt.Ignore())
        .ForMember(dest => dest.SepulturaTipo, opt => opt.Ignore());

      // Proprietario mappings
      _ = CreateMap<Proprietario, ProprietarioDTO>()
        .ForMember(dest => dest.Sepulturas, opt => opt.Ignore()); // Prevent circular reference
      _ = CreateMap<CreateProprietarioRequest, Proprietario>()
        .ForMember(dest => dest.Sepulturas, opt => opt.Ignore())
        .ForMember(dest => dest.Cemiterio, opt => opt.Ignore())
        .ForMember(dest => dest.Entidade, opt => opt.Ignore());
      _ = CreateMap<UpdateProprietarioRequest, Proprietario>()
        .ForMember(dest => dest.Sepulturas, opt => opt.Ignore())
        .ForMember(dest => dest.Cemiterio, opt => opt.Ignore())
        .ForMember(dest => dest.Entidade, opt => opt.Ignore());

      // Proprietario sepultura mappings
      _ = CreateMap<ProprietarioSepultura, ProprietarioSepulturaDTO>()
        .ForMember(dest => dest.Sepultura, opt => opt.Ignore()); // Prevent circular reference

      // AgenciaFuneraria mappings
      _ = CreateMap<AgenciaFuneraria, AgenciaFunerariaDTO>();
      _ = CreateMap<CreateAgenciaFunerariaRequest, AgenciaFuneraria>()
        .ForMember(dest => dest.Entidade, opt => opt.Ignore());
      _ = CreateMap<UpdateAgenciaFunerariaRequest, AgenciaFuneraria>()
        .ForMember(dest => dest.Entidade, opt => opt.Ignore());

      // Coveiros mappings
      _ = CreateMap<Coveiro, CoveiroDTO>();
      _ = CreateMap<CreateCoveiroRequest, Coveiro>()
        .ForMember(dest => dest.Rua, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore());
      _ = CreateMap<UpdateCoveiroRequest, Coveiro>()
        .ForMember(dest => dest.Rua, opt => opt.Ignore())
        .ForMember(dest => dest.CodigoPostal, opt => opt.Ignore());

      // DefuntoTipo mappings
      _ = CreateMap<DefuntoTipo, DefuntoTipoDTO>();
      _ = CreateMap<CreateDefuntoTipoRequest, DefuntoTipo>();
      _ = CreateMap<UpdateDefuntoTipoRequest, DefuntoTipo>();

      // add new entity mappings here...
    }
  }
}
