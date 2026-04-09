import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { removeErrors } from "../user/userSlice";
import axios from "axios";

// Fetch Product
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Error while fetching the products",
        },
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/api/v1/admin/product/create",
        productData,
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Error while fetching the products",
        },
      );
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    loading: false,
    error: null,
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        ((state.loading = false), (state.products = action.payload.products));
        // From product controller
      })

      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error while fetching the products";
      });

    // builder
    // .addCase(fetchAdminProducts.pending, (state) => {
    //   state.loading = false;
    //   state.error = null;
    // })

    // .addCase(fetchAdminProducts.fulfilled, (state, action) => {
    //   ((state.loading = false), (state.products = action.payload.products));
    //   // From product controller
    // })

    // .addCase(createProduct.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error =
    //     action.payload?.message || "Error while fetching the products";
    // });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;
