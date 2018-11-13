$(document).ready(function () {
    $('body').bootstrapMaterialDesign();
});

// side nav

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

// form create
(function () {
    var
        form = $('.forms'),
        cache_width = form.width(),
        a4 = [595.28, 841.89]; // for a4 size paper width and height  

    $('#create_pdf').on('click', function () {
        $('body').scrollTop(0);
        createPDF();
    });
    //create pdf  
    function createPDF() {
        getCanvas().then(function (canvas) {
            var
                img = canvas.toDataURL("image/png"),
                doc = new jsPDF({
                    unit: 'px',
                    format: 'a4'
                });
            doc.addImage(img, 'JPEG', 20, 20);
            doc.save('waqaskhans.pdf');
            form.width(cache_width);
        });
    }

    // create canvas object  
    function getCanvas() {
        form.width((a4[0] * 1.7) - 80).css('max-width', 'none');
        return html2canvas(form, {
            imageTimeout: 2000,
            removeContainer: true
        });
    }

}());

// form create end

/* 
* jQuery helper plugin for examples and tests 
*/
(function ($) {
    $.fn.html2canvas = function (options) {
        var date = new Date(),
            $message = null,
            timeoutTimer = false,
            timer = date.getTime();
        html2canvas.logging = options && options.logging;
        html2canvas.Preload(this[0], $.extend({
            complete: function (images) {
                var queue = html2canvas.Parse(this[0], images, options),
                    $canvas = $(html2canvas.Renderer(queue, options)),
                    finishTime = new Date();

                $canvas.css({ position: 'absolute', left: 0, top: 0 }).appendTo(document.body);
                $canvas.siblings().toggle();

                $(window).click(function () {
                    if (!$canvas.is(':visible')) {
                        $canvas.toggle().siblings().toggle();
                        throwMessage("Canvas Render visible");
                    } else {
                        $canvas.siblings().toggle();
                        $canvas.toggle();
                        throwMessage("Canvas Render hidden");
                    }
                });
                throwMessage('Screenshot created in ' + ((finishTime.getTime() - timer) / 1000) + " seconds<br />", 4000);
            }
        }, options));

        function throwMessage(msg, duration) {
            window.clearTimeout(timeoutTimer);
            timeoutTimer = window.setTimeout(function () {
                $message.fadeOut(function () {
                    $message.remove();
                });
            }, duration || 2000);
            if ($message)
                $message.remove();
            $message = $('<div ></div>').html(msg).css({
                margin: 0,
                padding: 10,
                background: "#000",
                opacity: 0.7,
                position: "fixed",
                top: 10,
                right: 10,
                fontFamily: 'Tahoma',
                color: '#fff',
                fontSize: 12,
                borderRadius: 12,
                width: 'auto',
                height: 'auto',
                textAlign: 'center',
                textDecoration: 'none'
            }).hide().fadeIn().appendTo('body');
        }
    };
})(jQuery);

// form data generate

