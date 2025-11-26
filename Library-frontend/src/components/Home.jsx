import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Button, Col, Row } from 'antd';
import image from '../img/Home.png';


function Home() {

    const[books, setBooks] = useState([]);
    const[page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [page, searchQuery]);

    async function fetchBooks() {
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
        const api = `https://localhost:7167/api/Book?pageNumber=${page}${searchParam}`;

        try {
            const response = await fetch(api);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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


    function handleSearchSubmit(event) {
        event.preventDefault();
        setPage(1);
        setSearchQuery(searchInput.trim());
    }

    function resetSearch() {
        setSearchInput('');
        setSearchQuery('');
        setPage(1);
    }

  return (
    <div className="home-container baground" style={{backgroundImage: `url(${image})`}}>
        <h1 className='welcome' >Welcome to the Library</h1>

          <form className='search-form' onSubmit={handleSearchSubmit}>
              <input
                  className='search-input'
                  type='text'
                  placeholder='Search by title, author or genre'
                  value={searchInput}
                  aria-label='Search for a book'
                  onChange={(event) => setSearchInput(event.target.value)}
              />
              <div className='search-actions'>
                  <button className='button' type='submit'>Search</button>
                  <button
                      className='button secondary'
                      type='button'
                      onClick={resetSearch}
                      disabled={!searchQuery && !searchInput}
                  >
                      Clear
                  </button>
              </div>
          </form>

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