import React, { useRef } from 'react';
import "./Invoice.css";
import html2pdf from 'html2pdf.js';

export default function Invoice({ formData, setFormData }) {
    const invoiceRef = useRef(null);

    const handlePrint = () => {
        const element = invoiceRef.current;
        const opt = {
            margin: [0.1, 0.3],
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    const numberToWords = (num) => {
        const a = [
            '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
            'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
        ];
        const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        if (num === 0) return 'zero';

        const convert = (n) => {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
            if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
            return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
        };

        return convert(num);
    };


    const totalTaxAmount = formData.items.reduce((acc, item) => {
        const taxAmount = parseFloat(item.taxAmount) || 0;
        const shippingTaxAmount = parseFloat(item.shippingTaxAmount) || 0;
        const itemTotalTax = taxAmount + shippingTaxAmount;
        const hasSGST = item.gstType.includes('SGST');
        const hasCGST = item.gstType.includes('CGST');
        const finalItemTaxAmount = hasSGST && hasCGST ? itemTotalTax * 2 : itemTotalTax;

        return acc + finalItemTaxAmount;
    }, 0);



    const totalAmount = formData.items.reduce((acc, item) => {
        const itemTotalAmount = parseFloat(item.totalAmount) || 0;
        const shippingTotalAmount = parseFloat(item.shippingTotalAmount) || 0;
        return acc + itemTotalAmount + shippingTotalAmount;
    }, 0);

    const amountInWords = totalAmount > 0
        ? numberToWords(Math.floor(totalAmount)) + ' only'
        : 'Zero only';
    return (
        <div className='invoice_container'>
            <div className="invoice" ref={invoiceRef}>
                <div className="header_logo">
                    <img src="/amazon_logo.png" alt="Amazon Logo" />
                    <div className="tax_invoice_bill">
                        <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
                        <span>(Original for Recipient)</span>
                    </div>
                </div>
                <div className="sold_billing_address">
                    <div className="sold">
                        <span>Sold By:</span>
                        <span>{formData.sellerName}</span>
                        <span>{formData.sellerAddress} {formData.sellerCity}</span>
                        <span>{formData.sellerState} {formData.sellerPincode}</span>
                    </div>
                    <div className="billing_address">
                        <span>Billing Address:</span>
                        <span>{formData.billingName}</span>
                        <span>{formData.billingAddress} {formData.billingCity}</span>
                        <span>{formData.billingState} {formData.billingPincode}</span>
                    </div>
                </div>

                <div className="pan_state_no">
                    <div className="pan_number">
                        <span>PAN NO: <span className="pan_value">{formData.sellerPan}</span></span>
                        <span>GST Registration No: <span className="gst_value">{formData.sellerGst}</span></span>
                    </div>
                    <div className="state_ut">
                        <span>State/UT Code: <span className="state_code">{formData.billingCode}</span></span>
                    </div>
                </div>

                <div className="shipping_address">
                    <span>Shipping Address:</span>
                    <span>{formData.shippingName}</span>
                    <span>{formData.shippingAddress} {formData.shippingCity}</span>
                    <span>{formData.shippingState} {formData.shippingPincode}</span>
                </div>
                <div className="state_supply_delivery">
                    <span>State/UT Code: <span className="state_code">{formData.shippingPincode}</span></span>
                    <span>Place of supply: <span className="place_supply">{formData.placeOfSupply}</span></span>
                    <span>Place of delivery: <span className="place_delivery">{formData.placeOfDelivery}</span></span>
                </div>

                <div className="order_invoice_number">
                    <div className="order">
                        <span>Order Number: <span className="order_number">{formData.orderNo}</span></span>
                        <span>Order Date: <span className="order_date">{formData.orderDate}</span></span>
                    </div>
                    <div className="invoice_number_details">
                        <span>Invoice Number: <span className="invoice_number">{formData.invoiceNo}</span></span>
                        <span>Invoice Details: <span className="invoice_details">{formData.invoiceDetails}</span></span>
                        <span>Invoice Date: <span className="invoice_date">{formData.invoiceDate}</span></span>
                    </div>
                </div>
                <div className="product_details_table_sign">
                    <table>
                        <thead>
                            <tr>
                                <th>SI No.</th>
                                <th>Description</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Net Amount</th>
                                <th>Tax Rate</th>
                                <th>Tax Type</th>
                                <th>Tax Amount</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((elm, index) => (
                                <React.Fragment key={index}>
                                    <tr className="common-row">
                                        <td rowSpan="4">{index + 1}</td> {/* Row span set to 4 to span the next 4 rows */}
                                        <td>{elm.description} </td>
                                        <td>{elm.unitPrice}</td>
                                        <td rowSpan="4">{elm.quantity}</td>
                                        <td>{elm.netAmount.toFixed(2)}</td>
                                        <td>{elm.productCGSTRate}</td>
                                        <td>{elm.gstType[0]}</td>
                                        <td>{elm.taxAmount.toFixed(2)}</td>
                                        <td>{elm.totalAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr className="common-row">
                                        <td colSpan="4"></td>
                                        <td>{elm.productSGSTRate}</td>
                                        <td>{elm.gstType[1]}</td>
                                        <td>{elm.taxAmount.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                    <tr className="common-row">
                                        <td>Shipping charge</td>
                                        <td>{elm.shippingUnitPrice}</td>
                                        <td>{elm.shippingNetAmount.toFixed(2)}</td>
                                        <td>{elm.shippingCGSTRate}</td>
                                        <td>{elm.gstType[0]}</td>
                                        <td>{elm.shippingTaxAmount.toFixed(2)}</td>
                                        <td>{elm.shippingTotalAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr className="common-row">
                                        <td colSpan="4"></td>
                                        <td>{elm.shippingSGSTRate}</td>
                                        <td>{elm.gstType[1]}</td>
                                        <td>{elm.shippingTaxAmount.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            <tr class="common-row">
                                <td colSpan="7" className='total'>TOTAL :</td>
                                <td>
                                    {totalTaxAmount.toFixed(2)}
                                </td>
                                <td>{totalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="amount_in_words">
                        <span>Amount in Words :</span>
                        <span>{amountInWords}</span>
                    </div>
                    <div className="exports_name_signature">
                        <p>For Varasiddhi silk Exports :</p>
                        <img src="/amazon_logo.png" alt="Amazon Logo" className='signature' />
                        <p>Authorized Signatory</p>
                    </div>
                </div>
                <p className='note'>Whether tax is payable under reverse charge -No</p>


            </div>
            <button onClick={handlePrint}>Print</button>
        </div>
    );
}