function show(param_div_id) {
    //  var proarray = [];
    var l = document.getElementById('pro1category').value;
    var m = document.getElementById('pro1description').value;
    var n = document.getElementById('pro1quantityavailable').value;
    var o = document.getElementById('pro1quantityorder').value;
    var p = document.getElementById('pro1unitprice').value;


    var secl = document.getElementById('pro2category').value;
    var secm = document.getElementById('pro2description').value;
    var secn = document.getElementById('pro2quantityavailable').value;
    var seco = document.getElementById('pro2quantityorder').value;
    var secp = document.getElementById('pro2unitprice').value;

    var secqtyord = parseInt(seco);
    var secunitprice = parseInt(secp);
    var sectotprice = secqtyord * secunitprice;
    var qtyord = parseInt(o);
    var unitprice = parseInt(p);
    var totprice = qtyord * unitprice;

    //  proarray.push(l);
    //  proarray.push(m);
    //  proarray.push(n);
    //  proarray.push(o);

    var a = document.getElementById('name').value;
    var b = document.getElementById('orderdate').value;
    var c = document.getElementById('deliverydate').value;
    // alert(param_div_id);
    var d = document.getElementById('customerphone').value;
    var e = document.getElementById('personalphone').value;
    var f = document.getElementById('addressofdelivery').value;
    var g = document.getElementById('nameofdev').value;
    //  var newarray = proarray.join('<br>');
    var grandtotal = (totprice * 2) + sectotprice;
    $("#waqas").append(a);
    $("#recdate").append(b);
    $("#deldate").append(c);
    //  $("#idk").append(c);
    $("#personalphones").append(e);
    $("#addressofdeliverys").append(f);
    $("#clientname").append(g);
    $("#status").append("Sales Order");
    $("#customerphones").append(d);
    //  $("#idk").append(newarray);

    $(".category").append(l);
    $(".description").append(m);
    $(".qtyavailable").append(n);
    $(".qtyorder").append(qtyord);
    // $("#customerphones").append(qtyord);
    $(".unitprice").append(unitprice);
    $(".totalprice").append(totprice);
    $("#na").append(secl);
    $("#ma").append(secm);
    $("#oa").append(secn);
    $("#pa").append(secqtyord);
    $("#qa").append(secunitprice);
    $("#ra").append(sectotprice);
    $("#grandtotal").append(grandtotal);
    document.getElementById('main_place').innerHTML = document.getElementById(param_div_id).innerHTML;

}


//     function showc() {
// var k = document.getElementById('n').innerHTML;

//  var b = document.getElementById('orderdate').value;
//  var c = document.getElementById('deliverydate').value;
//        alert(param_div_id);


//   alert(k);
//     $("#recdate").append(`<div>`+b+`</div>`);
//     $("#deldate").append(`<div>`+c+`</div>`);
//     $("#idk").append(c);


//     }

// form data generate end


// Packing slip data input

function generatePackingData(applyPackingData) {

    var packDate = document.getElementById("pack-date").value;
    // Bill to input value
    var packBillName = document.getElementById("bill-name").value;
    var packBillCompany = document.getElementById("bill-company").value;
    var packBillAddress = document.getElementById("bill-address").value;
    var packBillCity = document.getElementById("bill-city").value;
    var packBillPhone = document.getElementById("bill-phone").value;


    // ship to input value
    var packShipName = document.getElementById("ship-name").value;
    var packShipCompany = document.getElementById("ship-company").value;
    var packShipAddress = document.getElementById("ship-address").value;
    var packShipCity = document.getElementById("ship-city").value;
    var packShipPhone = document.getElementById("ship-phone").value;

    // append bill values

    $("#pack-date-g").append(packDate);
    $("#bill-name-g").append(packBillName);
    $("#bill-company-g").append(packBillCompany);
    $("#bill-address-g").append(packBillAddress);
    $("#bill-city-g").append(packBillCity);
    $("#bill-phone-g").append(packBillPhone);

    // append ship values

    $("#ship-name-g").append(packShipName);
    $("#ship-company-g").append(packShipCompany);
    $("#ship-address-g").append(packShipAddress);
    $("#ship-city-g").append(packShipCity);
    $("#ship-phone-g").append(packShipPhone);

    // packing order info data

    var packOrderDate = document.getElementById("pack-odr-date").value;
    var packOrderNum = document.getElementById("pack-odr-num").value;
    var packPurchaseNum = document.getElementById("purchase-odr-num").value;
    var packCustomerNum = document.getElementById("pack-cust-num").value;

    $("pack-odr-date-g").append(packOrderDate);
    $("pack-odr-num-g").append(packOrderNum);
    $("purchase-odr-num").append(packPurchaseNum);
    $("pack-cust-num").append(packCustomerNum);


    // packing order info data end

    // packing slip items

    // item 1
    var packItemOne = document.getElementById("pack-item-1").value;
    var packDescriptOne = document.getElementById("pack-descript-1").value;
    var packOrderOne = document.getElementById("pack-odr-1").value;
    var packShipOne = document.getElementById("pack-ship-1").value;

    $("#pack-item-1-g").append(packItemOne);
    $("#pack-descript-1-g").append(packDescriptOne);
    $("#pack-odr-1-g").append(packOrderOne);
    $("#pack-ship-1-g").append(packShipOne);

    // item 2

    var packItemTwo = document.getElementById("pack-item-2").value;
    var packDescriptTwo = document.getElementById("pack-descript-2").value;
    var packOrderTwo = document.getElementById("pack-odr-2").value;
    var packShipTwo = document.getElementById("pack-ship-2").value;

    $("#pack-item-2-g").append(packItemTwo);
    $("#pack-descript-2-g").append(packDescriptTwo);
    $("#pack-odr-2-g").append(packOrderTwo);
    $("#pack-ship-2-g").append(packShipTwo);
    // item 3
    var packItemThree = document.getElementById("pack-item-3").value;
    var packDescriptThree = document.getElementById("pack-descript-3").value;
    var packOrderThree = document.getElementById("pack-odr-3").value;
    var packShipThree = document.getElementById("pack-ship-3").value;

    $("#pack-item-3-g").append(packItemThree);
    $("#pack-descript-3-g").append(packDescriptThree);
    $("#pack-odr-3-g").append(packOrderThree);
    $("#pack-ship-3-g").append(packShipThree);
    // item 4
    var packItemFour = document.getElementById("pack-item-4").value;
    var packDescriptFour = document.getElementById("pack-descript-4").value;
    var packOrderFour = document.getElementById("pack-odr-4").value;
    var packShipFour = document.getElementById("pack-ship-4").value;

    $("#pack-item-4-g").append(packItemFour);
    $("#pack-descript-4-g").append(packDescriptFour);
    $("#pack-odr-4-g").append(packOrderFour);
    $("#pack-ship-4-g").append(packShipFour);
    // packing slip items end

    document.getElementById('packing-main').innerHTML = document.getElementById(applyPackingData).innerHTML;
}

