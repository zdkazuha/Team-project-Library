import { useContext, useEffect, useState } from 'react';
import image from '../img/MyBooks.jpg';
import { UserContext } from '../contexts/User.context';
import { Col, Row } from 'antd';
import BookCard from './BookCard';
import '../css/MyWishlist.css';

function MyWishlist() {
    const [books, setBooks] = useState([]);
    const { id, email } = useContext(UserContext);

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        if (!email) return;

        try {
            const response = await fetch(process.env.REACT_APP_API + `Wishlist/mywishlist?userId=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            }
        } catch (error) {
            console.error("Error fetching your books:", error);
        }
    }

    return (
        <div className="baground-wishlist" style={{ backgroundImage: `url(${image})` }}>

            <h1 className="welcome-wishlist">Your Wishlist</h1>

            {books === null || books.length === 0 ? (
                <h1 className="no-books-wishlist">You do not have books in Wishlist</h1>
            ) : (
                <div className="cards-wishlist">
                    <Row>
                        {books.map(book => (
                            <Col key={book.id}>
                                <BookCard Book={{ id: book.bookId, title: '', coverImage: book.bookCoverImage }} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    );
}

export default MyWishlist;
