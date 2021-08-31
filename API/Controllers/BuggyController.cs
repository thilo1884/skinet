using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest() //We dont borther to make it async
        {
            var thing = _context.Products.Find(42);

            if (thing == null)
            {
                return NotFound(new ApiResponse(404));
            }

            return Ok();
        }

        [HttpGet("servererror")]
        public ActionResult GetServerError() //We dont borther to make it async
        {
            var thing = _context.Products.Find(42); //will be null

            var thingToReturn = thing.ToString(); //cannot exectue a to string methodit because is null

            return Ok();
        }

        [HttpGet("badrequest")]
        public ActionResult GetBadRequest() //We dont borther to make it async
        {
            return BadRequest(new ApiResponse(400)); //400
        }

        [HttpGet("badrequest/{id}")] //We will generate the validation error simply passing a string instead of an integer
        public ActionResult GetNotFoundRequest(int id) //We dont borther to make it async
        {
            return Ok();
        }
    }
}