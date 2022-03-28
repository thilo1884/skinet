using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    //This address is owned by a order. This is going to live in the same row in our table as the order itself
    // It is not going to be related to an order anyway
    // it will also not have a id and will not derive from baseentity
    public class Address
    { 
        //Used to satisfy EntityFramework (les 209). Entityframework need a parameter list
        //Otherwise we are going to get some complaints when we try add a new migration
        // So we will just add another constructor and this time we will just use the parameter list as well

        //Entity Framework needs an empty constructor to be able to create the tables in the Database.
        // We use a constructor with parameters when we want to be able to easily create a new instance 
        // of the class and provide it parameters for the properties that we create at the same time.  
        public Address()
        {
        }

        public Address(string firstName, string lastName, string street, string city, string state, string zipCode)
        {
            FirstName = firstName;
            LastName = lastName;
            Street = street;
            City = city;
            State = state;
            ZipCode = zipCode;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}