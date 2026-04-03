import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  getProductDetails,
  removeErrors,
} from "../features/products/productSlice";
import { addItemsToCart, removeMessage } from "../features/cart/cartSlice";

// USED FOR SHOWING THE DETAIL OF THE PRODUCT
function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const { loading, error, product } = useSelector((state) => state.product);
  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
    cartItems,
  } = useSelector((state) => state.cart);

  // console.log(cartItems);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }

    return () => {
      dispatch(removeErrors(id));
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }

    if (cartError) {
      toast.error(cartError, { position: "top-center", autoClose: 3000 });
    }
  }, [dispatch, error, cartError]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="Product Not Found" />
        <Navbar />
        <div className="error-container">
          <h2 className="error-message">Product Not Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  const decreaseQuantity = () => {
    if (quantity < 2) {
      toast.error(`Selected item quanity cannot be zero`, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
      return;
    }
    setQuantity((quantity) => quantity - 1);
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error(`Required Quantity is not available in Stock!!`, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
      return;
    }
    setQuantity((quantity) => quantity + 1);
  };

  const addToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
  };

  return (
    <div>
      <>
        <PageTitle title={`${product.name} - Details`} />
        <Navbar />

        <div className="product-details-container">
          <div className="product-detail-container">
            <div className="product-image-container">
              <img
                src={product.image[0].url.replace("./", "/")}
                alt="Product title"
                className="product-detail-image"
              />
            </div>

            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: ${product.price}</p>

              <Stack spacing={1}>
                <Rating value={product.ratings || 0} precision={0.5} readOnly />
                <Typography variant="body2">
                  {product.ratings || 0} / 5
                </Typography>
              </Stack>

              <span className="productCardSpan">
                {product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "Review" : "Reviews"}
              </span>

              <br />

              <div className="stock-status">
                <span
                  className={product.stock > 0 ? "in-stock" : "out-of-stock"}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock} available)`
                    : "Out Of Stock"}
                </span>
              </div>

              {product.stock > 0 && (
                <>
                  <div className="quantity-controls">
                    <span className="quantity-label">Quantity:</span>

                    <button
                      className="quantity-button"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>

                    <input
                      type="text"
                      value={quantity}
                      className="quantity-value"
                      readOnly
                    />

                    <button
                      className="quantity-button"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={addToCart}
                    disabled={cartLoading}
                  >
                    {cartLoading ? "Addng" : "Add to Cart"}
                  </button>
                </>
              )}

              <form className="review-form">
                <h3>Submit Your Review</h3>

                <Rating
                  // name="simple-controlled"
                  value={4}
                  onRatingChange={handleRatingChange}
                />

                <textarea
                  placeholder="Write your review here..."
                  className="review-input"
                ></textarea>

                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          <div className="reviews-container">
            <h3>Customer Reviews</h3>

            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.name}</span>
                    <Rating value={review.rating} readOnly />
                  </div>

                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">
                No reviews yet. Want to be the first to review this product!
              </p>
            )}
          </div>
        </div>

        <Footer />
      </>
    </div>
  );
}

export default ProductDetails;
