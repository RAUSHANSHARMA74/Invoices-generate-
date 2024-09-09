import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home({ formData, setFormData }) {


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const calculateItemAmounts = (item) => {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const discount = parseFloat(item.discount) || 0;
        const netAmount = unitPrice * quantity - discount;

        const shippingUnitPrice = parseFloat(item.shippingUnitPrice) || 0;
        const shippingNetAmount = shippingUnitPrice; // Assuming shipping cost is not quantity-based

        let gstType = [];
        let taxAmount = 0;
        let shippingTaxAmount = 0;

        let productSGSTRate = 0, productCGSTRate = 0;
        let shippingSGSTRate = 0, shippingCGSTRate = 0;

        // GST logic
        if (formData.placeOfSupply === formData.placeOfDelivery) {
            // Intra-state: Apply SGST and CGST (9% each)
            gstType = ['SGST', 'CGST'];

            // Product GST rates
            productSGSTRate = 0.09;
            productCGSTRate = 0.09;

            // Shipping GST rates
            shippingSGSTRate = 0.09;
            shippingCGSTRate = 0.09;

            // Tax amounts for product and shipping
            taxAmount = netAmount * (productSGSTRate + productCGSTRate);
            shippingTaxAmount = shippingNetAmount * (shippingSGSTRate + shippingCGSTRate);

        } else {
            // Inter-state: Apply IGST (18%)
            gstType = ['IGST'];

            // Product GST rates
            productSGSTRate = 0.18;
            productCGSTRate = 0; // No CGST in inter-state
            shippingSGSTRate = 0.18;
            shippingCGSTRate = 0; // No CGST in inter-state

            // Tax amounts for product and shipping
            taxAmount = netAmount * productSGSTRate;
            shippingTaxAmount = shippingNetAmount * shippingSGSTRate;
        }

        const totalAmount = netAmount + taxAmount;
        const shippingTotalAmount = shippingNetAmount + shippingTaxAmount;

        return {
            netAmount,
            taxAmount,
            totalAmount,
            shippingNetAmount,
            shippingTaxAmount,
            shippingTotalAmount,
            gstType,
            productSGSTRate,
            productCGSTRate,
            shippingSGSTRate,
            shippingCGSTRate
        };
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [name]: value };

        const {
            netAmount, taxAmount, totalAmount, gstType,
            productSGSTRate, productCGSTRate, shippingNetAmount,
            shippingTaxAmount, shippingTotalAmount, shippingSGSTRate, shippingCGSTRate
        } = calculateItemAmounts(updatedItems[index]);

        updatedItems[index] = {
            ...updatedItems[index],
            netAmount,
            taxAmount,
            totalAmount,
            gstType,
            productSGSTRate,
            productCGSTRate,
            shippingNetAmount,
            shippingTaxAmount,
            shippingTotalAmount,
            shippingSGSTRate,
            shippingCGSTRate
        };

        setFormData((prevData) => ({ ...prevData, items: updatedItems }));
    };

    const handleAddItem = () => {
        setFormData((prevData) => ({
            ...prevData,
            items: [...prevData.items, {
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
                productCGSTRate: 0
            }]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="home_page">
            <div className="form_page">
                <form onSubmit={handleSubmit}>
                    <h3>Seller Details</h3>
                    <div className="form_row">
                        <div>
                            <input type="text" name="sellerName" placeholder="Seller Name" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="sellerAddress" placeholder="Seller Address" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="sellerCity" placeholder="City" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="sellerState" placeholder="State" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="sellerPincode" placeholder="Pincode" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="sellerPan" placeholder="PAN No." onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="sellerGst" placeholder="GST Registration No." onChange={handleChange} />
                        </div>
                    </div>

                    <h3>Place of Supply</h3>
                    <div className="form_row">
                        <input type="text" name="placeOfSupply" placeholder="Place of Supply" onChange={handleChange} />
                    </div>

                    <h3>Billing Details</h3>
                    <div className="form_row">
                        <div>
                            <input type="text" name="billingName" placeholder="Billing Name" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="billingAddress" placeholder="Billing Address" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="billingCity" placeholder="City" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="billingState" placeholder="State" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="billingPincode" placeholder="Pincode" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="billingCode" placeholder="State/UT Code" onChange={handleChange} />
                        </div>
                    </div>

                    <h3>Shipping Details</h3>
                    <div className="form_row">
                        <div>
                            <input type="text" name="shippingName" placeholder="Shipping Name" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="shippingAddress" placeholder="Shipping Address" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="shippingCity" placeholder="City" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="shippingState" placeholder="State" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div>
                            <input type="text" name="shippingPincode" placeholder="Pincode" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="shippingCode" placeholder="State/UT Code" onChange={handleChange} />
                        </div>
                    </div>

                    <h3>Place of Delivery</h3>
                    <div className="form_row">
                        <input type="text" name="placeOfDelivery" placeholder="Place of Delivery" onChange={handleChange} />
                    </div>

                    <h3>Order Details</h3>
                    <div className="form_row">
                        <div>
                            <input type="text" name="orderNo" placeholder="Order No." onChange={handleChange} />
                        </div>
                        <div>
                            <input type="date" name="orderDate" placeholder="Order Date" onChange={handleChange} />
                        </div>
                    </div>

                    <h3>Invoice Details</h3>
                    <div className="form_row">
                        <div>
                            <input type="text" name="invoiceNo" placeholder="Invoice No." onChange={handleChange} />
                        </div>
                        <div>
                            <input type="text" name="invoiceDetails" placeholder="Invoice Details" onChange={handleChange} />
                        </div>
                        <div>
                            <input type="date" name="invoiceDate" placeholder="Invoice Date" onChange={handleChange} />
                        </div>
                    </div>

                    <h3>Reverse Charge</h3>
                    <div className="form_row">
                        <label>
                            <input type="radio" name="reverseCharge" value="true" onChange={handleChange} /> Yes
                        </label>
                        <label>
                            <input type="radio" name="reverseCharge" value="false" onChange={handleChange} /> No
                        </label>
                    </div>

                    <h3>Item Details</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className='items'>
                            <div>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="unitPrice"
                                    placeholder="Unit Price"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="discount"
                                    placeholder="Discount"
                                    value={item.discount}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="shippingUnitPrice"
                                    placeholder="Shipping Unit Price"
                                    className='shippingUnitPrice'
                                    value={item.shippingUnitPrice}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>

                            <div>
                                <label>Net Amount: {item.netAmount.toFixed(2)}</label>
                            </div>
                            <div>
                                <label>Tax Amount: {item.taxAmount.toFixed(2)}</label>
                            </div>
                            <div>
                                <label>Total Amount: {item.totalAmount.toFixed(2)}</label>
                            </div>

                            <div>
                                <label>Product SGST Rate: {item.productSGSTRate * 100}%</label>
                            </div>
                            <div>
                                <label>Product CGST Rate: {item.productCGSTRate * 100}%</label>
                            </div>
                            <div>
                                <label>Shipping SGST Rate: {item.shippingSGSTRate * 100}%</label>
                            </div>
                            <div>
                                <label>Shipping CGST Rate: {item.shippingCGSTRate * 100}%</label>
                            </div>
                        </div>
                    ))}

                    <button type="button" className='button' onClick={handleAddItem}>Add Item</button>
                    <Link to="/invoice" className='invoice_link'>
                        <button className='button'>Invoice</button>
                    </Link>
                </form>
            </div>
        </div>
    );
}
