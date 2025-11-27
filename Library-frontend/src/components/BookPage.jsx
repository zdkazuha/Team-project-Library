import { useContext, useEffect, useState } from "react";
import image from "../img/BookPage.png"
import { useParams } from "react-router-dom";
import AddReviewModal from "./AddReviewModal";
import { UserContext } from "../contexts/User.context";
import '../css/BookPage.css';

function BookPage() {
    const {id: userId, isAuth } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [isWishlist, setWishlist] = useState(false);
    const [isBorrow, setBorrow] = useState();
    const [review, setReview] = useState([]);
    const [author, setAuthor] = useState();
    const [genre, setGenre] = useState();
    const [book, setBook] = useState();
    const {id } = useParams();
    
    useEffect(() => {
        fetchData(`https://localhost:7167/api/Book/${id}`, setBook);
    }, [id]);

    useEffect(() => {
        if (!book) return;
        fetchData(`https://localhost:7167/api/Genre/${book.genreId}`, setGenre);
        fetchData(`https://localhost:7167/api/Author/${book.authorId}`, setAuthor);
        fetchData(`https://localhost:7167/api/Review?bookTitle=${encodeURIComponent(book.title)}&pageNumber=1`, setReview);
        isWishlistFunc();
        isBorrowFunc();
    }, [book]);

    async function fetchData(url, setState) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setState(data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    const handleReviewAdded = () => {
        if (book) {
            fetchData(`https://localhost:7167/api/Review?bookTitle=${encodeURIComponent(book.title)}&pageNumber=1`, setReview);
        }
    }

    const AddOrRemoveWishlist = () => {
      if(!book) return;

      if(!isAuth()) {
        alert('You need to be logged in to add books to your wishlist.');
        return;
      }

      if(!isWishlist) {
        AddToWishlist();
      } else {
        RemoveFromWishlist();
      }
    }

    async function AddToWishlist() {
      try {
          const response = await fetch(`https://localhost:7167/api/Wishlist/CreateByUserName?bookId=${book.id}&userId=${userId}`, {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          })

          if (!response.ok) {
              const error = await response.text();
              console.error("Failed to add to wishlist:", error);
              return;
          }

          const data = await response.json();
          setWishlist(true);
          console.log("Added to wishlist:", data);
      } catch (err) {
          console.error("Error:", err);
      }
  }


    function RemoveFromWishlist() {
        fetch(`https://localhost:7167/api/Wishlist/DeleteByUsername?bookId=${book.id}&userId=${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            if (!response.ok) { throw new Error("Failed to remove from wishlist"); }
            return response.text();
        })
        .then(data => {
            console.log("Removed from wishlist:", data);
        })
        .catch(err => console.error("Error:", err));
        setWishlist(false);
    }

    function isWishlistFunc() {
        if(isAuth()) {
          fetch(`https://localhost:7167/api/Wishlist/isWishlist/${id}?userId=${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
          .then(response => response.json())
          .then(data => setWishlist(data));
        }
    }

    function BorrowOrReturnBook () {
        if(!book) return;

        if(!isAuth()) {
          alert('You need to be logged in to borrow books.');
          return;
        }

        if(!isBorrow) {
          BorrowBook();
        } else {
          ReturnBook();
        }
    }

    function BorrowBook() {
      fetch(`https://localhost:7167/api/Borrow/borrow`, {
          method: "POST",
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            BookId: id,
            UserId: userId,
            BorrowedAt: new Date().toISOString(),
            DueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
            ReturnedAt: null
        })
      })
      .then(response => response.json())
      .then(data => setBorrow(data));
      console.log(data);
    }

    function ReturnBook() {
      fetch(`https://localhost:7167/api/Borrow/return?bookId=${id}&userId=${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(response => { if (response.ok) return true; throw new Error("Return failed"); })
      .then(() => setBorrow(false))
      .catch(err => console.error(err));
    }

    function isBorrowFunc() {
      fetch(`https://localhost:7167/api/Borrow/isBorrow/${id}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(response => response.json())
      .then(data => setBorrow(data));
    }

    return (
        <div className="book-page baground" style={{ backgroundImage: `url(${image})` }}>
            {book ? (
            <>
                <div className="image-container">
                    <img src={book.coverImage} alt={book.title} className="book-info-image" />

                    <button className="wishlist-button" onClick={AddOrRemoveWishlist}>
                        { isWishlist === false ? 'Add (wishlist)' : 'Remove (wishlist)' }
                    </button>

                    <button className="borrow-button" onClick={BorrowOrReturnBook}>
                        { isBorrow === false ? 'Borrow' : 'Return' }
                    </button>
                </div>

                <div className="book-info">
                    <p>Title: {book.title}</p>
                    <p>Published Date: {book.publishedDate.slice(0, 10)}</p>
                    <p>Available Copies: {book.availableCopies}</p>
                    <p>Author: {author?.name}</p>
                    <p>Genre: {genre?.name}</p>
                </div>

                <div> 
                  <div className="book-info book-reviews">
                    <div className="reviews-container">
                        {review && review.length > 0 ? (
                          review.map((r, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <strong>{r.userName}</strong>
                                    <span>⭐ {r.rating}</span>
                                </div>
                                <p>{r.comment}</p>
                                <p className="review-date">{r.createdAt?.slice(0, 10)} {r.createdAt?.slice(11, 19)}</p>
                            </div>
                          ))
                        ) : (
                          <p className="no-review">Review not found</p>
                        )}
                    </div>    
                  </div>

                  <button className="add-review-button" onClick={() => setShowModal(true)}>
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
