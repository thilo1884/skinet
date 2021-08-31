using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController] //attribute -- we want to override this attribute
    [Route("api/[controller]")] //api/ is optional but convetional
    public class BaseApiController : ControllerBase
    {
        
    }
}