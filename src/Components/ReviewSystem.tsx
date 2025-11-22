import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { AiOutlineArrowDown, AiFillEdit, AiFillDelete, AiOutlineLoading, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from './config';
import './ReviewSystem.css';

interface TestimonialsProps {
  onLoginClick: () => void;
}

interface Review {
  id: number;
  firstName: string;
  lastName: string;
  rating: number;
  comment: string;
  date: string;
  user_id: number;
  likes: number;
  hasLiked: boolean;
}

const ReviewSystem: React.FC<TestimonialsProps> = ({ onLoginClick }) => {
  const { user, isAuthenticated, refreshToken } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const renderStars = (rating: number, isEditable: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="star-container">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <FontAwesomeIcon
            key={starValue}
            icon={faStar}
            className={`star ${starValue <= rating ? 'filled' : 'empty'}`}
            onClick={() => isEditable && onRate?.(starValue)}
            style={{ 
              cursor: isEditable ? 'pointer' : 'default',
              color: starValue <= rating ? '#f59e0b' : '#e2e8f0'
            }}
          />
        ))}
      </div>
    );
  };

// Update fetchReviews to include authentication header
const fetchReviews = async (signal?: AbortSignal) => {
  setIsLoading(true);
  setError('');
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      signal,
      credentials: 'include', // optional but safe
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (!response.ok) throw new Error(`Failed to load reviews (${response.status})`);

    const data = await response.json();
    
    if (!data?.reviews) throw new Error('Invalid response format');

    const reviews = data.reviews
      .filter((r: any) => !!r)
      .map((r: any) => ({
        id: Number(r.id || 0),
        user_id: Number(r.user_id || 0),
        firstName: r.firstName?.trim() || 'Anonymous',
        lastName: r.lastName?.trim() || '',
        rating: Number(r.rating || 0),
        comment: r.comment?.trim() || '',
        date: r.date || new Date().toISOString(),
        likes: Number(r.likes || 0),
        hasLiked: Boolean(r.hasLiked)
      }));

    setSubmittedReviews(reviews);
    setLoadingTimeout(false);
  } catch (err) {
    if (err.name !== 'AbortError') {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      setSubmittedReviews([]);
    }
  } finally {
    setIsLoading(false);
  }
};

