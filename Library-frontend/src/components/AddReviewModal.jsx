import { useState } from "react";
import '../css/AddReviewModal.css';

function AddReviewModal({ show, onClose, bookTitle, onReviewAdded }) {
    const [rating, setRating] = useState(5.0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    if (!show) return null;

    const handleSubmit = async () => {
        setError("");

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

            const response = await fetch(process.env.REACT_APP_API + 'Review', {
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
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Add Your Review</h2>

                <div className="modal-field">
                    <label>Rating (1.0 - 5.0):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="modal-input"
                    />
                </div>

                <div className="modal-field">
                    <label>Your Review:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="modal-textarea"
                        placeholder="Write your review here..."
                    />
                </div>

                {error && <div className="modal-error">{error}</div>}

                <div className="modal-buttons">
                    <button className="modal-submit" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddReviewModal;
