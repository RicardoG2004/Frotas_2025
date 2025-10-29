using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Infrastructure.Encryption
{
  public interface IEncryptionService : ISingletonService
  {
    string EncryptString(string plainText);
    string DecryptString(string cipherText);
  }
}
