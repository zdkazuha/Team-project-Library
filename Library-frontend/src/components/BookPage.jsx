import { useEffect, useState } from "react";
import image from "../img/BookPage.png"
import { useParams } from "react-router-dom";
import AddReviewModal from "./AddReviewModal";

function BookPage() {

    const { id } = useParams();
    const [book, setBook] = useState()
    const [review, setReview] = useState([])
    const [author, setAuthor] = useState()
    const [genre, setGenre] = useState()
    const [showModal, setShowModal] = useState(false)
    
    useEffect(() => {
        fetchData(`https://localhost:7167/api/Book/${id}`, setBook);
    }, [id]);

    useEffect(() => {
        if (!book) return;
        fetchData(`https://localhost:7167/api/Genre/${book.genreId}`, setGenre);
        fetchData(`https://localhost:7167/api/Author/${book.authorId}`, setAuthor);
        fetchData(`https://localhost:7167/api/Review?bookTitle=${encodeURIComponent(book.title)}&pageNumber=1`, setReview);
    }, [book]);


    async function fetchData(url, setState) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setState(data);
            console.log(data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    const handleReviewAdded = () => {
        if (book) {
            fetchData(`https://localhost:7167/api/Review?bookTitle=${encodeURIComponent(book.title)}&pageNumber=1`, setReview);
        }
    };

    return (
    <div className="book-page baground" style={{ backgroundImage: `url(${image})` }}>
        {book ? (
        <>
            <div className="image-container">
            <img
                src={book.coverImage}
                alt={book.title}
                className="book-info-image"
            />
            </div>

            <div className="book-info" style={{height: 550, width: 700, marginRight: 50}}>
                <p>Title: {book.title}</p>
                <p>Published Date: {book.publishedDate.slice(0, 10)}</p>
                <p>Available Copies: {book.availableCopies}</p>
                <p>Author: {author?.name}</p>
                <p>Genre: {genre?.name}</p>
            </div>

            <div className="book-info"
              style={{
                height: 537,
                width: 400,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', 
              }}
>
              <div
                style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: 10,
                marginBottom: 10,
                }}
              >
                {review && review.length > 0 ? (
                  review.map((r, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: 9,
                        padding: 7,
                        borderRadius: 20,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontSize: 14,
                        lineHeight: 1.4,
                        textAlign: 'left',
                      }}
                >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <strong>{r.userName}</strong>
            <span style={{ color: '#00c6fb' }}>⭐ {r.rating}</span>
          </div>
          <p style={{ margin: '2px 0' }}>{r.comment}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            {r.createdAt?.slice(0, 10)} {r.createdAt?.slice(11, 19)}
          </p>
        </div>
      ))
    ) : (
      <p style={{ textAlign: 'center' }}>Review not found</p>
    )}
  </div>

  <button
    onClick={() => setShowModal(true)}
    style={{
      padding: '12px 24px',
      backgroundColor: '#00c6fb',
      color: 'white',
      border: 'none',
      borderRadius: 25,
      fontSize: 16,
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0, 198, 251, 0.4)',
      transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#0099cc';
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = '#00c6fb';
      e.target.style.transform = 'scale(1)';
    }}
  >
    Add Review
  </button>
</div>


            <AddReviewModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                bookTitle={book.title}
                onReviewAdded={handleReviewAdded}
            />
        </>
        ) : (
        <p>Loading...</p>
        )}
    </div>
    );
}

export default BookPage;
