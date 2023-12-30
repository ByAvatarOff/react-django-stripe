import React from "react";
import './SuccessPayment.css'
import { Link } from 'react-router-dom';


export default function SuccessPageComponent() {

    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="message-box _success">
                        <h2> Your payment was successful </h2>
                        <p> Thank you for your payment. we will <br />
                            be in contact with more details shortly </p>
                        <Link to='/'><button className="btn btn-dark btn-lg mt-3">Home</button></Link>
                    </div>

                </div>
            </div>

        </div>
    )
};
