import React, { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import { request } from "../requests/axiosRequest";



export default function ConfirmOrderComponent() {
    const [currentCurrency, setcurrentCurrency] = useState('EUR')
    const location = useLocation()
    const list_order_item = location.state?.list_order_item
    const [discounts, setDiscounts] = useState('')

    useEffect(() => {
        request.get('api/items/user_discount/').then((response) => {
            setDiscounts(!response.data ? [] : response.data)
        });
    }, [])

    const objToListIds = (list_order_item) => {
        var ids_array = []
        Object.values(list_order_item).map((basket, index) => (
            ids_array.push(basket.item.id)
        ))
        return ids_array
    }

    const CreateUniqueCurrency = (list_order_item) => {
        let currencies = []
        Object.values(list_order_item).map((obj, index) => (
            currencies.push(obj.item.currency)
        ))
        return Array.from(new Set(currencies))

    }

    const SelectCurrencyHandler = (event) => {
        setcurrentCurrency(event.target.value);
    }

    return (
        <div className="d-flex justify-content-center container mt-5">
            <div className="card p-3 bg-white width: 444px"><i className="fa fa-apple"></i>
                {Object.values(list_order_item).map((basket, index) => (
                    <div>
                        <div className="d-flex justify-content-center">
                            <h3 className="mx-2">{basket.item.name}:</h3><h3>{basket.item.price}</h3><h3>{basket.item.currency}</h3>
                        </div>
                    </div>
                ))}
                <span className="mt-3">Choose prefer currency for payment</span>
                <select className="form-select mt-1" defaultValue='EUR' aria-label="Choose currency" onChange={SelectCurrencyHandler}>
                    {CreateUniqueCurrency(list_order_item).map((currency, index) => (
                        <option value={currency}>{currency}</option>
                    ))}
                </select>
                <div className="d-flex justify-content-left">
                    <span className="mt-2">Your discount: </span>
                </div>
                {Object.values(discounts).map((discount, index) => (
                    <div className="d-flex justify-content-left">
                        <span>{`${discount.title} ${discount.percent}%`}</span>
                    </div>
                ))}
                <div className="d-flex justify-content-center mt-2">
                    <Link to="/create_payment"
                        state={{
                            item_id: objToListIds(list_order_item),
                            pay_currency: currentCurrency,
                            multiply_flag: true,
                            discounts: discounts
                        }}>
                        <button className="btn btn-success btn-lg mt-2 mx-4">Create order</button>
                    </Link>
                </div>
            </div>
        </div>



    )
};
