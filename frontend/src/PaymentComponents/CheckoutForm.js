import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { rootAddress } from "../requests/axiosRequest";
import "./CollectPaymentInfo.css"


export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nameItem, setNameItem] = useState('');

  useEffect(() => {
    if (!Object.hasOwn(props.data.itemData.metadata, 'items_data')) {
      setNameItem(props.data.itemData.metadata.name_item)
    }
    else {
      setNameItem(props.data.itemData.metadata.items_data)
    }
  }, [])

  const convertToPriceString = (amount) => {
    let number = amount.toString()
    return number.substring(0, number.length - 2) + '.' + number.substring(number.length - 2)
  }

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage('Success payment')
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Something went wrong.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${rootAddress}success_payment`,
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="form_payment" onSubmit={handleSubmit}>
      <h3>Paid items: {nameItem}</h3>
      {Object.values(props.data.discounts).map((discount, index) => (
        <div className="d-flex justify-content-left">
          <span>{`${discount.title} ${discount.percent}%`}</span>
        </div>
      ))}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button className="button-pay" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : `Pay now ${convertToPriceString(props.data.itemData.amount)} ${props.data.itemData.currency}`}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}