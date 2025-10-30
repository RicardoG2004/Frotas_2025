using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Infrastructure.Encryption
{
  public interface IEncryptionService : ISingletonService
  {
    string EncryptString(string plainText);
    string DecryptString(string cipherText);
  }
}