// Packing slip data input end

// Invoice slip data

function generateInvoiceData(applyInvoiceData) {

    var invoiceDate = document.getElementById("invoice-date").value;
    var invoiceNum = document.getElementById("invoice-num").value;
    var invoiceCustId = document.getElementById("cust-id").value;

    $("#invoice-date-g").append(invoiceDate);
    $("#invoice-num-g").append(invoiceNum);
    $("#cust-id-g").append(invoiceCustId);

    // Bill to input value
    var invoiceBillName = document.getElementById("invoice-bill-name").value;
    var invoiceBillCompany = document.getElementById("invoice-bill-company").value;
    var invoiceBillAddress = document.getElementById("invoice-bill-address").value;
    var invoiceBillCity = document.getElementById("invoice-bill-city").value;
    var invoiceBillPhone = document.getElementById("invoice-bill-phone").value;


    // ship to input value
    var invoiceShipName = document.getElementById("invoice-ship-name").value;
    var invoiceShipCompany = document.getElementById("invoice-ship-company").value;
    var invoiceShipAddress = document.getElementById("invoice-ship-address").value;
    var invoiceShipCity = document.getElementById("invoice-ship-city").value;
    var invoiceShipPhone = document.getElementById("invoice-ship-phone").value;

    // append bill values

    $("#invoice-bill-name-g").append(invoiceBillName);
    $("#invoice-bill-company-g").append(invoiceBillCompany);
    $("#invoice-bill-address-g").append(invoiceBillAddress);
    $("#invoice-bill-city-g").append(invoiceBillCity);
    $("#invoice-bill-phone-g").append(invoiceBillPhone);

    // append ship values

    $("#invoice-ship-name-g").append(invoiceShipName);
    $("#invoice-ship-company-g").append(invoiceShipCompany);
    $("#invoice-ship-address-g").append(invoiceShipAddress);
    $("#invoice-ship-city-g").append(invoiceShipCity);
    $("#invoice-ship-phone-g").append(invoiceShipPhone);


    // invoice ship data

    var invoiceSalesPerson = document.getElementById("invoice-sp").value;
    var invoiceProductOrder = document.getElementById("invoice-po").value;
    var invoiceShipDate = document.getElementById("invoice-ship-date").value;
    var invoiceShipVia = document.getElementById("invoice-ship-via").value;
    var InvoiceTerms = document.getElementById("invoice-terms").value;

    $("#invoice-sp-g").append(invoiceSalesPerson);
    $("#invoice-op-g").append(invoiceProductOrder);
    $("#invoice-ship-date-g").append(invoiceShipDate);
    $("#invoice-ship-via-g").append(invoiceShipVia);
    $("#invoice-terms-g").append(InvoiceTerms);

    // invoice ship data end

    // invoice item list

    // item 1
    var invoiceItemOne = document.getElementById("invoice-item-id-1").value;
    var invoiceItemDesciptOne = document.getElementById("invoice-item-description-1").value;
    var invoiceItemQtyOne = document.getElementById("invoice-qty-1").value;
    var invoiceItemUpriceOne = document.getElementById("invoice-unit-price-1").value;
    var invoiceItemTaxOne = document.getElementById("invoice-tax-1").value;

    $("#invoice-item-id-1-g").append(invoiceItemOne);
    $("#invoice-item-description-1-g").append(invoiceItemDesciptOne);
    $("#invoice-qty-1-g").append(invoiceItemQtyOne);

    $("#invoice-unit-price-1-g").append(invoiceItemUpriceOne);
    $("#invoice-tax-1-g").append(invoiceItemTaxOne);
    var invoiceTotalPriceOne = invoiceItemUpriceOne + invoiceItemTaxOne;
    $("#invoice-total-1-g").append(invoiceTotalPriceOne);

    // item 2
    var invoiceItemTwo = document.getElementById("invoice-item-id-2").value;
    var invoiceItemDesciptTwo = document.getElementById("invoice-item-description-2").value;
    var invoiceItemQtyTwo = document.getElementById("invoice-qty-2").value;
    var invoiceItemUpriceTwo = document.getElementById("invoice-unit-price-2").value;
    var invoiceItemTaxTwo = document.getElementById("invoice-tax-2").value;

    $("#invoice-item-id-2-g").append(invoiceItemTwo);
    $("#invoice-item-description-2-g").append(invoiceItemDesciptTwo);
    $("#invoice-qty-2-g").append(invoiceItemQtyTwo);
    $("#invoice-unit-price-2-g").append(invoiceItemUpriceTwo);
    $("#invoice-tax-2-g").append(invoiceItemTaxTwo);
    var invoiceTotalPriceTwo = invoiceItemUpriceTwo + invoiceItemTaxTwo;
    $("#invoice-total-2-g").append(invoiceTotalPriceTwo);

    // item 3
    var invoiceItemThree = document.getElementById("invoice-item-id-3").value;
    var invoiceItemDesciptThree = document.getElementById("invoice-item-description-3").value;
    var invoiceItemQtyThree = document.getElementById("invoice-qty-3").value;
    var invoiceItemUpriceThree = document.getElementById("invoice-unit-price-3").value;
    var invoiceItemTaxThree = document.getElementById("invoice-tax-3").value;

    $("#invoice-item-id-3-g").append(invoiceItemThree);
    $("#invoice-item-description-3-g").append(invoiceItemDesciptThree);
    $("#invoice-qty-3-g").append(invoiceItemQtyThree);
    $("#invoice-unit-price-3-g").append(invoiceItemUpriceThree);
    $("#invoice-tax-3-g").append(invoiceItemTaxThree);
    var invoiceTotalPriceThree = invoiceItemUpriceThree + invoiceItemTaxThree;
    $("#invoice-total-3-g").append(invoiceTotalPriceThree);

    // item 4
    var invoiceItemFour = document.getElementById("invoice-item-id-4").value;
    var invoiceItemDesciptFour = document.getElementById("invoice-item-description-4").value;
    var invoiceItemQtyFour = document.getElementById("invoice-qty-4").value;
    var invoiceItemUpriceFour = document.getElementById("invoice-unit-price-4").value;
    var invoiceItemTaxFour = document.getElementById("invoice-tax-4").value;
    $("#invoice-item-id-3-4").append(invoiceItemFour);
    $("#invoice-item-description-3-4").append(invoiceItemDesciptFour);
    $("#invoice-qty-4-g").append(invoiceItemQtyFour);
    $("#invoice-unit-price-4-g").append(invoiceItemUpriceFour);
    $("#invoice-tax-4-g").append(invoiceItemTaxFour);
    var invoiceTotalPriceFour = invoiceItemUpriceFour + invoiceItemTaxFour;
    $("#invoice-total-4-g").append(invoiceTotalPriceFour);

    // invoice item list end

    var invoiceTotalAmount = invoiceTotalPriceOne + invoiceTotalPriceTwo + invoiceTotalPriceThree + invoiceTotalPriceFour;
    $("#invoice-total").append(invoiceTotalAmount);
    document.getElementById('invoice-main').innerHTML = document.getElementById(applyInvoiceData).innerHTML;
    // Invoice slip data end
    // has bug in totalling need to convert string into integer in items
}
// invoice item list end

