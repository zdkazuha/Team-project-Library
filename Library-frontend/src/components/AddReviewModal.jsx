import { useState } from "react";

function AddReviewModal({ show, onClose, bookTitle, onReviewAdded }) {
    const [rating, setRating] = useState(5.0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    if (!show) return null;

    const handleSubmit = async () => {
        setError("");
        
        // Перевірка на пусті поля
        if (!comment.trim()) {
            setError("Please write a review comment");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError("You must be logged in to add a review");
                return;
            }

            const response = await fetch('https://localhost:7167/api/Review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookTitle: bookTitle,
                    rating: parseFloat(rating),
                    comment: comment
                })
            });
            
            if (response.ok) {
                setRating(5.0);
                setComment("");
                setError("");
                onReviewAdded();
                onClose();
            } else {
                const errorData = await response.json();
                if (response.status === 401) {
                    setError("You must be logged in to add a review");
                } else {
                    setError(errorData.message || "Failed to submit review. Please try again.");
                }
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Network error. Please check your connection and try again.");
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'rgba(20, 20, 40, 0.95)',
                    padding: 30,
                    borderRadius: 20,
                    width: 500,
                    border: '1px solid rgba(0, 198, 251, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 198, 251, 0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{color: 'white', marginBottom: 20, textAlign: 'center'}}>
                    Add Your Review
                </h2>
                
                <div style={{marginBottom: 20}}>
                    <label style={{color: 'white', display: 'block', marginBottom: 8}}>
                        Rating (1.0 - 5.0):
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            border: '1px solid rgba(0, 198, 251, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: 16
                        }}
                    />
                </div>

                <div style={{marginBottom: 20}}>
                    <label style={{color: 'white', display: 'block', marginBottom: 8}}>
                        Your Review:
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: 120,
                            padding: 10,
                            borderRadius: 10,
                            border: '1px solid rgba(0, 198, 251, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: 14,
                            resize: 'vertical'
                        }}
                        placeholder="Write your review here..."
                    />
                </div>

                {error && (
                    <div style={{
                        marginBottom: 15,
                        padding: 10,
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 0, 0, 0.5)',
                        borderRadius: 10,
                        color: '#ff6b6b',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#00c6fb',
                            color: 'white',
                            border: 'none',
                            borderRadius: 20,
                            fontSize: 16,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0099cc';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#00c6fb';
                        }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: 20,
                            fontSize: 16,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddReviewModal;