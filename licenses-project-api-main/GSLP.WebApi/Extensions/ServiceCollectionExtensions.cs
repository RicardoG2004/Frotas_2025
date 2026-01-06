using System.Text;
using FluentValidation.AspNetCore;
using GSLP.Application.Common.Authorization.CheckPermissionAttribute;
using GSLP.Application.Common.Logging;
using GSLP.Application.Common.Wrapper;
using GSLP.Application.Utility;
using GSLP.Domain.Entities.Common;
using GSLP.Infrastructure.Auth.JWT;
using GSLP.Infrastructure.Encryption;
using GSLP.Infrastructure.Images;
using GSLP.Infrastructure.Mailer;
using GSLP.Infrastructure.Mapper;
using GSLP.Infrastructure.Persistence.Contexts;
using GSLP.Infrastructure.Persistence.Extensions;
using GSLP.Reports.Services;
using GSLP.WebApi.Interceptors;
using GSLP.WebApi.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GSLP.WebApi.Extensions
{
    public static class ServiceCollectionExtensions // configure application services
    {
        public static void ConfigureApplicationServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            #region [-- CORS --]
            _ = services.AddCors(p =>
                p.AddPolicy(
                    "defaultPolicy",
                    builder =>
                    {
                        _ = builder
                            .WithOrigins("*")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .WithExposedHeaders("Content-Disposition")
                            .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
                    }
                )
            );
            #endregion

            #region [-- ADD CONTROLLERS AND SERVICES --]

            _ = services
                .AddControllers(opt =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    opt.Filters.Add(new AuthorizeFilter(policy)); // makes so that all the controllers require authorization by default
                })
                .AddFluentValidation(fv =>
                {
                    fv.ImplicitlyValidateChildProperties = true;
                    fv.ImplicitlyValidateRootCollectionElements = true;

                    fv.RegisterValidatorsFromAssemblyContaining<IRequestValidator>(); // auto registers all fluent validation classes, in all assemblies with an IRequestValidator class
                    fv.RegisterValidatorsFromAssemblyContaining<Infrastructure.Utility.IRequestValidator>();
                });

            _ = services.AddEndpointsApiExplorer();
            _ = services.AddAutoMapper(typeof(MappingProfiles));
            _ = services.Configure<MailSettings>(configuration.GetSection("MailSettings"));
            _ = services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));
            
            // Add memory cache for rate limiting
            _ = services.AddMemoryCache();
            
            // Configure rate limiting options
            _ = services.Configure<RateLimitingOptions>(
                configuration.GetSection(RateLimitingOptions.SectionName)
            );

            _ = services.AddServices(); // dynamic services registration

            //----------- Add Services (Dependency Injection) -------------------------------------------

            _ = services.AddSingleton<IValidatorInterceptor, UseCustomErrorModelInterceptor>();
            _ = services.AddSingleton<AppLogger>();
            // _ = services.AddTransient<IReportsService, ReportsService>();
            // Optionally, if you want a custom policy to match based on FuncionalidadeId
            // _ = services.AddSingleton<IAuthorizationPolicyProvider, CustomAuthorizationPolicyProvider>();
            // _ = services.AddScoped<IAuthorizationHandler, PermissionRequirementHandler>();

            // From DynamicServiceRegistrationExtensions
            // Auto registers scoped/transient marked services

            // ICurrentTenantUserService -- registered as Scoped (resolve the tenant/user from token/header)
            // IIdentityService, ITokenService, IRepositoryAsync, ITenantManagementService -- registered as Transient

            // Any additional app services should be registered as Transient

            //---------------------------------------------------------------------------

            #endregion

            #region [-- REGISTERING DB CONTEXT SERVICE --]
            _ = services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
            );
            _ = services.AddAndMigrateDatabase<ApplicationDbContext>(configuration);
            #endregion

            #region [-- SETTING UP IDENTITY CONFIGURATIONS --]

            _ = services
                .AddIdentity<ApplicationUser, IdentityRole>(o =>
                {
                    o.SignIn.RequireConfirmedAccount = false; // password requirements - set as needed
                    o.Password.RequiredLength = 6;
                    o.Password.RequireDigit = false;
                    o.Password.RequireLowercase = false;
                    o.Password.RequireUppercase = false;
                    o.Password.RequireNonAlphanumeric = false;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            #endregion

            #region [-- JWT SETTINGS --]

            _ = services.Configure<JWTSettings>(configuration.GetSection("JWTSettings")); // get settings from appsettings.json
            _ = services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(o =>
                {
                    o.RequireHttpsMetadata = false;
                    o.SaveToken = false;
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidIssuer = configuration["JWTSettings:Issuer"],
                        ValidAudience = configuration["JWTSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(configuration["JWTSettings:Key"])
                        ),
                    };
                    o.Events = new JwtBearerEvents()
                    {
                        OnChallenge = context =>
                        {
                            context.HandleResponse();

                            // Create a custom response for unauthorized access (401)
                            Response response = Response.Fail("Não autorizado");

                            context.Response.ContentType = "application/json";
                            context.Response.StatusCode = 401;

                            return context.Response.WriteAsJsonAsync(response);
                        },
                        OnForbidden = context =>
                        {
                            context.Response.StatusCode = 403;
                            context.Response.ContentType = "application/json";

                            // Create a custom response for forbidden access (403)
                            Response response = Response.Fail("Acesso proibido");

                            return context.Response.WriteAsJsonAsync(response);
                        },
                    };
                });

            #endregion

            #region [-- ENCRYPTION --]

            _ = services.Configure<EncryptionSettings>(
                configuration.GetSection("EncryptionSettings")
            );

            #endregion
        }
    }
}
