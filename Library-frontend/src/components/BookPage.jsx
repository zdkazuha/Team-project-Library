import { useContext, useEffect, useState } from "react";
import image from "../img/BookPage.png"
import { useParams } from "react-router-dom";
import AddReviewModal from "./AddReviewModal";
import { UserContext } from "../contexts/User.context";
import { toast } from './ToastContainer';
import '../css/BookPage.css';

function BookPage() {
    const {id: userId, isAuth } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [isWishlist, setWishlist] = useState(false);
    const [isBorrow, setBorrow] = useState(false);
    const [review, setReview] = useState([]);
    const [author, setAuthor] = useState();
    const [genre, setGenre] = useState();
    const [book, setBook] = useState();
    const {id } = useParams();
    
    useEffect(() => {
        fetchData(process.env.REACT_APP_API + `Book/${id}`, setBook);
    }, [id]);

    useEffect(() => {
        if (!book) return;
        fetchData(process.env.REACT_APP_API + `Genre/${book.genreId}`, setGenre);
        fetchData(process.env.REACT_APP_API + `Author/${book.authorId}`, setAuthor);
        fetchData(process.env.REACT_APP_API + `Review?bookTitle=${encodeURIComponent(book.title)}&pageNumber=1`, setReview);
        isWishlistFunc();
        isBorrowFunc();
    }, [book]);

    async function fetchData(url, setState) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setState(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
      }
    }


    const handleReviewAdded = () => {
        if (book) {
            fetchData(process.env.REACT_APP_API + `Review?bookTitle=${encodeURIComponent(book.title)}&pageNumber=1`, setReview);
        }
    }

    const AddOrRemoveWishlist = () => {
      if(!book) return;

      if(!isAuth()) {
        toast.info('You need to be logged in to add books to your wishlist.')
        return;
      }

      if(!isWishlist) {
        AddToWishlist();
      } else {
        RemoveFromWishlist();
      }
    }

    async function AddToWishlist() {
      if (!book) return;

      try {
        const response = await fetch(process.env.REACT_APP_API + `Wishlist/CreateByUserName?bookId=${book.id}&userId=${userId}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (!response.ok) {
          toast.error("Failed to add to wishlist");
          return;
        }

        setWishlist(true);
        toast.success("Book added to wishlist");
      } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong");
      }
    }



async function RemoveFromWishlist() {
  if (!book) return;

  try {
    const response = await fetch(process.env.REACT_APP_API + `Wishlist/DeleteByUsername?bookId=${book.id}&userId=${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) {
      toast.error("Failed to remove from wishlist");
      return;
    }

    setWishlist(false);
    toast.success("Book removed from wishlist");
  } catch (err) {
    console.error("Error:", err);
    toast.error("Something went wrong");
  }
}


    function isWishlistFunc() {
        if(isAuth()) {
          fetch(process.env.REACT_APP_API + `Wishlist/isWishlist/${id}?userId=${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
          .then(response => response.json())
          .then(data => setWishlist(data));
        }
    }

    function BorrowOrReturnBook () {
        if(!book) return;

        if(!isAuth()) {
          toast.info('You need to be logged in to borrow books.');
          return;
        }

        if(!isBorrow) {
          BorrowBook();
        } else {
          ReturnBook();
        }
    }

    function BorrowBook() {
      fetch(process.env.REACT_APP_API + `Borrow/borrow`, {
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
    }

    function ReturnBook() {
      fetch(process.env.REACT_APP_API + `Borrow/return?bookId=${id}&userId=${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(response => { 
        if (response.ok) 
          return true; 
        throw new Error("Return failed"); 
      })
      .then(() => setBorrow(false))
      .catch(err => console.error(err));
    }

    function isBorrowFunc() {
      fetch(process.env.REACT_APP_API + `Borrow/isBorrow/?bookId=${id}&userId=${userId}`, {
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
                        { !isWishlist? 'Add (wishlist)' : 'Remove (wishlist)' }
                    </button>

                    <button className="borrow-button" onClick={BorrowOrReturnBook}>
                        { !isBorrow? 'Borrow' : 'Return' }
                    </button>
                </div>

                <div className="book-info">
                    <p>Title: {book.title}</p>
                    <p>Published Date: {book.publishedDate?.slice(0, 10)}</p>
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
                                <p className="review-date">{r.createdAt?.slice(0, 10)}</p>
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