// Invoice slip data end

// sales pay receipt

function generatePayReceiptData(applyReceiptData) {


    // pay method section
    var payMethod = document.getElementById("pay-method").value;
    var payNum = document.getElementById("pay-no").value;
    var payRemarks = document.getElementById("pay-remarks").value;

    $("#pay-method-g").append(payMethod);
    $("#pay-no-g").append(payNum);
    $("#pay-remarks-g").append(payRemarks);

    // pay receipt items section
    // 1
    var parDesc1 = document.getElementById("pay-desc1").value;
    var payQty1 = document.getElementById("pay-qty1").value;
    var payAmount1 = document.getElementById("pay-amount1").value;

    $("#pay-desc1-g").append(parDesc1);
    $("#pay-qty1-g").append(payQty1);
    $("#pay-amount1-g").append(payAmount1);

    // 2
    var parDesc2 = document.getElementById("pay-desc2").value;
    var payQty2 = document.getElementById("pay-qty2").value;
    var payAmount2 = document.getElementById("pay-amount2").value;

    $("#pay-desc2-g").append(parDesc2);
    $("#pay-qty2-g").append(payQty2);
    $("#pay-amount2-g").append(payAmount2);

    // 3
    var parDesc3 = document.getElementById("pay-desc3").value;
    var payQty3 = document.getElementById("pay-qty3").value;
    var payAmount3 = document.getElementById("pay-amount3").value;

    $("#pay-desc3-g").append(parDesc3);
    $("#pay-qty3-g").append(payQty3);
    $("#pay-amount3-g").append(payAmount3);

    // 4
    var parDesc4 = document.getElementById("pay-desc4").value;
    var payQty4 = document.getElementById("pay-qty4").value;
    var payAmount4 = document.getElementById("pay-amount4").value;

    $("#pay-desc4-g").append(parDesc4);
    $("#pay-qty4-g").append(payQty4);
    $("#pay-amount4-g").append(payAmount4);

    // 5
    var parDesc5 = document.getElementById("pay-desc5").value;
    var payQty5 = document.getElementById("pay-qty5").value;
    var payAmount5 = document.getElementById("pay-amount5").value;

    $("#pay-desc5-g").append(parDesc5);
    $("#pay-qty5-g").append(payQty5);
    $("#pay-amount5-g").append(payAmount5);



    var arr = document.getElementsByName('pay-amount');
    var tot = 0;
    for (var i = 0; i < arr.length; i++)
        if (parseInt(arr[i].value))
            tot += parseInt(arr[i].value);

    document.getElementById('total').innerHTML = tot;



    document.getElementById("pay-container").innerHTML = document.getElementById(applyReceiptData).innerHTML;
}


