using System.ComponentModel.DataAnnotations;

namespace Core.Entities.Identity
{
    public class Address //this will be a table that will be saved in the DB, the key is AppUserId
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        [Required]
        public string AppUserId { get; set; } //we don`t want to have this to null, to do that we add an attribute [Required]
        public AppUser AppUser { get; set; } //Entity framework will automatically create a 1 to 1 relationship 

    }
}