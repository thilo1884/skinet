using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class CustomerBasket
    {
        public CustomerBasket() //empty contructor
        {
        }

        public CustomerBasket(string id)
        {
            Id = id;
        }

        public string Id { get; set; } //the customer will generate the id
        public List<BasketItem> Items { get; set; } = new List<BasketItem>(); //initialize with an empty list of items
    }
}