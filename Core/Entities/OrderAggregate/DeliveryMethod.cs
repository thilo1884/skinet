using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    //Allow the client application to retrieve the delivery methods that we are supporting
    public class DeliveryMethod : BaseEntity// Derive from baseentity because we do want this to have IDs. This will be a table
    {
       public string ShortName { get; set; } 
       public string DeliveryTime { get; set; } //withing 1 or 3 days
       public string Description { get; set; }
       public decimal Price { get; set; }
    }
    //No need of a contructor here, because the client just need to select the delivery method
    // So we use the deliveryMethod id
}