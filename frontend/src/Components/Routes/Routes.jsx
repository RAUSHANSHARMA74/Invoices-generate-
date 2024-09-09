import React, { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../Pages/Home/Home';
import About from '../Pages/About/About';
import Invoice from '../Pages/Invoice/Invoice';
import Nopage from '../Pages/Nopage/Nopage';
import Navbar from '../Pages/Navbar/Navbar';

export default function Routers() {
    const [formData, setFormData] = useState({
        sellerName: '',
        sellerAddress: '',
        sellerCity: '',
        sellerState: '',
        sellerPincode: '',
        sellerPan: '',
        sellerGst: '',
        placeOfSupply: '',
        billingName: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingPincode: '',
        billingCode: '',
        shippingName: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingPincode: '',
        shippingCode: '',
        placeOfDelivery: '',
        orderNo: '',
        orderDate: '',
        invoiceNo: '',
        invoiceDetails: '',
        invoiceDate: '',
        reverseCharge: '',
        signature: "",
        items: [
            {
                description: '',
                unitPrice: '',
                quantity: '',
                discount: '',
                netAmount: 0,
                taxAmount: 0,
                totalAmount: 0,
                shippingUnitPrice: '',
                shippingNetAmount: 0,
                shippingTaxAmount: 0,
                shippingTotalAmount: 0,
                gstType: [],
                shippingSGSTRate: 0,
                shippingCGSTRate: 0,
                productSGSTRate: 0,
                productCGSTRate: 0,
            }
        ]
    });

    return (
        <div className="routes">
            <Navbar />
            <Routes>
                <Route path='/' element={<Home formData={formData} setFormData={setFormData} />} />
                <Route path="/about" element={<About />} />
                <Route path="/invoice" element={<Invoice formData={formData} setFormData={setFormData} />} />
                <Route path="*" element={<Nopage />} />
            </Routes>
        </div>
    )
}