// sales pay receipt end

// sales delivery note

function generateDeliveryNote(applyDeliveryNoteData) {

    // basic info
    var delivDate = document.getElementById("dlvry-odr-date").value;
    var delivOdrNum = document.getElementById("dlvry-odr-no").value;
    var delivNoteNum = document.getElementById("dlvry-note-no").value;
    var delivCustId = document.getElementById("dlvry-cust-id").value;
    var delivDispatchDate = document.getElementById("dlvry-dispch-date").value;
    var delivMethod = document.getElementById("dlvry-method").value;

    $("#dlvry-odr-date-g").append(delivDate);
    $("#dlvry-odr-no-g").append(delivOdrNum);
    $("#dlvry-note-no-g").append(delivNoteNum);
    $("#dlvry-cust-id-g").append(delivCustId);
    $("#dlvry-dispch-date-g").append(delivDispatchDate);
    $("#dlvry-method-g").append(delivMethod);

    // bill to
    var delivBillName = document.getElementById("dlvry-bill-name").value;
    var delivBillComp = document.getElementById("dlvry-bill-company").value;
    var delivBillAddress = document.getElementById("dlvry-bill-address").value;
    var delivBillCity = document.getElementById("dlvry-bill-city").value;
    var delivBillPh = document.getElementById("dlvry-bill-phone").value;

    $("#dlvry-bill-name-g").append(delivBillName);
    $("#dlvry-bill-company-g").append(delivBillComp);
    $("#dlvry-bill-address-g").append(delivBillAddress);
    $("#dlvry-bill-city-g").append(delivBillCity);
    $("#dlvry-bill-phone-g").append(delivBillPh);

    // ship to
    var delivShipName = document.getElementById("dlvry-ship-name").value;
    var delivShipComp = document.getElementById("dlvry-ship-company").value;
    var delivShipAddress = document.getElementById("dlvry-ship-address").value;
    var delivShipCity = document.getElementById("dlvry-ship-city").value;
    var delivShipPh = document.getElementById("dlvry-ship-phone").value;

    $("#dlvry-ship-name-g").append(delivShipName);
    $("#dlvry-ship-company-g").append(delivShipComp);
    $("#dlvry-ship-address-g").append(delivShipAddress);
    $("#dlvry-ship-city-g").append(delivShipCity);
    $("#dlvry-ship-phone-g").append(delivShipPh);


    // delivery items list
    // 1

    var dlvryDesc1 = document.getElementById("dlvry-descipt-1").value;
    var dlvryodr1 = document.getElementById("dlvry-odr-1").value;
    var dlvryDelivered1 = document.getElementById("dlvry-delivered-1").value;;
    var dlvryStatus1 = document.getElementById("dlvry-outstand-1").value;

    $("#dlvry-descipt-1-g").append(dlvryDesc1);
    $("#dlvry-odr-1-g").append(dlvryodr1);
    $("#dlvry-delivered-1-g").append(dlvryDelivered1);
    $("#dlvry-outstand-1-g").append(dlvryStatus1);

    // 2

    var dlvryDesc2 = document.getElementById("dlvry-descipt-2").value;
    var dlvryodr2 = document.getElementById("dlvry-odr-2").value;
    var dlvryDelivered2 = document.getElementById("dlvry-delivered-2").value;;
    var dlvryStatus2 = document.getElementById("dlvry-outstand-2").value;

    $("#dlvry-descipt-2-g").append(dlvryDesc2);
    $("#dlvry-odr-2-g").append(dlvryodr2);
    $("#dlvry-delivered-2-g").append(dlvryDelivered2);
    $("#dlvry-outstand-2-g").append(dlvryStatus2);

    // 3
    var dlvryDesc3 = document.getElementById("dlvry-descipt-3").value;
    var dlvryodr3 = document.getElementById("dlvry-odr-3").value;
    var dlvryDelivered3 = document.getElementById("dlvry-delivered-3").value;;
    var dlvryStatus3 = document.getElementById("dlvry-outstand-3").value;

    $("#dlvry-descipt-3-g").append(dlvryDesc3);
    $("#dlvry-odr-3-g").append(dlvryodr3);
    $("#dlvry-delivered-3-g").append(dlvryDelivered3);
    $("#dlvry-outstand-3-g").append(dlvryStatus3);

    // 4

    var dlvryDesc4 = document.getElementById("dlvry-descipt-4").value;
    var dlvryodr4 = document.getElementById("dlvry-odr-4").value;
    var dlvryDelivered4 = document.getElementById("dlvry-delivered-4").value;;
    var dlvryStatus4 = document.getElementById("dlvry-outstand-4").value;

    $("#dlvry-descipt-4-g").append(dlvryDesc4);
    $("#dlvry-odr-4-g").append(dlvryodr4);
    $("#dlvry-delivered-4-g").append(dlvryDelivered4);
    $("#dlvry-outstand-4-g").append(dlvryStatus4);

    // 5

    var dlvryDesc5 = document.getElementById("dlvry-descipt-5").value;
    var dlvryodr5 = document.getElementById("dlvry-odr-5").value;
    var dlvryDelivered5 = document.getElementById("dlvry-delivered-5").value;;
    var dlvryStatus5 = document.getElementById("dlvry-outstand-5").value;

    $("#dlvry-descipt-5-g").append(dlvryDesc5);
    $("#dlvry-odr-5-g").append(dlvryodr5);
    $("#dlvry-delivered-5-g").append(dlvryDelivered5);
    $("#dlvry-outstand-5-g").append(dlvryStatus5);
    ""
    document.getElementById("delivery-note-container").innerHTML = document.getElementById(applyDeliveryNoteData).innerHTML
}

