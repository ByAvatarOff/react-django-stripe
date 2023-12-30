import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import item_image from "./p12.png"
import { request } from "../requests/axiosRequest";
import './ListItemsComponent.css'


export default function BasketListComponent() {

    const [commonState, SetcommonState] = useState({
        basket_list: [],
        showCreateOrderButton: true,
    });

    useEffect(() => {
        request.get('api/items/basket_list/').then((response) => {
            SetcommonState({
                ...commonState,
                basket_list: !response.data ? [] : response.data,
                showCreateOrderButton: !response.data.length ? 0 : true,
            })
        });
    }, [])

    const DeleteItemFromBasket = (item_id, e) => {
        request.delete(`api/items/delete_from_basket/${item_id}/`).then((response) => {
            SetcommonState({
                ...commonState,
                basket_list: !response.data ? [] : response.data,
                showCreateOrderButton: !response.data.length ? 0 : true
            })
        }).catch(error => alert(error))

    }

    return (
        <div>
            {commonState.showCreateOrderButton ? <Link to="/create_order" state={{ list_order_item: commonState.basket_list }}>
                <button className="btn btn-secondary btn-lg mt-2 mx-4">Create order</button>
            </Link> : <div></div>}

            <div className="container mt-5">
                <div className="row">
                    {Object.values(commonState.basket_list).map((basket, index) => (
                        <div className="col-md-4 col-sm-6">
                            <div className="card mb-30"><a className="card-img-tiles" href="#" data-abc="true">
                                <div className="inner">
                                    <div className="main-img"><img src={item_image} alt="" /></div>
                                </div>
                            </a>
                                <div className="card-body text-center">
                                    <h4 className="card-title">{basket.item.name}</h4>
                                    <p className="text-muted">{basket.item.price}</p>
                                    <Link to={`/item/${basket.item.id}`}><button className="btn btn-outline-primary btn-sm mt10"
                                        data-abc="true">More Info</button></Link>
                                    <button className="btn btn-outline-primary btn-sm mt10 mx-2" onClick={(e) => DeleteItemFromBasket(basket.item.id, e)}
                                        data-abc="true">Delete from basket</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}