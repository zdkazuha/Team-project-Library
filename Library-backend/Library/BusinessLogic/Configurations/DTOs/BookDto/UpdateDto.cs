using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Configurations.DTOs.BookDto
{
    public class UpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CoverImage { get; set; }
        public DateTime PublishedDate { get; set; }
        public int AvailableCopies { get; set; }
        public int AuthorId { get; set; }
        public int GenreId { get; set; }
    }
}
