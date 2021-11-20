using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

//We create here some endpoint that our customer can heat.
// it will derive from BaseApiController such that the root is also re-used 
// the root will be api/basket + the endpoints

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        //we create a contructor to be able to injectour basket repository
        private readonly IBasketRepository _basketRepository;
        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
           var basket = await _basketRepository.GetBasketAsync(id);

           return Ok( basket ?? new CustomerBasket(id)); 
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updateBasket = await _basketRepository.UpdateBasketAsync(basket);

            return Ok(updateBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id) //we return nothing from here, so not Task<><>
        {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}