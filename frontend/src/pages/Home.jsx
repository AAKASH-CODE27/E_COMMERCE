import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../pageStyles/Home.css";
import Product from "../components/Product";
import ImageSlider from "../components/ImageSlider";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

//const products = [
//   {
//     _id: "69884697267af07bb60939d9",
//     name: "Product1",
//     description: "Product Description",
//     price: 100,
//     ratings: 4.5,
//     image: [
//       {
//         public_id: "Test Id",
//         url: "Test Url",
//         _id: "69884697267af07bb60939da",
//       },
//     ],
//     category: "shirt",
//     stock: 6,
//     numOfReviews: 1,
//     reviews: [
//       {
//         user: "69999585ca634fd9c8e812ae",
//         name: "USER2",
//         rating: 5,
//         comment: "Nice Product and edited",
//         _id: "6999e8325d7fe694d7cad740",
//       },
//     ],
//     createdAt: "2026-02-08T08:17:27.334Z",
//     __v: 2,
//   },
//   {
//     _id: "6988734495e1f7da4db1045e",
//     name: "Product2",
//     description: "Product Description",
//     price: 200,
//     ratings: 0,
//     image: [
//       {
//         public_id: "Test Id2",
//         url: "Test Url2",
//         _id: "6988734495e1f7da4db1045f",
//       },
//     ],
//     category: "Phone",
//     stock: 11,
//     numOfReviews: 0,
//     reviews: [],
//     createdAt: "2026-02-08T11:28:04.613Z",
//     __v: 0,
//   },
// ];

function Home() {
  const { loading, error, products, productCount } = useSelector(
    (state) => state.product,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: `top-center`, autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Home-My Website" />
          <Navbar />
          <ImageSlider />
          <div className="home-container">
            <h2 className="home-heading"> Best EMart </h2>
            <div className="home-product-container">
              {products.map((product) => (
                <Product product={product} key={product._id} />
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Home;
