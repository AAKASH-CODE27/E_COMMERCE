import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword, page = 1, category }, { rejectWithValue }) => {
    try {
      let link = `/api/v1/products?page=${page}`;
      if (keyword) {
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }
      if (category) {
        link += `&category=${encodeURIComponent(category)}`;
      }

      // const link = keyword
      //   ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}&category=${encodeURIComponent(category)}`
      //   : `/api/v1/products?page=${page}&category=${encodeURIComponent(category)}`;

      const { data } = await axios.get(link);
      console.log("Response", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  },
);

// Product Details
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

// Sumbit Review
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/v1/review",
        { rating, comment, productId },
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultsPerPage: 4,
    totalPages: 0,
    reviewSuccess: false,
    reviewLoading: false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Get Product
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        console.log("Fulfilled action payload", action.payload);
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultsPerPage = action.payload.resultsPerPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });

// Product Details
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProductDetails.fulfilled, (state, action) => {
        console.log("Product Details Fulfilled", action.payload);
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })

      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
// Review 
    builder
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })

      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
      })

      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;