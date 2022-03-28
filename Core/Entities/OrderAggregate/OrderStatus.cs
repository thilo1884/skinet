using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    //We want to receive the text of that, so we can add a property EnumMember to do that.
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending, //when the order is submitted 0
        
        [EnumMember(Value = "Payment Received")]
        PaymentReceived, //1
        
        [EnumMember(Value = "Payment Failed")]
        PaymentFailed, //2
        //Shipped, could also be a status, but for now we dont use it

    }
}