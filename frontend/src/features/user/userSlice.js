import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register API

export const register = createAsyncThunk( "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/v1/register", userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldnt Register User. Try Again!');
    }
  },
);

export const login = createAsyncThunk( "user/login",
  async ({email,password}, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/v1/login", {email, password}, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldn\'t Login User. Try Again!');
    }
  },
);

export const loadUser = createAsyncThunk( "user/load",
  async (_, { rejectWithValue }) => {
    try { 
      const { data } = await axios.get("/api/v1/profile");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldn\'t Load User. Try Again!');
    }
  },
);

export const logout = createAsyncThunk( "user/logout",
  async (_, { rejectWithValue }) => {
    try { 
      const { data } = await axios.post("/api/v1/logout",{withCredentials:true});
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldn\'t Logout User. Try Again!');
    }
  },
);

// error FOR CORRECT WORKING JUST CHECK

export const updateProfile = createAsyncThunk( "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try { 
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put("/api/v1/profile/update",userData,config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldn\'t Update Profile. Try Again!');
    }
  },
);

export const updatePassword = createAsyncThunk( "user/updatePassword",
  async (formData, { rejectWithValue }) => {
    try { 
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put("/api/v1/password/update",formData,config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Couldn\'t Update Password. Try Again!');
    }
  },
);

export const forgotPassword = createAsyncThunk( "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try { 
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/v1/password/forgot",email,config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || {message : 'Email Sent Failed, Try Again!'});
    }
  },
);

export const resetPassword = createAsyncThunk( "user/resetPassword",
  async ({token, userData}, { rejectWithValue }) => {
    try { 
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(`/api/v1/reset/${token}`, userData,config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || {message : 'Reset Password failed, Try Again!'});
    }

  },
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: null,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.user = action.payload?.user || null; 
            state.isAuthenticated = false;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Couldnt Register User. Try Again!' ;
            state.success = false;
            state.user = null;  
            state.isAuthenticated = false;
        });

    // Login cases
         builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.user = action.payload?.user || null; 
            state.isAuthenticated = true;
            //console.log(state.user);
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Couldn\'t Login User. Try Again!';
            state.success = false;
            state.user = null;  
            state.isAuthenticated = false;
        });

        // Loading Cases 

        builder.addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null; 
            state.isAuthenticated = true;
            //console.log(state.user);
        });
        builder.addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to Load User. Try Again!';
            state.success = false;
            state.user = null;  
            state.isAuthenticated = false;
        });

        // Logout Cases

        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = null; 
            state.isAuthenticated = false;
            //console.log(state.user);
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to Logout User. Try Again!';
        });

        // Update Profile 

        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null; 
            state.message = action.payload?.message || null; 
            state.success = action.payload?.success || false;

        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to Update Profile. Try Again!';
        });

        // Update Password
        builder.addCase(updatePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload?.message || null; 
            state.success = action.payload?.success || true;
            
        });
        builder.addCase(updatePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message ||
        action.error?.message || 'Failed to Update Password. Try Again!';
        });

        // Forgot Password

        builder.addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload?.message || null; 
            state.success = action.payload?.success || true;
            
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message ||
        action.error?.message || 'Email Sent Failed, Try Again!';
        });

        // Reset Password

        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload?.message || null; 
            state.user = null;
            state.isAuthenticated = false;
            
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Reset Password Failed, Try Again!';
        });
    }
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;