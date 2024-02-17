import { createSlice } from "@reduxjs/toolkit";
import { markFavouriteData } from "./favouriteSlice";
const dataSlice = createSlice({
  name: "dataSlice",
  initialState: {
    LoginData: {
      userName: "",
      imageUrl: "",
    },
    BookData: {
      data: [],
      isLoaded: false,
    },
  },
  reducers: {
    addLoginData: (state, action) => {
      return {
        ...state,
        LoginData: {
          ...state.LoginData,
          userName: action.payload.username,
          imageUrl: action.payload.imageUrl,
        },
      };
    },
    addBookData: (state, action) => {
      return {
        ...state,
        BookData: {
          ...state.BookData,
          data: [...action.payload],
          isLoaded: state.BookData.data.length > 0 ? true : false,
        },
      };
    },
    addBook: (state, action) => {
      return {
        ...state,
        BookData: {
          ...state.BookData,
          data: [...state.BookData.data, action.payload],
        },
      };
    },

    markFavourtie: (state, action) => {
      let id = action.payload;
      let updatedData = state.BookData.data.map((data) => {
        return data._id == id ? { ...data, isFavourite: true } : data;
      });

      return {
        ...state,
        BookData: {
          ...state.BookData,
          data: updatedData,
        },
      };
    },
    markUnFavourtie: (state, action) => {
      let id = action.payload;
      let updatedData = state.BookData.data.map((data) => {
        return data._id == id ? { ...data, isFavourite: false } : data;
      });

      return {
        ...state,
        BookData: {
          ...state.BookData,
          data: updatedData,
        },
      };
    },
    deleteBooks: (state, action) => {
      const filteredData = state.BookData.data.filter((data) => {
        return data._id != action.payload;
      });
      return {
        ...state,
        BookData: {
          ...state.BookData,
          data: filteredData,
        },
      };
    },

    updatedBooks: (state, action) => {
      let updatedData = state.BookData.data.map((data) => {
        return data._id == action.payload.id ? action.payload.data : data;
      });
      return {
        ...state,
        BookData: {
          ...state.BookData,
          data: updatedData,
        },
      };
    },
  },
});

export const {
  addLoginData,
  addBookData,
  addBook,
  markFavourtie,
  markUnFavourtie,
  deleteBooks,
  updatedBooks,
} = dataSlice.actions;
export default dataSlice.reducer;
