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

//UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(
        `/api/v1/product/${id}`,
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

// DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/admin/product/${productId}`,
        {
          withCredentials: true,
        },
      );
      return { productId };
    } catch (error) {
      console.log("ERROR", error);
      console.log("RESPONSE", error.response);
      return rejectWithValue(
        error.response?.data || {
          message: "Error while Deleting the products",
        },
      );
    }
  },
);

// GET ALL USER - FETCHING
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/users`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to Fetch Users" },
      );
    }
  },
);

// GET SINGLE USER - FETCHING
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to Fetch Required User" },
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
    product: {},
    deleteLoading: false,
    deleting: {},
    users: [],
    user: {}
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
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unable to Update Product";
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        const productId = action.meta.arg;
        // state.deleteLoading = true;
        // state.error = null;
        state.deleting[productId] = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.deleting[productId] = false;
        state.success = action.payload.success;
        state.products = action.products.filter(
          (product) => product._id !== productId,
        );
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;
        state.error = action.payload?.message || "Unable to Delete Product";
      });

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unable to Fetch Users";
      });

      builder
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unable to Fetch required Users";
      });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;
