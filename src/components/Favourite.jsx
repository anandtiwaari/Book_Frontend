import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { markUnFavourtie } from "../slices/dataSlice";
import { LoadApiData, markUnFavouriteData } from "../slices/favouriteSlice";
const Favourite = () => {
  const dispatch = useDispatch();
  const favouriteData = useSelector(
    (state) => state.favouriteSlice.favouriteData
  );
  const isLoaded = useSelector((state) => state.favouriteSlice.isLoaded);

  const getAllFavouriteBooks = async () => {
    if (isLoaded) {
      return;
    }
    let response = await axios.get(
      "https://backendbook-i5a3.onrender.com/v1/books/favourites",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    dispatch(LoadApiData(response?.data));
    console.log(response);
  };
  const removeFromFavourite = async (id) => {
    const response = await axios.post(
      `https://backendbook-i5a3.onrender.com/v1/books/markUnFavourite/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch(markUnFavourtie(id));
      dispatch(markUnFavouriteData(id));
    }
  };
  useEffect(() => {
    getAllFavouriteBooks();
  }, []);
  return (
    <div>
      <Navbar />
      <div
        className={`flex flex-wrap  ml-2 ${
          favouriteData.length > 0 ? "justify-start" : "justify-center"
        } `}
      >
        {favouriteData.length > 0 ? (
          <>
            {favouriteData.map((data, key) => {
              return (
                <Card
                  key={key}
                  title={data?.title}
                  author={data?.author}
                  price={data?.price}
                  isFavourite={data?.isFavourite}
                  removeFromFavourite={removeFromFavourite}
                  id={data?._id}
                  deleteIcon={false}
                />
              );
            })}
          </>
        ) : (
          <h6 className="flex justify-center items-center">
            No data available in favourites
          </h6>
        )}
      </div>
    </div>
  );
};

export default Favourite;
