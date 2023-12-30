
import { Routes, Route } from 'react-router-dom';

import Layout from "./AuthComponent/components/Layout";

import LoginComponent from "./AuthComponent/components/LoginComponent";
import RequireAuth from "./AuthComponent/components/RequireAuth";

import ListItemsComponent from "./ItemsComponent/ListItemsComponent";
import ItemComponent from "./ItemsComponent/ItemComponent";
import OrdersListComponent from "./ItemsComponent/OrdersListComponent";
import BasketListComponent from "./ItemsComponent/BasketListComponent";
import ConfirmOrderComponent from "./ItemsComponent/ConfirmOrderComponent";

import CollectPaymentInfoComponent from "./PaymentComponents/CollectPaymentInfoComponent";
import SuccessPageComponent from "./PaymentComponents/SuccessPageComponent";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginComponent />} />
        <Route index element={<ListItemsComponent />} />
        <Route element={<RequireAuth />}>
          <Route path="item/:item_id" element={<ItemComponent />} />

          <Route path="orders" element={<OrdersListComponent />} />
          <Route path="basket" element={<BasketListComponent />} />
          <Route path="create_order" element={<ConfirmOrderComponent />} />

          <Route path="create_payment" element={<CollectPaymentInfoComponent />} />
          <Route path="success_payment" element={<SuccessPageComponent />} />
        </Route>

      </Route>
    </Routes>
  );

}