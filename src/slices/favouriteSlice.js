import { createSlice } from "@reduxjs/toolkit";

const favourtieSlice = createSlice({
  name: "favoutriteSlice",
  initialState: {
    favouriteData: [],
    isLoaded: false,
  },
  reducers: {
    LoadApiData: (state, action) => {
      return {
        ...state,
        favouriteData: [...action.payload],
        isLoaded: true,
      };
    },
    markFavouriteData: (state, action) => {
      let payload = {
        ...action.payload,
        isFavourite: true,
      };
      console.log(payload, "show the payload of favourite");
      return {
        ...state,
        favouriteData: [...state.favouriteData, payload],
      };
    },
    markUnFavouriteData: (state, action) => {
      //   let payload = {
      //     ...action.payload,
      //     isFavourite: false,
      //   };
      //   console.log(payload, "show the payload of favourite");
      const filteredData = state.favouriteData.filter((data) => {
        return data._id != action.payload;
      });
      return {
        ...state,
        favouriteData: filteredData,
      };
    },
  },
});

export const {
  LoadApiData,
  markFavouriteData,
  markUnFavouriteData,
} = favourtieSlice.actions;
export default favourtieSlice.reducer;
