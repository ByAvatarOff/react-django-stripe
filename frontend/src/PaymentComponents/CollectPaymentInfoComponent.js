import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";
import { request } from "../requests/axiosRequest";

import "./CollectPaymentInfo.css";

const stripePromise = loadStripe("pk_test_51ORv6tCOT7qXCmxHXQwFvOWHfviZSYZqipf5P736Tl64pT2WBXOhsUySO3y3D4ySaOSOqHSBd1iQERtNfDs7kgbC00PhhDkuiF");

export default function CollectPaymentInfoComponent() {
  const location = useLocation()
  const item_id = location.state?.item_id
  const multiply_flag = location.state?.multiply_flag
  const pay_currency = location.state?.pay_currency
  const discounts = !location.state.discounts ? [] : location.state.discounts


  const [clientSecret, setClientSecret] = useState("");
  const [itemData, setItemData] = useState("");

  useEffect(() => {
    if (multiply_flag) {
      request.get(`api/items/create_multiply_order/${item_id.toString()}/${pay_currency}/`)
        .then((response) => {
          setClientSecret(response.data.client_secret)
          setItemData(response.data)
        }).catch(error => alert(error))
    }
    else {
      request.get(`api/items/buy/${item_id}/`)
        .then((response) => {
          setClientSecret(response.data.client_secret)
          setItemData(response.data)
        }).catch(error => alert(error))
    }
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <section className="main-section">
      <div className="Payment">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm data={{ itemData: itemData, discounts: discounts }} />
          </Elements>
        )}
      </div>
    </section>
  );
}