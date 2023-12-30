import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { request } from "../requests/axiosRequest";
import item_image from "./p12.png"



export default function ItemComponent() {

    const [data, setData] = useState({})
    const { item_id } = useParams()

    useEffect(() => {
        request.get(`api/items/item/${item_id}/`).then((response) => {
            setData(!response.data ? [] : response.data)
        }).catch(error => alert(error));


    }, [])


    const addToBasketHandler = (item_id, e) => {
        request.post('api/items/basket_add/', { item_id: item_id })
            .then(response => {
                alert('Added to basket')
            }).catch(error => {
                alert('Item was already place in the basket')
            }
            )
    };

    return (
        <div className="d-flex justify-content-center container mt-5">
            <div className="card p-3 bg-white width: 444px"><i className="fa fa-apple"></i>
                <div className="about-product text-center mt-2"><img src={item_image} width="300" />
                    <div>
                        <h6 className="mt-0 text-black-50">{data.name}</h6>
                    </div>
                </div>
                <div className="stats mt-2">
                    <div className="d-flex justify-content-center"><span>{data.description}</span>
                    </div>
                    <div className="d-flex justify-content-between total font-weight-bold mt-4">
                        <span>Total</span><span>{data.price}</span><span>{data.currency}</span></div>
                    <Link to="/create_payment" state={{ item_id: item_id, multiply_flag: false }}><button className="btn btn-success btn-sm mt-2">Buy item</button></Link>

                    <button className="btn btn-success btn-sm mt-2 mx-2" onClick={(e) => addToBasketHandler(data.id, e)}
                        data-abc="true">Add to basket</button>
                </div>
            </div>
        </div>



    )
};
