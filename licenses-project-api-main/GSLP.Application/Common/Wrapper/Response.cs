namespace GSLP.Application.Common.Wrapper
{
    public class Response // Response wrapper class
    {
        public bool Succeeded { get; set; }
        public Dictionary<string, List<string>> Messages { get; set; } = new(); // Updated to dictionary

        public static Response Success()
        {
            return new Response { Succeeded = true };
        }

        public static Response Fail() // Fail with no messages
        {
            return new Response { Succeeded = false };
        }

        public static Response Fail(string message, string field = "$") // Fail with a single message for a specific field
        {
            var response = new Response { Succeeded = false };
            response.Messages[field] = new List<string> { message }; // Add message for specific field
            return response;
        }

        public static Response Fail(List<string> messages, string field = "$") // Fail with multiple messages for a specific field
        {
            var response = new Response { Succeeded = false };
            response.Messages[field] = messages; // Add multiple messages for specific field
            return response;
        }

        public static Response Fail(Dictionary<string, List<string>> fieldsWithMessages)
        {
            var response = new Response { Succeeded = false };

            // Add each field with its list of messages to the response
            foreach (var field in fieldsWithMessages)
            {
                response.Messages[field.Key] = field.Value;
            }

            return response;
        }
    }

    public class Response<T> : Response
    {
        public T Data { get; set; }

        public static new Response<T> Success()
        {
            return new Response<T> { Succeeded = true };
        }

        public static Response<T> Success(T data)
        {
            return new Response<T> { Succeeded = true, Data = data };
        }

        public static new Response<T> Fail()
        {
            return new Response<T> { Succeeded = false };
        }

        public static new Response<T> Fail(string message, string field = "$")
        {
            var response = new Response<T> { Succeeded = false };
            response.Messages[field] = new List<string> { message }; // Add message to the specified field
            return response;
        }

        public static new Response<T> Fail(List<string> messages, string field = "$")
        {
            var response = new Response<T> { Succeeded = false };
            response.Messages[field] = messages; // Add multiple messages for specific field
            return response;
        }

        public static new Response<T> Fail(Dictionary<string, List<string>> fieldsWithMessages)
        {
            var response = new Response<T> { Succeeded = false };

            // Add each field with its list of messages to the response
            foreach (var field in fieldsWithMessages)
            {
                response.Messages[field.Key] = field.Value;
            }

            return response;
        }
    }
}
