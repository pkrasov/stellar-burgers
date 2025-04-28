import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../utils/cookie';

export interface IUserState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: TUser | null;
  orders: TOrder[];
  ordersLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  isLoggedIn: false,
  isLoading: false,
  user: null,
  orders: [],
  ordersLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }: TLoginData) =>
    loginUserApi({ email, password }).then(
      ({ refreshToken, accessToken, user }) => {
        setCookie('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return user;
      }
    )
);

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async ({ email, name, password }: TRegisterData) =>
    registerUserApi({ email, name, password }).then(
      ({ refreshToken, accessToken, user }) => {
        setCookie('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return user;
      }
    )
);
export const logoutUser = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

export const getUser = createAsyncThunk('users/getUser', getUserApi);

export const updateUser = createAsyncThunk('users/updateUser', updateUserApi);

export const getOrders = createAsyncThunk('users/getUserOrders', getOrdersApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isLogedInSelector: (state) => state.isLoggedIn,
    isLoadingSelector: (state) => state.isLoading,
    userSelector: (state) => state.user,
    // userNameSelector: (state) => state.user?.name || '',
    // userEmailSelector: (state) => state.user?.email || '',
    userOrdersSelector: (state) => state.orders,
    //ordersRequestSelector: (state) => state.orders,
    errorSelector: (state) => state.error
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message!;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoggedIn = false;
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = false;
        state.isLoading = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.isLoggedIn = true;
      })
      .addCase(getOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message!;
        state.ordersLoading = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersLoading = false;
      });
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isLogedInSelector,
  isLoadingSelector,
  userSelector,
  userOrdersSelector,
  errorSelector
} = userSlice.selectors;
export default userSlice.reducer;
