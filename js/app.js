$(document).ready(function() {
    $('body').bootstrapMaterialDesign();
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

