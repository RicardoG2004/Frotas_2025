using AutoMapper;
using GSLP.Application.Common.Helper;
using GSLP.Application.Common.Identity.DTOs;
using GSLP.Application.Services.Application.AplicacaoService.DTOs;
using GSLP.Application.Services.Application.AreaService.DTOs;
using GSLP.Application.Services.Application.FuncionalidadeService.DTOs;
using GSLP.Application.Services.Application.ModuloService.DTOs;
using GSLP.Application.Services.Platform.ClienteService.DTOs;
using GSLP.Application.Services.Platform.LicencaAPIKeyService.DTOs;
using GSLP.Application.Services.Platform.LicencaFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.LicencaModuloService.DTOs;
using GSLP.Application.Services.Platform.LicencaService.DTOs;
using GSLP.Application.Services.Platform.LicencaUtilizadorService.DTOs;
using GSLP.Application.Services.Platform.PerfilFuncionalidadeService.DTOs;
using GSLP.Application.Services.Platform.PerfilService.DTOs;
using GSLP.Application.Services.Platform.PerfilUtilizadorService.DTOs;
using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Domain.Entities.Common;

namespace GSLP.Infrastructure.Mapper
{
    public class MappingProfiles : Profile // automapper mapping configurations
    {
        public MappingProfiles()
        {
            // user mappings
            _ = CreateMap<ApplicationUser, UserDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToConsistentString()))
                .ForMember(
                    dest => dest.ClienteId,
                    opt =>
                        opt.MapFrom(src =>
                            src.ClienteId.HasValue ? src.ClienteId.Value.ToConsistentString() : null
                        )
                )
                .ForMember(
                    dest => dest.PerfisUtilizador,
                    opt =>
                        opt.MapFrom(src =>
                            src.PerfisUtilizadores.Select(p => p.PerfilId.ToConsistentString())
                        )
                )
                .ForMember(
                    dest => dest.LicencaId,
                    opt =>
                        opt.MapFrom(src =>
                            src.LicencasUtilizadores != null && src.LicencasUtilizadores.Any()
                                ? src
                                    .LicencasUtilizadores.FirstOrDefault()
                                    .LicencaId.ToConsistentString()
                                : null
                        )
                );
            _ = CreateMap<UpdateProfileRequest, ApplicationUser>();
            _ = CreateMap<UpdateUserRequest, ApplicationUser>();
            _ = CreateMap<RegisterUserRequest, ApplicationUser>()
                .ForMember(x => x.UserName, o => o.MapFrom(s => s.Email));
            _ = CreateMap<UserDto, UpdateProfileRequest>();
            _ = CreateMap<ApplicationUser, LicencaUtilizadorDTOFlat>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.ClienteId, opt => opt.MapFrom(src => src.ClienteId))
                .ForMember(dest => dest.Cliente, opt => opt.MapFrom(src => src.Cliente))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(src => src.CreatedOn));
            _ = CreateMap<UpdateAdminOrClientUserRequest, ApplicationUser>();

            // area amppings
            _ = CreateMap<Area, AreaDTO>();
            _ = CreateMap<CreateAreaRequest, Area>();
            _ = CreateMap<UpdateAreaRequest, Area>();

            // aplicacao mappings
            _ = CreateMap<Aplicacao, AplicacaoDTO>();
            _ = CreateMap<CreateAplicacaoRequest, Aplicacao>();
            _ = CreateMap<UpdateAplicacaoRequest, Aplicacao>();
            _ = CreateMap<Aplicacao, AplicacaoBasicDTO>();

            // modulo mappings
            _ = CreateMap<Modulo, ModuloDTO>();
            _ = CreateMap<CreateModuloRequest, Modulo>();
            _ = CreateMap<UpdateModuloRequest, Modulo>();
            _ = CreateMap<Modulo, PerfilModuloTreeDTO>()
                .ForMember(dest => dest.ModuloId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ModuloNome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(
                    dest => dest.Estado,
                    opt =>
                        opt.MapFrom(src =>
                            src
                                .Funcionalidades.Select(f => f.PerfisFuncionalidades) // Assuming the correct relationship
                                .All(pf => pf.Any(p => p.AuthVer))
                                ? 2
                                : 1
                        )
                ); // This checks if all Funcionalidades are authorized

            // funcionalidade mappings
            _ = CreateMap<Funcionalidade, FuncionalidadeDTO>();
            _ = CreateMap<CreateFuncionalidadeRequest, Funcionalidade>();
            _ = CreateMap<UpdateFuncionalidadeRequest, Funcionalidade>();
            _ = CreateMap<Funcionalidade, FuncionalidadeBasicDTO>();
            _ = CreateMap<Funcionalidade, PerfilFuncionalidadeTreeDTO>()
                .ForMember(dest => dest.FuncionalidadeId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FuncionalidadeNome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(
                    dest => dest.Estado,
                    opt =>
                        opt.MapFrom(src => src.PerfisFuncionalidades.All(pf => pf.AuthVer) ? 2 : 1)
                ) // Assuming all "Auth" options determine "Estado"
                .ForMember(
                    dest => dest.AuthVer,
                    opt => opt.MapFrom(src => src.PerfisFuncionalidades.Any(pf => pf.AuthVer))
                )
                .ForMember(
                    dest => dest.AuthAdd,
                    opt => opt.MapFrom(src => src.PerfisFuncionalidades.Any(pf => pf.AuthAdd))
                )
                .ForMember(
                    dest => dest.AuthChg,
                    opt => opt.MapFrom(src => src.PerfisFuncionalidades.Any(pf => pf.AuthChg))
                )
                .ForMember(
                    dest => dest.AuthDel,
                    opt => opt.MapFrom(src => src.PerfisFuncionalidades.Any(pf => pf.AuthDel))
                )
                .ForMember(
                    dest => dest.AuthPrt,
                    opt => opt.MapFrom(src => src.PerfisFuncionalidades.Any(pf => pf.AuthPrt))
                );
            // _ = CreateMap<Funcionalidade, PerfilFuncionalidadeDTO>()
            //     .ForMember(dest => dest.FuncionalidadeId, opt => opt.MapFrom(src => src.Id))
            //     .ForMember(dest => dest.FuncionalidadeNome, opt => opt.MapFrom(src => src.Nome));

            // cliente mappings
            _ = CreateMap<Cliente, ClienteDTO>();
            _ = CreateMap<CreateClienteRequest, Cliente>();
            _ = CreateMap<UpdateClienteRequest, Cliente>();
            _ = CreateMap<Cliente, ClienteBasicDTO>();

            // licenca mappings
            _ = CreateMap<Licenca, LicencaDTO>()
                .ForMember(
                    dest => dest.APIKey,
                    opt =>
                        opt.MapFrom(src =>
                            src.LicencaAPIKey != null ? src.LicencaAPIKey.APIKey : null
                        )
                );
            _ = CreateMap<CreateLicencaRequest, Licenca>();
            _ = CreateMap<UpdateLicencaRequest, Licenca>();
            _ = CreateMap<Licenca, LicencaModulosFuncionalidadesDTO>()
                .ForMember(
                    dest => dest.Modulos,
                    opt =>
                        opt.MapFrom(src =>
                            src.LicencasModulos.Select(lm => new LicencaModuloNomeDTO
                                {
                                    Id = lm.Modulo.Id,
                                    Nome = lm.Modulo.Nome,
                                    AplicacaoId = lm.Modulo.AplicacaoId,
                                })
                                .ToList()
                        )
                )
                .ForMember(
                    dest => dest.Funcionalidades,
                    opt =>
                        opt.MapFrom(src =>
                            src.LicencasFuncionalidades.Select(
                                    lf => new LicencaFuncionalidadeNomeDTO
                                    {
                                        Id = lf.Funcionalidade.Id.ToString(),
                                        Nome = lf.Funcionalidade.Nome,
                                        ModuloId = lf.Funcionalidade.ModuloId.ToString(),
                                    }
                                )
                                .ToList()
                        )
                );

            // perfil mappings
            _ = CreateMap<Perfil, PerfilDTO>();
            _ = CreateMap<Perfil, PerfilBasicDTO>();
            _ = CreateMap<CreatePerfilRequest, Perfil>();
            _ = CreateMap<CreatePerfilBasicRequest, Perfil>();
            _ = CreateMap<UpdatePerfilRequest, Perfil>();
            _ = CreateMap<PerfilBasicDTO, PerfilWithUtilizadoresDTO>();

            // perfilfuncionalidade mappings
            _ = CreateMap<PerfilFuncionalidadeAssociationRequest, PerfilFuncionalidade>();
            _ = CreateMap<PerfilFuncionalidadeOptionsAssociationRequest, PerfilFuncionalidade>();
            _ = CreateMap<
                PerfilFuncionalidadeAssociationRequest,
                PerfilFuncionalidadeAssociationRequest
            >();
            _ = CreateMap<PerfilFuncionalidade, PerfilFuncionalidadeDTO>()
                .ForMember(
                    dest => dest.FuncionalidadeId,
                    opt => opt.MapFrom(src => src.FuncionalidadeId)
                )
                .ForMember(
                    dest => dest.FuncionalidadeNome,
                    opt => opt.MapFrom(src => src.Funcionalidade.Nome)
                );

            // licencamodulo mappings
            _ = CreateMap<LicencaModuloAssociationRequest, LicencaModulo>();
            _ = CreateMap<LicencaModulo, LicencaModuloDTO>();
            _ = CreateMap<LicencaModulo, LicencaModuloNomeDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ModuloId))
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Modulo.Nome));

            // licencafuncionalidade mappings
            _ = CreateMap<LicencaFuncionalidade, LicencaFuncionalidadeDTO>();
            _ = CreateMap<LicencaFuncionalidade, LicencaFuncionalidadeNomeDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.FuncionalidadeId))
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Funcionalidade.Nome));

            // licencautilizador mappings
            _ = CreateMap<LicencaUtilizadorAssociationRequest, LicencaUtilizador>();
            _ = CreateMap<LicencaUtilizador, LicencaUtilizadorDTO>()
                .ForMember(dest => dest.Utilizador, opt => opt.MapFrom(src => src.Utilizador))
                .ForMember(dest => dest.Ativo, opt => opt.MapFrom(src => src.Ativo));
            _ = CreateMap<LicencaUtilizador, LicencaUtilizadorDTOFlat>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Utilizador.Id))
                .ForMember(
                    dest => dest.ImageUrl,
                    opt => opt.MapFrom(src => src.Utilizador.ImageUrl)
                )
                .ForMember(
                    dest => dest.FirstName,
                    opt => opt.MapFrom(src => src.Utilizador.FirstName)
                )
                .ForMember(
                    dest => dest.LastName,
                    opt => opt.MapFrom(src => src.Utilizador.LastName)
                )
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Utilizador.Email))
                .ForMember(
                    dest => dest.IsActive,
                    opt => opt.MapFrom(src => src.Utilizador.IsActive)
                )
                .ForMember(
                    dest => dest.PhoneNumber,
                    opt => opt.MapFrom(src => src.Utilizador.PhoneNumber)
                )
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Utilizador.RoleId))
                .ForMember(
                    dest => dest.ClienteId,
                    opt => opt.MapFrom(src => src.Utilizador.ClienteId)
                )
                // .ForMember(dest => dest.Cliente, opt => opt.MapFrom(src => src.Utilizador.Cliente))
                .ForMember(
                    dest => dest.CreatedOn,
                    opt => opt.MapFrom(src => src.Utilizador.CreatedOn)
                );

            // licencaapikey mappings
            _ = CreateMap<LicencaAPIKey, LicencaAPIKeyDTO>();

            // perfilutilizador
            _ = CreateMap<PerfilUtilizador, UserDto>()
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => Guid.Parse(src.UtilizadorId).ToConsistentString())
                )
                .ForMember(
                    dest => dest.FirstName,
                    opt => opt.MapFrom(src => src.Utilizador.FirstName)
                )
                .ForMember(
                    dest => dest.LastName,
                    opt => opt.MapFrom(src => src.Utilizador.LastName)
                )
                .ForMember(
                    dest => dest.IsActive,
                    opt => opt.MapFrom(src => src.Utilizador.IsActive)
                )
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Utilizador.Email))
                .ForMember(
                    dest => dest.PhoneNumber,
                    opt => opt.MapFrom(src => src.Utilizador.PhoneNumber)
                )
                .ForMember(
                    dest => dest.ImageUrl,
                    opt => opt.MapFrom(src => src.Utilizador.ImageUrl)
                )
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Utilizador.RoleId))
                .ForMember(
                    dest => dest.ClienteId,
                    opt => opt.MapFrom(src => src.Utilizador.ClienteId)
                )
                // .ForMember(dest => dest.Cliente, opt => opt.MapFrom(src => src.Utilizador.Cliente))
                .ForMember(
                    dest => dest.CreatedOn,
                    opt => opt.MapFrom(src => src.Utilizador.CreatedOn)
                );
            _ = CreateMap<PerfilUtilizador, PerfilUtilizadorDTO>();

            // add new entity mappings here...
        }
    }
}
