using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Data.Entities
{
    public class Book : BaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CoverImage { get; set; }
        public DateTime PublishedDate { get; set; }
        public int AvailableCopies { get; set; }
        public int AuthorId { get; set; }
        public int GenreId { get; set; }

        // navigation properties
        public Author Author { get; set; }
        public Genre Genre { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
