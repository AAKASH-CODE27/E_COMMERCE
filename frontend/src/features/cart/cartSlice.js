import { createSlice,  createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//Adding items to Cart

export const addItemsToCart = createAsyncThunk( "cart/addItemsToCart",
  async ({id, quantity}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      console.log(data);
      return {
        product: data.product._id,
        name : data.product.name,
        price : data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity
        
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldnt Register User. Try Again!');
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {},
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      state.message = "Item removed from cart successfully";
      state.success = true;
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },

  extraReducers:(builder) => {
    builder.addCase(addItemsToCart.pending,(state,action) => {
        state.loading = true;
        state.error = null;
    })
    builder.addCase(addItemsToCart.fulfilled,(state,action) => {
        const item = action.payload
        
        const existingItem = state.cartItems.find((i) => i.product === item.product)

        if(existingItem){
          existingItem.quantity = item.quantity
           state.message = ` Updated ${item.name} quantity in Cart sucessfullly`;
        }
        else{
          state.cartItems.push(item);
          state.message = `${item.name} is Added to Cart sucessfullly`;
        }
        state.error = null;
        state.success = true;
        state.loading = false;
       
        localStorage.setItem('cartItems',JSON.stringify(state.cartItems));
    
    })
    builder.addCase(addItemsToCart.rejected,(state,action) => {
        state.loading = false;
        state.error = action.payload?.message ||
        action.error?.message || 'An Error Occured Try Again!';
        })
  }
});

export const { removeErrors, removeMessage, removeItemFromCart, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
