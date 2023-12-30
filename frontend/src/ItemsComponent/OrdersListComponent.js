import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { request } from "../requests/axiosRequest";
import './ListItemsComponent.css'


export default function OrdersListComponent() {

    const [ordersLlist, SetOrdersList] = useState("");
    useEffect(() => {
        request.get('api/items/orders_list/').then((response) => {
            SetOrdersList(!response.data ? [] : response.data)
        }).catch(errpr => alert(errpr));
    }, [])

    return (
        <div className="container mt-100">
            <div className="row">
                {Object.values(ordersLlist).map((order, index) => (
                    <div className="col-md-4 col-sm-6">
                        <div className="card">
                            <div className="text-center mt-3 mx-2">
                                {Object.values(order.item).map((item, index) => (
                                    <div>
                                        <Link to={`/item/${item.id}`}><h3>{item.name}: {item.price}{item.currency}</h3></Link>
                                    </div>
                                ))}
                            </div>
                            <div className="card-body text-center">
                                <h4 className="card-title">{order.item.name}</h4>
                                <p className="text-muted">{order.item.price}{order.item.currency}</p>
                                <div className="container text-light mb-3" style={{ background: "green", height: "30px", width: "150px" }}>
                                    <span className="">{order.type_order}</span><br />
                                </div>
                                <span className="">{new Date(order.date_create_order).toDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}