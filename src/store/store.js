import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "../slices/dataSlice";
import favouriteSlice from "../slices/favouriteSlice";
export const store = configureStore({
  reducer: { dataSlice, favouriteSlice },
});
