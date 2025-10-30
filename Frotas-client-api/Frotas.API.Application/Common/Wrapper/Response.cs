namespace Frotas.API.Application.Common.Wrapper
{
  public enum ResponseStatus
  {
    Success,
    PartialSuccess,
    Failure,
  }

  public class Response // Response wrapper class
  {
    public ResponseStatus Status { get; set; }
    public Dictionary<string, List<string>> Messages { get; set; } = []; // Updated to dictionary

    public static Response Success()
    {
      return new Response { Status = ResponseStatus.Success };
    }

    public static Response PartialSuccess(string message, string field = "$")
    {
      Response response = new() { Status = ResponseStatus.PartialSuccess };
      response.Messages[field] = [message];
      return response;
    }

    public static Response PartialSuccess(List<string> messages, string field = "$")
    {
      Response response = new() { Status = ResponseStatus.PartialSuccess };
      response.Messages[field] = messages;
      return response;
    }

    public static Response PartialSuccess(Dictionary<string, List<string>> fieldsWithMessages)
    {
      Response response = new() { Status = ResponseStatus.PartialSuccess };

      // Add each field with its list of messages to the response
      foreach (KeyValuePair<string, List<string>> field in fieldsWithMessages)
      {
        response.Messages[field.Key] = field.Value;
      }

      return response;
    }

    public static Response Fail() // Fail with no messages
    {
      return new Response { Status = ResponseStatus.Failure };
    }

    public static Response Fail(string message, string field = "$") // Fail with a single message for a specific field
    {
      Response response = new() { Status = ResponseStatus.Failure };
      response.Messages[field] = [message]; // Add message for specific field
      return response;
    }

    public static Response Fail(List<string> messages, string field = "$") // Fail with multiple messages for a specific field
    {
      Response response = new() { Status = ResponseStatus.Failure };
      response.Messages[field] = messages; // Add multiple messages for specific field
      return response;
    }

    public static Response Fail(Dictionary<string, List<string>> fieldsWithMessages)
    {
      Response response = new() { Status = ResponseStatus.Failure };

      // Add each field with its list of messages to the response
      foreach (KeyValuePair<string, List<string>> field in fieldsWithMessages)
      {
        response.Messages[field.Key] = field.Value;
      }

      return response;
    }
  }

  public class Response<T> : Response
  {
    public T? Data { get; set; }

    public static new Response<T> Success()
    {
      return new Response<T> { Status = ResponseStatus.Success };
    }

    public static Response<T> Success(T data)
    {
      return new Response<T> { Status = ResponseStatus.Success, Data = data };
    }

    public static Response<T> PartialSuccess(T data, string message, string field = "$")
    {
      Response<T> response = new() { Status = ResponseStatus.PartialSuccess, Data = data };
      response.Messages[field] = [message];
      return response;
    }

    public static Response<T> PartialSuccess(T data, List<string> messages, string field = "$")
    {
      Response<T> response = new() { Status = ResponseStatus.PartialSuccess, Data = data };
      response.Messages[field] = messages;
      return response;
    }

    public static Response<T> PartialSuccess(
      T data,
      Dictionary<string, List<string>> fieldsWithMessages
    )
    {
      Response<T> response = new() { Status = ResponseStatus.PartialSuccess, Data = data };

      // Add each field with its list of messages to the response
      foreach (KeyValuePair<string, List<string>> field in fieldsWithMessages)
      {
        response.Messages[field.Key] = field.Value;
      }

      return response;
    }

    public static new Response<T> Fail()
    {
      return new Response<T> { Status = ResponseStatus.Failure };
    }

    public static new Response<T> Fail(string message, string field = "$")
    {
      Response<T> response = new() { Status = ResponseStatus.Failure };
      response.Messages[field] = [message]; // Add message to the specified field
      return response;
    }

    public static new Response<T> Fail(List<string> messages, string field = "$")
    {
      Response<T> response = new() { Status = ResponseStatus.Failure };
      response.Messages[field] = messages; // Add multiple messages for specific field
      return response;
    }

    public static new Response<T> Fail(Dictionary<string, List<string>> fieldsWithMessages)
    {
      Response<T> response = new() { Status = ResponseStatus.Failure };

      // Add each field with its list of messages to the response
      foreach (KeyValuePair<string, List<string>> field in fieldsWithMessages)
      {
        response.Messages[field.Key] = field.Value;
      }

      return response;
    }
  }
}
