using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

//we inject the Usermanager        
        public AccountController(UserManager<AppUser> userManager, 
                                 SignInManager<AppUser> signInManager,
                                 ITokenService tokenService,
                                 IMapper mapper)
        {
            _tokenService = tokenService;
            _signInManager = signInManager; //this will be used to check password againt to what is stored in the DB
            _userManager = userManager;
            _mapper = mapper;
            
        }

        //Method that do not have a route/ They are hitted by the account
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            //Our client is going to send a token "hey give the current user based on the sent token"
            // Because we don`t have a persistent api connection
            //Http context
            var email = User.FindFirstValue(ClaimTypes.Email); //HttpContext.User

            var user = await _userManager.FindByEmailAsync(email);

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),//"This will be a token",
                DisplayName = user.DisplayName
            };

        }

        [HttpGet("emailexists")] //Will be useful for the client part
        public async Task<ActionResult<bool>> CheckEmailExistAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            //var user = await _userManager.FindByEmailAsync(email);
            var user = await _userManager.FindByUserClaimsPrincipalEmailWithAddressAsync(User);

            //return user.Address;
            return _mapper.Map<Address, AddressDto>(user.Address);
        }

        [Authorize]
        [HttpPut("address")] //We use PUT when updating a resource, for creating a new address for the user
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindByUserClaimsPrincipalEmailWithAddressAsync(User);
            user.Address = _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);

            if(result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));

            return BadRequest("Problem updating the user");
        }


        [HttpPost("login")] // our login method
        //We will return a lots of fields and they are quite a lot, because of that we use Dto 
        //(do we dont return ActionResult<AppUser>// object), also we want to send back different information
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) //--> mail and password
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401));
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if(!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),//"This will a token",
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register (RegisterDto registerDto)
        {
            if (CheckEmailExistAsync(registerDto.Email).Result.Value) //because is async method we get the result value
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{Errors = new [] {"Email address is in use"}});
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded) return BadRequest(new ApiResponse(400));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),//"This will a token",
                DisplayName = user.DisplayName
            };
        }

    }
}