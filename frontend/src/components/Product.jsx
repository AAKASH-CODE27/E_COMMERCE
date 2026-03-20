import React from "react";
import "../componentStyles/Product.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

function Product({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product_id">
      <div className="product-card">
        <img src={product.image[0].url} alt={product.name} className='product-image-card'/>
        <div className="product-details">
          <h3 className="product-title">{product.name}</h3>
          <Rating value={product.ratings} precision={0.5} readOnly />
          <p className="home-price">
            <strong>Price </strong> {product.price}/-
          </p>
          <span className="productCardSpan">{product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"}</span><br/>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </Link>
  );
}

export default Product;
