import React from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/solid";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../slices/basketSlice";

function CheckoutProduct({
  id,
  title,
  price,
  rating,
  description,
  category,
  image,
  prime,
}) {
  const dispatch = useDispatch();

  //Function to Add more items
  const addtobasket = () => {
    const product = {
      id,
      title,
      price,
      description,
      rating,
      category,
      image,
      prime,
    };
    dispatch(addToBasket(product));
  };

  //Function to remove items
  const removefrombasket = () => {
    dispatch(removeFromBasket({ id }));
  };

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} objectFit="contain" />

      <div className="col-span-3 mx-5 ">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <div className="mb-5 ">
          <Currency quantity={price} />
        </div>
        {prime && (
          <div className="flex items-center space-x-2 -mt-5">
            <img
              loading="lazy"
              className="w-12"
              src="https://whitebox.com/wp-content/uploads/2020/05/Prime-tag-.png"
              alt=""
            />
            <p className="text-xs text-gray-500">Free One-day Delivery</p>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button onClick={addtobasket} className="mt-auto button">
          Add More
        </button>
        <button onClick={removefrombasket} className="mt-auto button">
          Remove from Basket
        </button>
      </div>
    </div>
  );
}

export default CheckoutProduct;
