import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { removeErrors } from "../user/userSlice";
import axios from "axios";

// Fetch Product
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
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

// CREATE PRODUCT
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
          message: "Error while creating the products",
        },
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({id, formData}, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(
        `/api/v1/admin/product/{id}`,
        formData,
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Error while Updating the products",
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
    product: {}
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
        state.loading = false;
        state.products = action.payload.products;
        // From product controller
      })

      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unable to Create Product";
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.product);
        // From product controller
        state.success = true;
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unable to Create Product";
      });

      builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {

        state.loading = true;
        state.success = action.payload.success
        state.product = action.payload.payment;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unable to Create Product";
      });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;
