import React from "react";

function CartItem({ item, decreaseQty, increaseQty, removeCartItem }) {
  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image || ""} alt={item.name || "Product Image"} className="item-image" />

        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>

          <p className="item-price">
            <strong>Price: </strong>${item.price}
          </p>

          <p className="item-quantity">
            <strong>Quantity: </strong> {item.quantity}
          </p>
        </div>
      </div>

      <div className="quantity-controls">
        <button className="quantity-button decrease-btn" onClick={() => decreaseQty(item.product, item.quantity)}> - </button>
        <input
          type="number"
          value={item.quantity}
          className="quantity-input"
          readOnly
          min="1"
        />
        <button className="quantity-button increase-btn" onClick={() => increaseQty(item.product, item.quantity, item.stock)}> + </button>
      </div>

      <div className="item-total">
        <span className="item-total-price">${(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <div className="item-actions">
        <button className="remove-item-btn" onClick={() => removeCartItem(item.product)}>Remove</button>
      </div>
    </div>
  );
}

export default CartItem;
