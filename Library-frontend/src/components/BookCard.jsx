import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import '../css/BookCard.css';
import NoImage from '../img/NoImage.png';

function BookCard({ Book }) {
    const { id, title, coverImage } = Book;

    return (
        <Card
            hoverable
            className="card"
            cover={
                <Link to={`book/${id}`}>
                    <img
                        className="book-image"
                        draggable={false}
                        alt={title}
                        src={coverImage == null ? NoImage : coverImage}
                    />
                </Link>
            }
        />
    );
}

export default BookCard;