// Update toggleLike to handle both operations
const toggleLike = async (reviewId: number) => {
  if (!isAuthenticated) {
    setShowLoginPrompt(true);
    return;
  }

  try {
    const review = submittedReviews.find(r => r.id === reviewId);
    if (!review) return;

    const endpoint = `${API_BASE_URL}/reviews/${reviewId}/like`;
    const method = review.hasLiked ? 'DELETE' : 'POST';

    const response = await fetch(endpoint, {
      method,
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to update like');

    const updatedData = await response.json();

    setSubmittedReviews(prev => prev.map(r => 
      r.id === reviewId ? {
        ...r,
        likes: updatedData.likes,
        hasLiked: updatedData.hasLiked
      } : r
    ));
  } catch (err) {
    console.error('Like error:', err);
  }
};
  useEffect(() => {
    const abortController = new AbortController();
    let timeout: NodeJS.Timeout;

    const loadData = async () => {
      try {
        await fetchReviews(abortController.signal);
      } catch (err) {
        if (!abortController.signal.aborted) console.error('Error loading reviews:', err);
      }
    };

    loadData();
    timeout = setTimeout(() => isLoading && setLoadingTimeout(true), 10000);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
  
    try {
      const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('auth_token='))
  ?.split('=')[1];
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    credentials: 'include', // send HttpOnly cookie
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      rating: userRating,
      comment: userComment.trim()
    })
  });
  
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'TOKEN_EXPIRED') {
          const refreshed = await refreshToken();
          if (refreshed) return handleSubmit(e);
          setShowLoginPrompt(true);
          return;
        }
        throw new Error(errorData.error || 'Failed to submit review');
      }
  
      const data = await response.json();
      setSubmittedReviews(prev => [data.review, ...prev]);
      setUserRating(0);
      setUserComment('');
      setError('');
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'TOKEN_EXPIRED') {
          const refreshed = await refreshToken();
          if (refreshed) return handleDeleteReview(reviewId);
          setShowLoginPrompt(true);
          return;
        }
        throw new Error(errorData.error || 'Failed to delete review');
      }

      setSubmittedReviews(prev => prev.filter(review => review.id !== reviewId));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  
  const handleEditReview = (review: Review) => {
    if (!isAuthenticated || !user || review.user_id !== parseInt(user.id)) return;
    
    setEditingReviewId(review.id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const saveEditedReview = async () => {
    if (!editingReviewId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${editingReviewId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: editedRating,
          comment: editedComment.trim()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'TOKEN_EXPIRED') {
          const refreshed = await refreshToken();
          if (refreshed) return saveEditedReview();
          setShowLoginPrompt(true);
          return;
        }
        throw new Error(errorData.error || 'Failed to update review');
      }
  
      const data = await response.json();
      setSubmittedReviews(prev =>
        prev.map(review => 
          review.id === editingReviewId ? {
            ...review,
            rating: data.rating,
            comment: data.comment,
            date: data.date,
            firstName: data.firstName,
            lastName: data.lastName
          } : review
        )
      );
      setEditingReviewId(null);
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <AiOutlineLoading className="loading-spinner" />
        <p>Loading reviews...</p>
        {loadingTimeout && (
          <div className="loading-fallback">
            <p>This is taking longer than expected</p>
            <button onClick={() => fetchReviews()} className="retry-button">
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="testimonials-container">
      <div className="testimonials-content">
      
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')} className="close-error">
              ×
            </button>
          </div>
        )}

        <div className="rate-us-section">
          <h3 className="rate-us-heading">Share Your Experience</h3>
          <form onSubmit={handleSubmit} className="rate-us-form">
            <div className="form-group">
              <label>Your Rating:</label>
              <div className="star-rating">
                {renderStars(userRating, true, (rating) => {
                  setUserRating(rating);
                  setError('');
                })}
              </div>
              {userRating === 0 && <p className="form-hint">Kindly rate your experience</p>}
            </div>

            <div className="form-group">
              <textarea
                className="comment-input"
                placeholder="Tell us about your experience..."
                value={userComment}
                onChange={(e) => {
                  setUserComment(e.target.value);
                  setError('');
                }}
                required
              />
              {!userComment.trim() && <p className="form-hint">Please share your thoughts</p>}
            </div>

            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>

          {showLoginPrompt && (
            <div className="login-prompt">
              <p>
                Session expired. Please{' '}
                <button type="button" className="login-link" onClick={onLoginClick}>
                  login
                </button>{' '}
                to continue
              </p>
            </div>
          )}
        </div>

        <div className="testimonials-grid">
          {submittedReviews.slice(0, 3).map((review) => {
            if (!review) return null;
            return (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h4 className="review-name">
                      {review.firstName} {review.lastName}
                    </h4>
                    <p className="review-date">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                
                <div className="review-content">
                  {editingReviewId === review.id ? (
                    <div className="edit-form">
                      <textarea
                        className="edit-comment-input"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        placeholder="Edit your comment..."
                      />
                      <div className="edit-rating">
                        <label>Update Rating:</label>
                        {renderStars(editedRating, true, (rating) => setEditedRating(rating))}
                      </div>
                      <div className="edit-actions">
                        <button className="save-button" onClick={saveEditedReview}>
                          Save Changes
                        </button>
                        <button className="cancel-button" onClick={() => setEditingReviewId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="review-text">{review.comment}</p>
                      <div className="review-actions">
                        <button 
                          className="like-button"
                          onClick={() => toggleLike(review.id)}
                          disabled={!isAuthenticated}
                        >
                          {review.hasLiked ? (
                            <AiFillHeart className="liked" />
                          ) : (
                            <AiOutlineHeart />
                          )}
                          <span>{review.likes}</span>
                        </button>
                        {isAuthenticated && user && review.user_id === parseInt(user.id) && (
                          <div className="action-buttons">
                            <button className="edit-button" onClick={() => handleEditReview(review)}>
                              <AiFillEdit /> Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteReview(review.id)}>
                              <AiFillDelete /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {submittedReviews.length > 3 && (
          <div className="additional-reviews-section">
            <button
              className={`show-more-button ${showMoreReviews ? 'expanded' : ''}`}
              onClick={() => setShowMoreReviews(!showMoreReviews)}
            >
              {showMoreReviews ? 'Show Less' : 'Show More'}
              <AiOutlineArrowDown className={`arrow ${showMoreReviews ? 'upside-down' : ''}`} />
            </button>

            <div className={`hidden-reviews ${showMoreReviews ? 'visible' : ''}`}>
              {submittedReviews.slice(3).map((review) => {
                if (!review) return null;
                return (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div>
                        <h4 className="review-name">
                          {review.firstName} {review.lastName}
                        </h4>
                        <p className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="review-text">{review.comment}</p>
                    <div className="review-actions">
                      <button 
                        className="like-button"
                        onClick={() => toggleLike(review.id)}
                        disabled={!isAuthenticated}
                      >
                        {review.hasLiked ? (
                          <AiFillHeart className="liked" />
                        ) : (
                          <AiOutlineHeart />
                        )}
                        <span>{review.likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSystem;