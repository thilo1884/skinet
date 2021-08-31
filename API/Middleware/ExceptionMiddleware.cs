using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); //if there is not exception the request will move to the next stage
            }
            catch (System.Exception ex)
            {
                //this is our own catch handler response
                _logger.LogError(ex, ex.Message); //It will be output in the logging system. Our logging system is the console
                context.Response.ContentType = "application/json"; //we write our own response in the context.response to send it to the client
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; // We force it to be a 500 error

                //In case of developmnet we provide more details
                var response = _env.IsDevelopment() ? new ApiException((int)HttpStatusCode.InternalServerError,
                                                                        ex.Message,
                                                                        ex.StackTrace.ToString())
                                                    : new ApiException((int)HttpStatusCode.InternalServerError);

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);                                                         
            }
        }
    }
}