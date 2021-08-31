using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("errors/{code}")] //it will overwrite the route
    [ApiExplorerSettings(IgnoreApi = true)] //added this for use with swagger
    public class ErrorController : BaseApiController
    {
        public IActionResult Error(int code) //Swagger is concerned if its a GET or POST..
        {
            return new ObjectResult(new ApiResponse(code));
        }
    }
}