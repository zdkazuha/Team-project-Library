import { useContext, useEffect, useState } from 'react';
import image from '../img/MyBooks.jpg';
import { UserContext } from '../contexts/User.context';
import { Col, Row } from 'antd';
import BookCard from './BookCard';
import Title from 'antd/es/skeleton/Title';

function MyBooksPage() {
    const [books, setBooks] = useState([]);

    const { email } = useContext(UserContext);
    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        if (!email) return;

        try {
        const response = await fetch(`https://localhost:7167/api/Borrow/mybooks?userName=${email}`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setBooks(data);
            console.log(data);
        }
        } catch (error) {
        console.error("Error fetching youre books:", error);
        }
    }

    return (
        <div className="baground" style={{ backgroundImage: `url(${image})` }}>
            <h1 className="welcome">Your books</h1>

        { 
            books === null || books.length === 0 
            ? <h1 style={{textAlign: 'center', color: 'white', fontSize: "64px", paddingTop: '100px', margin: '0', marginBottom: '0'}}>
                You not have books</h1>
            : 
            <div className="cards">
                <Row gutter={[0, 0]}>
                    {books.map(book => (
                        <Col key={book.id} span={4.5}>
                            <BookCard Book={{id: book.bookId, title: book.title, coverImage: book.coverImage}} />
                        </Col>
                    ))}
                </Row>
            </div> 
        } 
        </div>
    );
}

export default MyBooksPage;