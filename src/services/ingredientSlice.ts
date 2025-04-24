import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export interface IIngredientState {
  ingredientLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
}

const initialState: IIngredientState = {
  ingredientLoading: false,
  ingredients: [],
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const res = await getIngredientsApi();
    return res;
  }
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    ingredientLoadingSelector: (state) => state.ingredientLoading
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.ingredientLoading = true;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.ingredientLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredientLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { ingredientLoadingSelector, ingredientsSelector } =
  ingredientSlice.selectors;
export default ingredientSlice.reducer;
