import { orderBurgerApi } from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export interface IBurgerState {
  burger: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  modalOrder: TOrder | null;
  isOrderLoading: boolean;
  error: string | null;
}

const initialState: IBurgerState = {
  burger: {
    bun: null,
    ingredients: []
  },
  modalOrder: null,
  isOrderLoading: false,
  error: null
};

export const addOrder = createAsyncThunk('order/addOrder', orderBurgerApi);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  selectors: {
    burgerSelector: (state) => state.burger,
    isOrderLoadingSelector: (state) => state.isOrderLoading,
    modalOderSelector: (state) => state.modalOrder
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burger.bun = action.payload;
        } else {
          state.burger.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    upIngredient: (state, action: PayloadAction<number>) => {
      const array = state.burger.ingredients;
      const index = action.payload;
      array.splice(index - 1, 0, array.splice(index, 1)[0]);
    },
    downIngredient: (state, action: PayloadAction<number>) => {
      const array = state.burger.ingredients;
      const index = action.payload;
      array.splice(index + 1, 0, array.splice(index, 1)[0]);
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.burger.ingredients = state.burger.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    clearBurger: (state) => {
      state.burger.bun = null;
      state.burger.ingredients = [];
    },
    clearOrder: (state) => {
      state.modalOrder = null;
      state.isOrderLoading = false;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(addOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message!;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.modalOrder = action.payload.order;
      });
  }
});

export const { burgerSelector, isOrderLoadingSelector, modalOderSelector } =
  burgerSlice.selectors;
export const {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  clearBurger,
  clearOrder
} = burgerSlice.actions;
export default burgerSlice.reducer;
