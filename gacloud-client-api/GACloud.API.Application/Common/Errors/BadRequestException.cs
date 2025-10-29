namespace GACloud.API.Application.Common.Errors
{
  public class BadRequestException : Exception
  {
    public Dictionary<string, List<string>> Errors { get; }

    public BadRequestException(string message, Dictionary<string, List<string>> errors)
      : base(message)
    {
      Errors = errors;
    }
  }
}
