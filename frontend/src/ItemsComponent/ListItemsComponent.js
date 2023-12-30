import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import item_image from "./p12.png"
import { request } from "../requests/axiosRequest";
import './ListItemsComponent.css'


export default function ListItemsComponent() {

    const [items, SetItems] = useState("");

    useEffect(() => {
        request.get('api/items/all_items/').then((response) => {
            SetItems(!response.data ? [] : response.data)
        })
    }, [])

    return (
        <div className="container mt-100">
            <div className="row">
                {Object.values(items).map((item, index) => (
                    <div className="col-md-4 col-sm-6">
                        <div className="card mb-30"><a className="card-img-tiles" data-abc="true">
                            <div className="inner">
                                <div className="main-img"><img src={item_image} alt="" /></div>
                            </div>
                        </a>
                            <div className="card-body text-center">
                                <h4 className="card-title">{item.name}</h4>
                                <p className="text-muted">{item.price}{item.currency}</p>
                                <Link to={`/item/${item.id}`}><button className="btn btn-outline-primary btn-sm mt10" href="#"
                                    data-abc="true">More Info</button></Link>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}