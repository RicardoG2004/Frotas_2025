using GSLP.Application.Common.Marker;

namespace GSLP.Infrastructure.Encryption
{
    public interface IEncryptionService : ISingletonService
    {
        string EncryptString(string plainText);
        string DecryptString(string cipherText);
    }
}
