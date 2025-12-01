import { useContext, useEffect, useState } from 'react';
import image from '../img/MyBooks.jpg';
import { UserContext } from '../contexts/User.context';
import { Col, Row } from 'antd';
import BookCard from './BookCard';
import '../css/MyBooksPage.css';

function MyBooksPage() {
    const [books, setBooks] = useState([]);
    const { id, email } = useContext(UserContext);
    const API = import.meta.env.VITE_API;
    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        if (!email) return;

        try {
            const response = await fetch(API + `Borrow/mybooks?userId=${id}`, {
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
        <div className="baground-mybooks" style={{ backgroundImage: `url(${image})` }}>

            <h1 className="welcome-mybooks">Your books</h1>

            {books === null || books.length === 0 ? (
                <h1 className="no-books-mybooks">You do not have books</h1>
            ) : (
                <div className="cards-mybooks">
                    <Row>
                        {books.map(book => (
                            <Col key={book.id}>
                                <BookCard Book={{ id: book.bookId, title: book.title, coverImage: book.coverImage }} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    );
}

export default MyBooksPage;
