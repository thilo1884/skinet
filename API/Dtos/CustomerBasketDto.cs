using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace API.Dtos
{
    public class CustomerBasketDto
    {    //We have added this to do validation on the CustomerBasket
        // We dont want to use Data valiation annotation (e.g. Required)
        [Required]
        //les 184
        public string Id { get; set; } //the customer will generate the id
        public List<BasketItem> Items { get; set; } = new List<BasketItem>(); //initialize with an empty list of items
    }
}