// purchase order

function generatePurchaseData(applyPurchaseData){
// basic
var purDate = document.getElementById("pur-date").value;
var purPO = document.getElementById("pur-po").value;

$("#pur-date-g").append(purDate);
$("#pur-po-g").append(purPO);

// vender info
var purVenName = document.getElementById("pur-name").value;
var purVenCompName = document.getElementById("pur-company-name").value;
var purVenAddress = document.getElementById("pur-vender-address").value;
var purVenCity = document.getElementById("pur-vender-city").value;
var purVenPh = document.getElementById("pur-vender-phone").value;

$("#pur-name-g").append(purVenName);
$("#pur-company-name-g").append(purVenCompName);
$("#pur-vender-address-g").append(purVenAddress);
$("#pur-vender-city-g").append(purVenCity);
$("#pur-vender-phone-g").append(purVenPh);

// ship info
var purShipName = document.getElementById("pur-ship-name").value;
var purShipCompName = document.getElementById("pur-ship-company-name").value;
var purShipAddress = document.getElementById("pur-ship-address").value;
var purShipCity = document.getElementById("pur-ship-city").value;
var purShipPh = document.getElementById("pur-ship-phone").value;

$("#pur-ship-name-g").append(purShipName);
$("#pur-ship-company-name-g").append(purShipCompName);
$("#pur-ship-address-g").append(purShipAddress);
$("#pur-ship-city-g").append(purShipCity);
$("#pur-ship-phone-g").append(purShipPh);

//shipping info
var purRequsher = document.getElementById("pur-requs").value;
var purShipVia = document.getElementById("pur-ship-via").value;
var purFOB = document.getElementById("pur-fob").value;
var purShipTerm = document.getElementById("pur-ship-term").value;

$("#pur-requs-g").append(purRequsher);
$("#pur-ship-via-g").append(purShipVia);
$("#pur-fob-g").append(purFOB);
$("#pur-ship-term-g").append(purShipTerm);


document.getElementById("purchase-container").innerHTML = document.getElementById(applyPurchaseData).innerHTML
}
// purchase order end
