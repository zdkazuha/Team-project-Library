using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Configurations.DTOs.ReviewDto
{
    public class UpdateReviewDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string UserId { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
