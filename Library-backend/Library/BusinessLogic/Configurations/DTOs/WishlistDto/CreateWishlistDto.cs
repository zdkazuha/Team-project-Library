using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Configurations.DTOs.WishlistDto
{
    public class CreateWishlistDto
    {
        public string UserId { get; set; }
        public int BookId { get; set; }
    }
}
