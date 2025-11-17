import { useContext, useEffect, useState } from 'react';
import image from '../img/MyBooks.jpg';
import { UserContext } from '../contexts/User.context';
import { Col, Row } from 'antd';
import BookCard from './BookCard';
import Title from 'antd/es/skeleton/Title';

function MyBooksPage() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const { email } = useContext(UserContext);
    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        if (!email) return;

        try {
        const response = await fetch(`http://localhost:5162/api/Borrow/mybooks?userName=${email}`, {
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

    function NextPage() {
        setPage(prev => prev + 1);
    }

    function PreviousPage() {
        if(page === 1)
            return;

        setPage(prev => prev - 1);
    }

    return (
        <div className="baground" style={{ backgroundImage: `url(${image})` }}>
            <h1 className="welcome">Your books</h1>

        <div className='home-buttons'>
            <button className='button' onClick={PreviousPage} style={{marginRight: 16}}>Previous Page</button>
            <button className='button' onClick={NextPage}>Next Page</button>
        </div>

        { 
            books === null || books.length === 0 
            ? <h1 style={{textAlign: 'center', color: 'white', fontSize: "64px", paddingTop: '100px', margin: '0', marginBottom: '0'}}>
                You have zero books</h1>
            : 
            <div className="cards">
                <Row gutter={[0, 0]}>
                    {books.map(book => (
                        <Col key={book.id} span={4.5}>
                            <BookCard Book={{id: book.bookId, title: book.title, coverImage: book.coverImage}} />
                            {/* <BookCard Book={book} /> */}
                        </Col>
                    ))}
                </Row>
            </div> 
        } 
        </div>
    );
}

export default MyBooksPage;