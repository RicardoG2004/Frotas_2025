using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;

namespace GACloud.API.Infrastructure.Encryption
{
  public class EncryptionService : IEncryptionService
  {
    private readonly string _encryptionKey;

    // Constructor to inject the settings using IOptions
    public EncryptionService(IOptions<EncryptionSettings> encryptionSettings)
    {
      _encryptionKey = encryptionSettings.Value.EncryptionKey;
    }

    // Method to get an encryption key of valid length (16, 24, or 32 bytes)
    private byte[] GetEncryptionKey()
    {
      // Convert the encryption key string to a byte array
      byte[] keyBytes = Encoding.UTF8.GetBytes(_encryptionKey);

      // Check if the key length is valid (16, 24, or 32 bytes)
      if (keyBytes.Length is not 16 and not 24 and not 32)
      {
        // Throw exception if the key length is invalid
        throw new CryptographicException(
          "Tamanho da chave de encriptação inválido. A chave deve ter 16, 24 ou 32 bytes de comprimento."
        );
      }

      // If the key length is valid, return the key
      return keyBytes;
    }

    // Encrypt a plain text string
    public string EncryptString(string plainText)
    {
      using Aes aesAlg = Aes.Create();

      // Use the GetEncryptionKey method to get a valid key
      aesAlg.Key = GetEncryptionKey();
      aesAlg.IV = new byte[16]; // Initialization Vector (16 bytes for AES)

      ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

      using MemoryStream msEncrypt = new();
      using (CryptoStream csEncrypt = new(msEncrypt, encryptor, CryptoStreamMode.Write))
      {
        using StreamWriter swEncrypt = new(csEncrypt);
        swEncrypt.Write(plainText);
      }
      return Convert.ToBase64String(msEncrypt.ToArray()); // Convert to Base64 to store easily
    }

    // Decrypt a cipher text string
    public string DecryptString(string cipherText)
    {
      using Aes aesAlg = Aes.Create();

      // Use the GetEncryptionKey method to get a valid key
      aesAlg.Key = GetEncryptionKey();
      aesAlg.IV = new byte[16]; // Same IV used for encryption (can be more complex in real scenarios)

      ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

      using MemoryStream msDecrypt = new(Convert.FromBase64String(cipherText));
      using CryptoStream csDecrypt = new(msDecrypt, decryptor, CryptoStreamMode.Read);
      using StreamReader srDecrypt = new(csDecrypt);
      return srDecrypt.ReadToEnd(); // Return the decrypted text
    }
  }
}
