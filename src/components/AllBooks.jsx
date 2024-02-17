import { useEffect, useRef, useState } from "react";
// import Card from "./Card";
import axios from "axios";
import Modal from "./Modal";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  addBook,
  addBookData,
  markFavourtie,
  markUnFavourtie,
} from "../slices/dataSlice";
import { markFavouriteData } from "../slices/favouriteSlice";
import { markUnFavouriteData } from "../slices/favouriteSlice";
import { deleteBooks } from "../slices/dataSlice";
import { updatedBooks } from "../slices/dataSlice";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from "primereact/button";

import { Fieldset } from "primereact/fieldset";
import { IoBookmark } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import noimage from "../assets/No-Image-Placeholder.svg.png";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import CsvDownloadButton from "react-json-to-csv";
import { FaDownload } from "react-icons/fa";

const AllBooks = () => {
  let allBooksData = useSelector((state) => state.dataSlice.BookData?.data);
  let isLoaded = useSelector((state) => state.dataSlice.BookData.isLoaded);
  let pricedData = allBooksData.map((data) => {
    return data.price;
  });
  pricedData = pricedData.sort((a, b) => b - a)[0];
  console.log(pricedData, "pricedData show book");
  const dispatch = useDispatch();
  console.log(allBooksData, "addBookData--");
  const [addLoader, setAddLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const fileInput = useRef();
  const [addValues, setAddValues] = useState({
    title: "",
    author: "",
    price: null,
  });
  const [updateValues, setUpdateValues] = useState(null);

  console.log(updateValues, "show the updated values");
  console.log(addValues, "show the add values here");
  const [category, setCategory] = useState("");
  // const [UpdateCategory, setUpdateCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("reset");
  const [searchValue, setSearchValue] = useState("");
  const [price, setPrice] = useState(0);
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [visible, setVisible] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);

  const fetchAllBooks = async () => {
    if (isLoaded) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://backendbook-i5a3.onrender.com/v1/books/getAllBooks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      dispatch(addBookData(response?.data));
      setIsLoading(false);
      console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const AddToFavourite = async (id) => {
    const response = await axios.post(
      `https://backendbook-i5a3.onrender.com/v1/books/markFavourite/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const favouritePayload = allBooksData.find((d) => {
      return d._id == id;
    });
    if (response.status === 200) {
      dispatch(markFavourtie(id));
      dispatch(markFavouriteData(favouritePayload));
    }
    console.log(response, "response---");
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
    console.log(response, "response---");
  };

  const handleAddChange = (e) => {
    let { value, name } = e.target;
    setAddValues({
      ...addValues,
      [name]: value,
    });
  };

  const updateModalOpen = (id) => {
    setUpdateId(id);
    const previousValues = allBooksData.find((data) => {
      return data._id == id;
    });
    setUpdateValues(previousValues);
    console.log(previousValues, "previousValues---===");
    console.log(id, "update id show");
    setShowModal(true);
  };

  const handleUpdateChange = (e) => {
    let { value, name } = e.target;
    setUpdateValues({
      ...updateValues,
      [name]: value,
    });
  };
  console.log(updateValues);

  const handleUpdateBook = async () => {
    try {
      setAddLoader(true);
      const fileData = fileInput?.current?.files[0];
      const formData = new FormData();
      formData.append("author", updateValues?.author);
      formData.append("isFavourite", updateValues?.isFavourite);
      formData.append("price", updateValues?.price);
      formData.append("title", updateValues?.title);
      formData.append("category", updateValues?.category);
      if (updateValues.imageUrl?.public_id) {
        formData.append("public_id", updateValues.imageUrl?.public_id);
      }
      formData.append("file", fileData);
      const response = await axios.put(
        `https://backendbook-i5a3.onrender.com/v1/books/updateBook/${updateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        dispatch(updatedBooks({ id: updateId, data: response?.data?.data }));
        setAddLoader(false);
        fileInput.current = null;
      }
    } catch (error) {
      console.log(error);
      setAddLoader(false);
    }
  };

  const handleAddBook = async () => {
    try {
      setAddLoader(true);
      if (!addValues.author || !addValues.price || !addValues.title) {
        return alert("please fill all the fields");
      }

      let formData = new FormData();
      formData.append("title", addValues.title);
      formData.append("price", parseInt(addValues.price));
      formData.append("author", addValues.author);
      formData.append("isFavourite", false);
      formData.append("category", category);
      formData.append("file", fileInput.current.files[0]);

      const response = await axios.post(
        `https://backendbook-i5a3.onrender.com/v1/books/createBooks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "show the response of add here ");
      if (response.status == 201) {
        dispatch(addBook(response.data.user));
        setAddLoader(false);
        setShowModal(false);
      }
    } catch (error) {
      setAddLoader(false);
      console.log(error);
    }
  };

  const handleDeleteBook = async (id) => {
    setIsLoading(true);
    const response = await axios.delete(
      `https://backendbook-i5a3.onrender.com/v1/books/deleteBook/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (response.status == 200) {
      dispatch(deleteBooks(id));
      setIsLoading(false);
    }
  };

  const Headercomp = ({ imageUrl }) => {
    return (
      <div style={{ height: "100%" }}>
        <img
          alt="Card"
          style={{ height: "100%" }}
          src={imageUrl ? imageUrl : noimage}
        />
      </div>
    );
  };

  const SubTitleComponent = ({ author, price }) => {
    return (
      <div>
        <div className="wrapper_sub flex justify-between items-center">
          <p className="underline">Author: {author}</p>
          <p className="p-para text-white">
            <p className="border-[green]">
              {" "}
              <span className="WebRupee">&#x20B9; </span>
              {price}
            </p>
          </p>
        </div>
      </div>
    );
  };
  console.log(downloadLoader, "show the download Loader...");
  const FooterComponent = ({ id }) => {
    const JsonData = allBooksData.filter((data) => {
      return data._id === id;
    });

    console.log(JsonData, `${id}`);

    console.log(id, "show the footer id ");
    return (
      <div className="wrapper_footer">
        <Button
          onClick={() => {
            setVisible(true);
            setDeleteId(id);
          }}
          label={<MdDelete color="white" size="1.6rem" />}
          severity="danger"
          className="deleIcon"
          raised
        />
        <Button
          onClick={() => {
            updateModalOpen(id);
          }}
          label={<CiEdit color="white" size="1.6rem" />}
          severity="info"
          className="EditIcon"
          raised
        />

        <CsvDownloadButton
          data={JsonData}
          filename={JsonData[0].title.toUpperCase()}
          style={{
            boxShadow: "inset 0px 1px 0px 0px #060605",
            background: "#060605",
            backgroundColor: "#060605",
            borderRadius: "6px",
            border: "1px solid #060605",
            display: "inline-block",
            cursor: "pointer",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "0.50rem 1rem",
            textDecoration: "none",
            textShadow: "0px 1px 0px #9b14b3",
            marginLeft: "12px",
          }}
        >
          <FaDownload />
        </CsvDownloadButton>
      </div>
    );
  };
  useEffect(() => {
    fetchAllBooks();
  }, []);
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Button
          icon="pi pi-arrow-right"
          // label="Filter"
          onClick={() => setVisibleLeft(true)}
        />
      </div>

      <ConfirmDialog
        group="declarative"
        visible={visible}
        onHide={() => setVisible(false)}
        message="Are you sure you want to proceed?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          handleDeleteBook(deleteId);
        }}
        reject={() => {
          setVisible(false);
          setDeleteId("");
        }}
      />
      {isLoading ? (
        <div className="flex  justify-center items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-20 h-11 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              style={{ height: `80vh` }}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className=" flex-wrap justify-end mr-2">
          <Sidebar
            visible={visibleLeft}
            position="right"
            onHide={() => setVisibleLeft(false)}
          >
            <div className="AddBook float-right">
              <select
                onClick={() => {
                  setPrice(0);
                }}
                name="cars"
                id="cars"
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                }}
              >
                <option selected value="reset">
                  select category
                </option>
                <option value="Action">Action</option>
                <option value="Thriller">Thriller</option>
                <option value="Comic">Comic</option>
                <option value="Story">Story</option>
              </select>
              {price}
              <div className="slidecontainer ">
                <input
                  type="range"
                  min={0}
                  max={pricedData}
                  className="slider w-full"
                  id="myRange"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
            </div>
          </Sidebar>
          <div className="search_wrapper flex justify-center mb-4">
            <input
              type="text"
              className="py-1 px-4  text-center"
              placeholder="search by title"
              onClick={() => {
                setFilterCategory("reset");
                setPrice(0);
              }}
              style={{
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              }}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setShowModal(true);
              setUpdateValues(null);
            }}
            className="ml-3 text-white bg-[#262626] hover:bg-[#9b9797] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#262626] dark:hover:bg-[#262626] focus:outline-none dark:focus:[#262626]"
          >
            Add Books
          </button>

          <div className="flex flex-wrap justify-start ml-2 wrapper_cardss">
            <div className="card flex justify-content-center"></div>
            {allBooksData.length > 0 ? (
              <>
                {allBooksData
                  .filter((data) => {
                    const isCategoryMatch =
                      filterCategory === "reset" ||
                      data.category === filterCategory;
                    const isSearchMatch =
                      searchValue === "" ||
                      data.title
                        .toLowerCase()
                        .includes(searchValue.toLowerCase());
                    const isPriceMatch = price === 0 || data.price <= price;

                    if (isCategoryMatch && isSearchMatch && isPriceMatch) {
                      console.log("check");
                      return data;
                    }
                  })
                  ?.map((data, key) => {
                    return (
                      // <Card
                      //   key={key}
                      //   title={data?.title}
                      //   author={data?.author}
                      //   price={data?.price}
                      //   isFavourite={data?.isFavourite}
                      //   AddToFavourite={AddToFavourite}
                      //   removeFromFavourite={removeFromFavourite}
                      //   id={data?._id}
                      //   handleDeleteBook={handleDeleteBook}
                      //   category={data.category}
                      //   imageUrl={data?.imageUrl}
                      //   deleteIcon={true}
                      //   setIsModalOpen={setIsModalOpen}
                      //   isModalOpen={isModalOpen}
                      //   EditIcon={true}
                      //   setUpdateId={setUpdateId}
                      //   setShowModal={setShowModal}
                      //   updateModalOpen={updateModalOpen}
                      //   setUpdateValues={setUpdateValues}
                      // />
                      <div key={key} className="wrapper_all">
                        <Fieldset
                          legend={
                            <span>
                              {data.isFavourite ? (
                                <IoBookmark
                                  color="yellow"
                                  size="1.2rem"
                                  onClick={() => {
                                    removeFromFavourite(data._id);
                                  }}
                                />
                              ) : (
                                <CiBookmark
                                  color="white"
                                  size="1.2rem"
                                  onClick={() => {
                                    AddToFavourite(data._id);
                                  }}
                                />
                              )}
                            </span>
                          }
                        >
                          <Card
                            title={data.title}
                            subTitle={
                              <SubTitleComponent
                                author={data.author}
                                price={data.price}
                              />
                            }
                            footer={<FooterComponent id={data._id} />}
                            header={
                              <Headercomp imageUrl={data?.imageUrl?.imageUrl} />
                            }
                            key={key}
                            // className="md:w-25rem lg:w-25rem"
                            style={{
                              width: "25rem",
                              marginRight: "1rem",
                              height: "min-content !important",
                              margin: "0px",
                              paddingTop: "0px",
                            }}
                          >
                            <p className="m-0">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Inventore sed consequuntur error
                              repudiandae numquam deserunt quisquam repellat
                              libero asperiores earum nam nobis, culpa ratione
                              quam perferendis esse, cupiditate neque quas!
                            </p>
                          </Card>
                        </Fieldset>
                      </div>
                    );
                  })}
              </>
            ) : (
              <h6>No Book data available</h6>
            )}
          </div>
        </div>
      )}
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          setAddValues={setAddValues}
          handleAddChange={handleAddChange}
          handleAddBook={handleAddBook}
          addLoader={addLoader}
          setCategory={setCategory}
          fileInput={fileInput}
          setUpdateValues={setUpdateValues}
          handleUpdateChange={handleUpdateChange}
          updateValues={updateValues}
          addValues={addValues}
          handleUpdateBook={handleUpdateBook}
          category={category}
        />
      )}
    </div>
  );
};

export default AllBooks;
