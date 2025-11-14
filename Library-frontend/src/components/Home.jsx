import React, { cloneElement, useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Button, Col, Row } from 'antd';
import image from '../img/Home.png';


function Home() {

    const[books, setBooks] = useState([]);
    const[page, setPage] = useState(1);

    useEffect(() => {
        fetchBooks();
    }, [page]);

    async function fetchBooks() {
        const api = `http://localhost:5162/api/Book?pageNumber=${page}`;

        try {
            const response = await fetch(api);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            
            setBooks(data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
            setBooks([]); 
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
    <div className="home-container baground" style={{backgroundImage: `url(${image})`}}>
        <h1 className='welcome' >Welcome to the Library</h1>

        <div className='home-buttons'>
            <button className='button' onClick={PreviousPage} style={{marginRight: 16}}>Previous Page</button>
            <button className='button' onClick={NextPage}>Next Page</button>
        </div>

        { 
            books === null || books.length === 0 
            ? <h1 style={{textAlign: 'center', color: 'white', fontSize: "64px", paddingTop: '100px', margin: '0', marginBottom: '0'}}>
                Books not found</h1>
            : 
            <div className="cards">
                <Row gutter={[0, 0]}>
                    {books.map(book => (
                        <Col key={book.id} span={4.5}>
                            <BookCard Book={book} />
                        </Col>
                    ))}
                </Row>
            </div> 
        } 
        </div>
  );
};

export default Home;
