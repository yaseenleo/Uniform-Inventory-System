var fs = require("fs");
var express = require("express");
var http = require("http");
var https = require("https");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var path = require("path");
var cookieParser = require('cookie-parser');
var Items = require('./models/items');
var Styles = require('./models/styles');
var Fabric = require('./models/fabric');
var Raw_Items = require('./models/raw_items');
var Vendors = require('./models/vendors');
var Info = require('./models/info');
var GR_Note = require('./models/gr_notes');
var Clients = require('./models/clients');
var Employees = require('./models/employees');
var User = require('./models/user');
var Lpos = require('./models/lpos');
var Pos = require('./models/po');
var Invoices = require('./models/invoices');
var Job_Slip = require('./models/job_slips');
var pdf = require('html-pdf');
var Excel = require('exceljs');
async function excelOp() {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/packing_list.xlsx")); // replace question_39869739.xls with your file
   
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
    worksheet.getRow(14).getCell(1).value = 'waqas'; // replace rowNumber and cellNumber with the row and cell you want to modify
    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/packing_list2.xlsx"));
}
//excelOp();
//  var   cookieSession = require('cookie-session');

// your express configuration here

var formidable = require("formidable");
var sessions = require("express-session");
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyAHDeQsOYYGJsxpteeRbGPZHAqgEOih9h8",
    authDomain: "quizapp1-a28b4.firebaseapp.com",
    databaseURL: "https://quizapp1-a28b4.firebaseio.com",
    projectId: "quizapp1-a28b4",
    storageBucket: "quizapp1-a28b4.appspot.com",
    messagingSenderId: "351903158212"
}
config2 = {
    apiKey: "AIzaSyA7rfBhIutZdEG0R7xANM3Wy27lV7GP2-Q",
    authDomain: "yaseen-site.firebaseapp.com",
    databaseURL: "https://yaseen-site.firebaseio.com",
    projectId: "yaseen-site",
    storageBucket: "yaseen-site.appspot.com",
    messagingSenderId: "1093689830600"
  };
  firebase.initializeApp(config);
  
//var url = "mongodb://rapshek:natsikap1@ds263590.mlab.com:63590/cinstagram";
mongoose.connect("mongodb://rapshek:natsikap1@ds127604.mlab.com:27604/sap",{ useNewUrlParser: true  }, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection with mongodb is successfull");

    }
});
var bodyParser = require("body-parser");
var app = express();
// app.use(cookieSession({
//     name: 'session',
//     keys: ['123'],
//     maxAge: 30 *24 * 60 * 60 * 1000
// }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
    secret: 'ddfd344f4dud8d8d8d8j',
    resave: false,
    saveUninitialized: true
}));



app.get("/", (req, res) => {
    if(req.cookies.user)
    {   let user = JSON.parse(req.cookies.user);
        console.log(user);
        res.sendFile(path.join(__dirname,"/public/landing.html"));

    }
    else{
        res.redirect("/login");
    }
});
app.get("/logout",(req,res)=>{
    res.clearCookie("user");
    res.redirect("/");
})
app.get("/login",(req,res)=>{
    if(req.cookies.user)
    {   let user = JSON.parse(req.cookies.user);
        console.log(user);
        res.redirect("/");

    }
    else{
        res.sendFile(path.join(__dirname,"/public/auth/login.html"));
    }

});
app.post("/login",(req,res,next)=>{
    let username = req.body.username.replace(" ","").replace("&","").replace("/","").toLowerCase();
    let password = req.body.password;
    User.findOne({username:username,password:password},(err,user)=>{
        if(user === null){
            res.redirect("/login");
        }
        else{
           // res.send(user);
           res.cookie("user",JSON.stringify(user),{maxAge:1000*60*60*24*1});
           res.redirect("/");

        }
    })
})
app.get("/signup",(req,res)=>{
    if(req.cookies.user)
    {   let user = JSON.parse(req.cookies.user);
        console.log(user);
        res.redirect("/");

    }
    else{
        res.sendFile(path.join(__dirname,"/public/auth/signup.html"));
    }


});
app.post("/signup",(req,res)=>{
    let name = req.body.name;
    let admin_user = req.body.admin_user;
    let admin_pass = req.body.admin_pass ;
    let username = req.body.username.replace(" ","").replace("&","").replace("/","").toLowerCase();
    let password = req.body.password;
    User.findOne({username:username},(err,user)=>{
        if(user===null){
            if(admin_user==="admin" && admin_pass === "1234")
            {
                new User({name:name,username:username,password:password}).save((err,user2)=>{
                    console.log(user2);
                    res.redirect("/login");
                })
            }
           
        }
        else{
            res.redirect("/signup");
        }
    })
    console.log(name);
    console.log(username);
    console.log(password);

})
app.post("/add_fabric",(req,res)=>{
    let obj = {};
     obj.name = req.body.name;
    obj.fabric_code = req.body.fabric_code;
    obj.detail = req.body.detail ;
    obj.width = req.body.width;
    obj.color = req.body.color;
    
    new Fabric(obj).save((err,fabric)=>{
        if(err){throw err};
        console.log(fabric);
        res.redirect('/master.html');
    })
});
app.post("/add_style",(req,res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        let picture = files.picture;
        let unique =  Math.floor((Math.random()*100000)+(Math.random()*100000));
        var oldpath = picture.path;
        var path_new =path.join(__dirname ,"./public/content/pics/",unique+"_"+picture.name);
        var db_path = path.join("./content/pics/",unique+"_"+picture.name);
        fs.copyFile(oldpath,path_new,(err)=>{
            if(err){
                throw err
            }
            fs.unlink(oldpath,(err_4)=>{
                if(err_4){
                    throw err_4;
                }
                let obj = {};
                obj.title = fields.title;
               obj.product = fields.product;
               obj.gender = fields.gender ;
               obj.picture = db_path;
               new Styles(obj).save((err,style)=>{
                   if(err){throw err};
                   console.log(style);
//                   res.end(db_path);

                   res.redirect('/master.html');
               })
                
            })
        })
       
      
     })
    
});
app.post("/edit_item",(req,res)=>{
    let name = req.body.name;
    let detail = req.body.details;
    let price = req.body.price ;
    console.log(name);
    console.log(price);
    Items.findOne({name:name},(err,item)=>{
        console.log(item);
        item.detail = detail;
        item.price = price;
        item.save(()=>{
            res.json({success:true});
            res.end();
        })
        
    })
    
})
app.post("/add_item",(req,res)=>{
    let name = req.body.name;
    let detail = req.body.detail;
    let price = req.body.price ;
    let obj = {name:name,detail:detail,price:price} ;
    new Items(obj).save((err,item)=>{
        if(err){throw err};
        console.log(item);
        res.redirect('/master.html');
    })
});
app.post("/add_raw_item",(req,res)=>{
    let name = req.body.name;
    let detail = req.body.detail;
    let price = req.body.price ;
    let unit = req.body.unit;
    let obj = {name:name,detail:detail,price:price,unit:unit} ;
    new Raw_Items(obj).save((err,item)=>{
        if(err){throw err};
        console.log(item);
        res.redirect('/master.html');
    })
});
app.post("/edit_raw_item",(req,res)=>{
    let name = req.body.name;
    let detail = req.body.details;
    let price = req.body.price ;
    Raw_Items.findOneAndUpdate({name:name},{$set:{detail:detail,price:price}},(err,item)=>{
        res.json({success:true});
        res.end();
    })
})
app.post("/add_vendor",(req,res)=>{
    let name = req.body.name;
    let company_name = req.body.company_name;
    let street = req.body.street ;
    let city = req.body.city ;
    let phone = req.body.phone ;
    let email = req.body.email;

    let obj = {name:name,company_name:company_name,street:street,city:city,phone:phone,email:email} ;
    new Vendors(obj).save((err,vendor)=>{
        if(err){throw err};
        console.log(vendor);
        res.redirect('/master.html');
    })
});
app.get("/job_slip/complete/:num",(req,res)=>{
    let number = req.params.num;
    Job_Slip.findOne({number:number},(err,js)=>{
        let q = js.quantity;
        let p = js.packing;
        if(q===p){
            js.ready_to_deliver = true;
            js.save(()=>{
                res.redirect("../../pages/src/production/index.html")
            })

        }
        else{
            res.redirect("/");
        }
    })
})
app.post("/job_slip/cutting",(req,res)=>{
    let lpo_ref = req.body.lpo_ref;
    let number = req.body.q;
    let date = req.body.date;
     let by = req.body.by;
     let q = 0,start=-1,end=-1,barcode_array=[],job_lists=[];
     
     if((number/1)>= 1){
           q = 1;
         }
      else if(number.indexOf(",")>= 0){
               q = number.split(",").length;
               barcode_array = number.split(",");

        }                                                 
         else{
          
           start = number.split("-")[0];
           end = number.split("-")[1];
           q = end-start+1;
         }
    console.log("number",number);     
    console.log("start",start);
    console.log("end",end);
    console.log("quantity",q);
    console.log("barcode array,",JSON.stringify(barcode_array));
    Job_Slip.find({ref:lpo_ref},(err,js)=>{
        job_lists = js;
        if(job_lists.length===0)
        {
            res.json({"success":false,"msg":"job slips does not exist for the selected LPO ref!!"});
            res.end();
        }
        else{
      /// single barcode      
     if(barcode_array.length===0 && start === -1)
     {
         console.log("single number");
        
                let affected = false;
                job_lists.forEach((js)=>{
                    if(number>= js.starting_number && number <= (js.starting_number+js.quantity-1)){
                        console.log(number+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                        Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{cutting:1},},(err,resp)=>{
                            res.json({"success":true,"msg":"Job slip#"+number+" has been cut under LPO ref#"+lpo_ref})
                            res.end();
                        })
                    }
                })
         

     }
     ///  multi-barcodes
     else if(barcode_array.length>=2){

        console.log("multi numbers");
        job_lists.forEach((js)=>{
            barcode_array.forEach((bc)=>{
                if(bc>= js.starting_number && bc <= (js.starting_number+js.quantity-1))
                {
                    console.log(bc+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                        Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{cutting:1}},(err,resp)=>{
                            //res.json({"success":true,"msg":"Job slip#"+number+"has been cut under LPO ref#"+lpo_ref})
                        })

                }
            })
        })

     }
     // range
     else{
         let increment = end - start + 1;
         job_lists.forEach((js)=>{
             if(start>= js.starting_number && end <= (js.starting_number+js.quantity-1))
             {
                console.log(start+"-"+end+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{cutting:increment},cutting_by:by,cutting_on:date},(err,resp)=>{
                    res.json({"success":true,"msg":"Job slip#"+start+" to "+end+" has been cut under LPO ref#"+lpo_ref})
                })
             }
         })
     }

    }
});
     

});
app.post("/job_slip/stitching",(req,res)=>{
   // let number = req.body.number;
    let lpo_ref = req.body.lpo_ref;
    let number = req.body.q;
    let date = req.body.date;
    let by = req.body.by;
    let q = 0,start=-1,end=-1,barcode_array=[],job_lists=[];
    
    if((number/1)>= 1){
          q = 1;
        }
     else if(number.indexOf(",")>= 0){
              q = number.split(",").length;
              barcode_array = number.split(",");

       }                                                 
        else{
         
          start = number.split("-")[0];
          end = number.split("-")[1];
          q = end-start+1;
        }
   console.log("number",number);     
   console.log("start",start);
   console.log("end",end);
   console.log("quantity",q);
   console.log("barcode array,",JSON.stringify(barcode_array));
   Job_Slip.find({ref:lpo_ref},(err,js)=>{
       job_lists = js;
       if(job_lists.length===0)
       {
           res.json({"success":false,"msg":"job slips does not exist for the selected LPO ref!!"});
           res.end();
       }
       else{
     /// single barcode      
    if(barcode_array.length===0 && start === -1)
    {
        console.log("single number");
       
               let affected = false;
               job_lists.forEach((js)=>{
                   if(number>= js.starting_number && number <= (js.starting_number+js.quantity-1)){
                       console.log(number+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                       Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{stitching:1},stitching_by:by,stitching_on:date},(err,resp)=>{
                           res.json({"success":true,"msg":"Job slip#"+number+" has been stitched under LPO ref#"+lpo_ref})
                           res.end();
                       })
                   }
               })
        

    }
    ///  multi-barcodes
    else if(barcode_array.length>=2){

       console.log("multi numbers");
       job_lists.forEach((js)=>{
           barcode_array.forEach((bc)=>{
               if(bc>= js.starting_number && bc <= (js.starting_number+js.quantity-1))
               {
                   console.log(bc+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                       Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{stitching:1},stitching_by:by,stitching_on:date},(err,resp)=>{
                           //res.json({"success":true,"msg":"Job slip#"+number+"has been cut under LPO ref#"+lpo_ref})
                       })

               }
           })
       })

    }
    // range
    else{
        let increment = end - start + 1;
        job_lists.forEach((js)=>{
            if(start>= js.starting_number && end <= (js.starting_number+js.quantity-1))
            {
               console.log(start+"-"+end+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
               Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{stitching:increment},stitching_by:by,stitching_on:date},(err,resp)=>{
                   res.json({"success":true,"msg":"Job slip#"+start+" to "+end+" has been stitched under LPO ref#"+lpo_ref})
               })
            }
        })
    }

   }
});
    

});
app.post("/job_slip/qc",(req,res)=>{
    let lpo_ref = req.body.lpo_ref;
    let number = req.body.q;
    let date = req.body.date;
    let by = req.body.by;
    let q = 0,start=-1,end=-1,barcode_array=[],job_lists=[];
    
    if((number/1)>= 1){
          q = 1;
        }
     else if(number.indexOf(",")>= 0){
              q = number.split(",").length;
              barcode_array = number.split(",");

       }                                                 
        else{
         
          start = number.split("-")[0];
          end = number.split("-")[1];
          q = end-start+1;
        }
   console.log("number",number);     
   console.log("start",start);
   console.log("end",end);
   console.log("quantity",q);
   console.log("barcode array,",JSON.stringify(barcode_array));
   Job_Slip.find({ref:lpo_ref},(err,js)=>{
       job_lists = js;
       if(job_lists.length===0)
       {
           res.json({"success":false,"msg":"job slips does not exist for the selected LPO ref!!"});
           res.end();
       }
       else{
     /// single barcode      
    if(barcode_array.length===0 && start === -1)
    {
        console.log("single number");
       
               let affected = false;
               job_lists.forEach((js)=>{
                   if(number>= js.starting_number && number <= (js.starting_number+js.quantity-1)){
                       console.log(number+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                       Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{qc:1},qc_by:by,qc_on:date},(err,resp)=>{
                           res.json({"success":true,"msg":"Job slip#"+number+" has been stitched under LPO ref#"+lpo_ref})
                           res.end();
                       })
                   }
               })
        

    }
    ///  multi-barcodes
    else if(barcode_array.length>=2){

       console.log("multi numbers");
       job_lists.forEach((js)=>{
           barcode_array.forEach((bc)=>{
               if(bc>= js.starting_number && bc <= (js.starting_number+js.quantity-1))
               {
                   console.log(bc+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                       Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{qc:1},qc_by:by,qc_on:date},(err,resp)=>{
                           //res.json({"success":true,"msg":"Job slip#"+number+"has been cut under LPO ref#"+lpo_ref})
                       })

               }
           })
       })

    }
    // range
    else{
        let increment = end - start + 1;
        job_lists.forEach((js)=>{
            if(start>= js.starting_number && end <= (js.starting_number+js.quantity-1))
            {
               console.log(start+"-"+end+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
               Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{qc:increment},qc_by:by,qc_on:date},(err,resp)=>{
                   res.json({"success":true,"msg":"Job slip#"+start+" to "+end+" has been stitched under LPO ref#"+lpo_ref})
               })
            }
        })
    }

   }
});
   
});
app.post("/job_slip/packing",(req,res)=>{
    let lpo_ref = req.body.lpo_ref;
    let number = req.body.q;
    let date = req.body.date;
    let by = req.body.by;
    let q = 0,start=-1,end=-1,barcode_array=[],job_lists=[];
    
    if((number/1)>= 1){
          q = 1;
        }
     else if(number.indexOf(",")>= 0){
              q = number.split(",").length;
              barcode_array = number.split(",");

       }                                                 
        else{
         
          start = number.split("-")[0];
          end = number.split("-")[1];
          q = end-start+1;
        }
   console.log("number",number);     
   console.log("start",start);
   console.log("end",end);
   console.log("quantity",q);
   console.log("barcode array,",JSON.stringify(barcode_array));
   Job_Slip.find({ref:lpo_ref},(err,js)=>{
       job_lists = js;
       if(job_lists.length===0)
       {
           res.json({"success":false,"msg":"job slips does not exist for the selected LPO ref!!"});
           res.end();
       }
       else{
     /// single barcode      
    if(barcode_array.length===0 && start === -1)
    {
        console.log("single number");
       
               let affected = false;
               job_lists.forEach((js)=>{
                   if(number>= js.starting_number && number <= (js.starting_number+js.quantity-1)){
                       console.log(number+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                       Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{packing:1},packing_by:by,packing_on:date},(err,resp)=>{
                           res.json({"success":true,"msg":"Job slip#"+number+" has been stitched under LPO ref#"+lpo_ref})
                           res.end();
                       })
                   }
               })
        

    }
    ///  multi-barcodes
    else if(barcode_array.length>=2){

       console.log("multi numbers");
       job_lists.forEach((js)=>{
           barcode_array.forEach((bc)=>{
               if(bc>= js.starting_number && bc <= (js.starting_number+js.quantity-1))
               {
                   console.log(bc+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
                       Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{packing:1},packing_by:by,packing_on:date},(err,resp)=>{
                           //res.json({"success":true,"msg":"Job slip#"+number+"has been cut under LPO ref#"+lpo_ref})
                       })

               }
           })
       })

    }
    // range
    else{
        let increment = end - start + 1;
        job_lists.forEach((js)=>{
            if(start>= js.starting_number && end <= (js.starting_number+js.quantity-1))
            {
               console.log(start+"-"+end+" exist in sequence of "+js.starting_number+"-"+(js.starting_number+js.quantity-1));
               Job_Slip.findOneAndUpdate({starting_number:js.starting_number},{$inc:{packing:increment},packing_by:by,packing_on:date},(err,resp)=>{
                   res.json({"success":true,"msg":"Job slip#"+start+" to "+end+" has been stitched under LPO ref#"+lpo_ref})
               })
            }
        })
    }

   }
});
});
app.post("/job_slip/delivering",(req,res)=>{
    let number = req.body.number;
    let quantity = parseInt(req.body.quantity);
    let d = new Date();
    let time = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + "--" + d.getHours() +":" + d.getMinutes(); 
    let delivery_by = req.body.delivery_by;
    Job_Slip.findOneAndUpdate({number:number},{$inc:{delivery:quantity},delivery_by:delivery_by,delivery_on:time},(err,job_slip)=>{
        console.log(job_slip);
        res.redirect('../pages/src/production/index.html');
    })
})
app.post("/add_client",(req,res)=>{
    let name = req.body.name;
    let company_name = req.body.company_name;
    let street = req.body.street ;
    let city = req.body.city ;
    let phone = req.body.phone ;
    let email = req.body.email;

    let obj = {name:name,company_name:company_name,street:street,city:city,phone:phone,email:email} ;
    new Clients(obj).save((err,vendor)=>{
        if(err){throw err};
        console.log(vendor);
        res.redirect('/master.html');
    })
});
app.get('/get_vendors',(req,res)=>{
    Vendors.find({},(err,vendors)=>{
        res.json({vendors:vendors});
        res.end();
    })
});
app.get('/get_job_slips',(req,res)=>{
    if(req.query.lpo){
        let lpo = req.query.lpo;
        Job_Slip.find({ref:lpo},(err,js)=>{
            res.json({job_slips:js});
            res.end();
        })
    }
    else{
        Job_Slip.find({},(err,js)=>{
            res.json({job_slips:js});
            res.end();
        })
    }
    
});
app.get('/get_styles',(req,res)=>{
    Styles.find({},(err,styles)=>{
        res.json({styles:styles});
        res.end();
    })
});
app.get('/get_fabrics',(req,res)=>{
    Fabric.find({},(err,fabrics)=>{
        res.json({fabrics:fabrics});
        res.end();
    })
});
app.get('/get_items',(req,res)=>{
    Items.find({},(err,items)=>{
        res.json({items:items});
        res.end();
    })
});
app.get('/get_raw_items',(req,res)=>{
    Raw_Items.find({},(err,raw_items)=>{
        res.json({raw_items:raw_items});
        res.end();
    })
});
app.get('/get_pos',(req,res)=>{
    Pos.find({},(err,pos)=>{
        res.json({pos:pos});
        res.end();
    })
});
app.get('/get_gr_notes',(req,res)=>{
    GR_Note.find({},(err,invoices)=>{
        res.json({invoices:invoices});
        res.end();
    })
});
app.get('/get_invoices',(req,res)=>{
    Invoices.find({},(err,invoices)=>{
        res.json({invoices:invoices});
        res.end();
    })
});
app.get('/get_lpos',(req,res)=>{
    if(req.query.flag){
        Lpos.find({flag:req.query.flag},(err,lpos)=>{
            res.json({lpos:lpos});
            res.end();
        })
    }
    else{
        Lpos.find({},(err,lpos)=>{
            res.json({lpos:lpos});
            res.end();
        })
    }
   
})
app.get('/get_clients',(req,res)=>{
    Clients.find({},(err,clients)=>{
        res.json({clients:clients});
        res.end();
    })
});
app.get('/get_client',(req,res)=>{
    let ref = req.query.lpo;
    console.log(ref);
    Lpos.findOne({ref:ref},(err,lpo)=>{
        let client_name = lpo.client;
        Clients.findOne({company_name:client_name},(err,client)=>{
            res.json({client:client});
            res.end();
        })
    })
    
});
app.get('/get_vendor',(req,res)=>{
    let ref = req.query.lpo;
    Lpos.findOne({ref:ref},(err,lpo)=>{
        let vendor_name = lpo.vendor;
        Vendors.findOne({company_name:vendor_name},(err,vendor)=>{
            res.json({vendor:vendor});
            res.end();
        })
    })
    
});
app.get('/get_info',(req,res)=>{
     
     Info.find({},(err,info)=>{
        res.json({info:info});
        res.end();
     })
})
app.post("/update_sales_terms",(req,res)=>{
 let sales_terms = req.body.sales_terms;
 Info.findOne({},(err,info)=>{
     info.sales_terms = sales_terms;
     info.save(()=>{
         res.redirect("/master.html");
     });
 })
});
app.post("/update_purchase_terms",(req,res)=>{
    let purchase_terms = req.body.purchase_terms;
    Info.findOne({},(err,info)=>{
        info.purchase_terms = purchase_terms;
        info.save(()=>{
            res.redirect("/master.html");
        });
    })
   });
app.post('/create_job_slip',(req,res)=>{
    let starting_number = req.body.sn,
     lpo_ref = req.body.lpo_ref,
       quantity = req.body.q ,
      style = req.body.ss,
      size = req.body.s,
      person = req.body.pe,
      measurements = req.body.m,
      date = req.body.d,
      product = req.body.p ;
        let unique = Math.floor(Math.random()*999999 +  Math.random()*999999);
        let last_number = parseInt(starting_number)+parseInt(quantity)-1;
        console.log(last_number);
        
     new Job_Slip({ref:lpo_ref,number:unique,product:product,style:style,quantity:quantity,
                   starting_number:starting_number,cutting:0,stitching:0,packing:0,delivered:0,
                   qc:0,qc_on:'',qc_by:'',ready_to_deliver:false,in_packing_list:false, cutting_by:'',
                   stitching_by:'',packing_by:'',delivery_by:'',cutting_on:'',stitching_on:'',packing_on:'',
                   delivery_on:'',size:size,person:person,date:date,measurements:measurements}).save((err,job_slip)=>{
         console.log("job slip ",job_slip);
         Info.findOneAndUpdate({last_number:(parseInt(starting_number)-1)},{last_number:last_number},(err,info)=>{
             res.json({js_num:unique});
             res.end();
         
     }) 
        // res.send(product);
        // res.end(JSON.stringify(style_));

      })
      
});
async function generate_packing_list(items_list,company,lpo_ref,invoice_ref,date,cb) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/packing_list.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
    worksheet.getRow(7).getCell(3).value = invoice_ref;
    worksheet.getRow(7).getCell(8).value = date;
    worksheet.getRow(8).getCell(3).value = company;
    worksheet.getRow(9).getCell(3).value = company;
    worksheet.getRow(8).getCell(8).value = lpo_ref;


    items_list.forEach((item , index)=>{
        Job_Slip.findOneAndUpdate({number:item.js_num},{$inc:{delivered:parseInt(item.qty)}},()=>{ });
        worksheet.getRow(15+index).getCell(1).value = index+1; 
        worksheet.getRow(15+index).getCell(2).value = item.ctn; 
        worksheet.getRow(15+index).getCell(3).value = item.item; 
        worksheet.getRow(15+index).getCell(4).value = item.size; 
        worksheet.getRow(15+index).getCell(6).value = item.pcs;
        worksheet.getRow(15+index).getCell(7).value = item.qty;

    })

    
    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/packing_list_g.xlsx")).then(cb);
}
app.post('/generate_packing_list',(req,res)=>{
    console.log(JSON.stringify(req.body));
    let invoice_num = req.body.invoice_num;
    let lpo_ref = req.body.lpo_ref;
    let company = lpo_ref.split("/")[1];
    let invoice_ref = "iv/"+company+ "/" + invoice_num
    let date = req.body.date;
    let packing_list = JSON.parse(req.body.packing_list);
    let html ='',str='';
     let obj = {lpo_ref:lpo_ref,number:invoice_num,ref:invoice_ref,date:date,company:company,items_list:req.body.packing_list};
    generate_packing_list(packing_list,company,lpo_ref,invoice_ref,date,()=>{
        new Invoices(obj).save();
        Info.findOneAndUpdate({},{$inc:{invoice_num:1}},()=>{});

        res.json({success:true});
        res.end();    
    })
   


});
app.get("/products",(req,res)=>{
    Items.find({$or:[{name:"Shirt"},{name:"scarf"}]},(err,items)=>{
        res.end(JSON.stringify(items));
    })
})
async function generate_sales_invoice(items_list,company,date,invoice_ref,lpo_ref,sm,ft,pol,o,pod,plod,cb) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/sales_invoice.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
        worksheet.getRow(6).getCell(2).value = company.company_name;
        worksheet.getRow(7).getCell(2).value = company.street+","+company.city;
        worksheet.getRow(8).getCell(2).value = company.name;
        worksheet.getRow(9).getCell(2).value = company.phone;
        worksheet.getRow(6).getCell(7).value = invoice_ref;
        worksheet.getRow(7).getCell(7).value = date;
        worksheet.getRow(8).getCell(7).value = lpo_ref;
        worksheet.getRow(11).getCell(2).value = sm;
        worksheet.getRow(12).getCell(2).value = ft;
        worksheet.getRow(13).getCell(2).value = pol;
        worksheet.getRow(11).getCell(7).value = o;
        worksheet.getRow(12).getCell(7).value = pod;
        worksheet.getRow(13).getCell(7).value = plod;

    let g_total = 0;
    items_list.forEach((item , index)=>{
        worksheet.getRow(17+index).getCell(1).value = index+1; 
        worksheet.getRow(17+index).getCell(2).value = item.item+"-"+item.size; 
        worksheet.getRow(17+index).getCell(6).value = item.qty; 
        worksheet.getRow(17+index).getCell(7).value = item.price; 
        worksheet.getRow(17+index).getCell(8).value = parseInt(item.qty) * parseInt(item.price); 
        g_total += parseInt(item.qty) * parseInt(item.price);
    })
    worksheet.getRow(36).getCell(8).value = g_total; 
   


    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/sales_invoice_g.xlsx")).then(cb);
}
app.post('/generate_sales_invoice',(req,res)=>{
    let ref = req.body.ref,
        sm = req.body.sm,
        o = req.body.o,
        ft = req.body.ft,
        pol = req.body.pol,
        pod = req.body.pod,
        plod = req.body.plod;
        Invoices.findOne({ref:ref},(err,invoice)=>{
            let lpo_ref = invoice.lpo_ref,
            date = invoice.date,
            items_list = JSON.parse(invoice.items_list);
            console.log("invoice_items:",invoice.items_list);
            Items.find({},(err,items)=>{
               items_list.forEach((item)=>{
                   items.forEach((o_item)=>{
                       if(item.item===o_item.name)
                       {
                           item.price = o_item.price;
                       }
                   })
               }) 
            
       
        Clients.findOne({company_name:ref.split("/")[1]},(err,client)=>{
            var company_name = client.company_name,
                city = client.city,
                address = client.street,
                phone = client.phone;
                console.log("client detail",client);
                /// sales_invoice_html
               // let str =``,total=0,total_q=0;
                // items_list.forEach((item,index)=>{
                //     str += `<tr><th colspan="1">`+item.qty+`</th><th colspan="3" >`+item.item+"-"+item.size+`</th><th>`+item.price+`</th><th>`+(parseInt(item.price)*parseInt(item.qty))+`</th></tr>` ;
                //     total_q += parseInt(item.qty);  
                //     total += parseInt(item.price)*parseInt(item.qty);
                //  })
                let total=0;
                items_list.forEach((item,index)=>{
                    total += parseFloat(item.price) * parseFloat(item.qty);
                })
                     generate_sales_invoice(items_list,client,date,ref,lpo_ref,sm,ft,pol,o,pod,plod,()=>{
                        Invoices.findOneAndUpdate({ref,ref},{$set:{payment:total.toFixed(2).toString()}},(err,invoice)=>{
                           console.log("invoice:",invoice);
                            res.json({success:true});
                          res.end();
                          console.log("invoice created");
                        })
                        
                 })
                
  
            

      
    });
});
    
});
    

});
app.post('/add_lpo',(req,res)=>{
    let company = {name:req.body.client,person:req.body.pur_name,address:req.body.v_address,city:req.body.v_city,phone:req.body.v_phone};
    let ship = {person:req.body.s_name,address:req.body.s_address,city:req.body.s_city,phone:req.body.s_phone};
    let lpo_num = req.body.lpo_num;
    let date = req.body.date;
    let due_date = req.body.due_date;
    let ref = req.body.ref;
    let tax = req.body.tax;
    let discount = req.body.discount;
    let items_array = req.body.items_array;
   let parsed_items = JSON.parse(items_array);
   let str,total_q = 0 ;
    console.log("address",company.address);
    console.log("city",company.city);
    console.log("phone",company.phone);
   parsed_items.forEach((item,index)=>{
       str += `<tr><th colspan="1">`+item.quantity+`</th><th colspan="3" >`+item.item+"-"+ item.description+"-"+item.size+`</th><th>`+item.price+`</th><th>`+(parseInt(item.price)*parseInt(item.quantity))+`</th></tr>` ;
       total_q += item.quantity;  
    })
  
generate_sales_order(parsed_items,discount,tax,company,ship,lpo_num,date,due_date,ref,()=>{
    console.log("file is generated");
    new Lpos({client:company.name,lpo_number:lpo_num,date:date,due_date:due_date,ref:ref,items_array:items_array,flag:'order_phase'}).save((err,lpo)=>{
              //  res.setHeader( 'Content-Type', 'application/pdf');
               // res.sendFile(path.join(__dirname,"sales_order.pdf"));
                 res.json({success:true,lpo:lpo});
                 res.end();
             })  ;
            let attachments = [{ filename: 'Sales Order.xlsx', path: __dirname + '/public/reports/sales_order_g.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }];
            var mailOptions = {
                from: "Neural stack <rapshek@gmail.com>",
                to: "rapshek@gmail.com", // riazkhan@abbasaliandsons.com
                subject: "Sale Order for "+company.name,
                attachments: attachments,
                html: "<h1>A sale order detail is attached in xlsx</h1>"
            };
        
            transporter.sendMail(mailOptions, function(error, response){
                if(error) console.log(error);
                else console.log("Message sent: " + response.messageId);
                // shut down the connection pool, no more messages
               // transporter.close();
            });
             
});
   
   
   
    
});

async function generate_sales_order(items_list,discount,tax,company,ship,lpo_num,date,due_date,ref,cb) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/sales_order.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
        worksheet.getRow(6).getCell(2).value = company.name;
        worksheet.getRow(7).getCell(2).value = company.address+","+company.city;
        worksheet.getRow(8).getCell(2).value = company.person;
        worksheet.getRow(9).getCell(2).value = company.phone;
        worksheet.getRow(6).getCell(7).value = ref;
        worksheet.getRow(7).getCell(7).value = date;
        worksheet.getRow(8).getCell(7).value = due_date;
        worksheet.getRow(12).getCell(2).value = ship.person;
        worksheet.getRow(13).getCell(2).value = ship.address;
        worksheet.getRow(14).getCell(2).value = ship.city;
        worksheet.getRow(15).getCell(2).value = ship.phone;
    let g_total = 0;
    items_list.forEach((item , index)=>{
        worksheet.getRow(19+index).getCell(1).value = index+1; 
        worksheet.getRow(19+index).getCell(2).value = item.item+"_"+item.description; 
        worksheet.getRow(19+index).getCell(6).value = item.quantity; 
        worksheet.getRow(19+index).getCell(7).value = item.price; 
        worksheet.getRow(19+index).getCell(8).value = parseInt(item.quantity) * parseInt(item.price); 
        g_total += parseInt(item.quantity) * parseInt(item.price);
    })
    worksheet.getRow(34).getCell(8).value = g_total; 
    worksheet.getRow(35).getCell(8).value = discount; 
    worksheet.getRow(36).getCell(8).value = tax+"%"; 
    worksheet.getRow(37).getCell(8).value = (g_total-discount) + (g_total-discount)*(tax/100); 



    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/sales_order_g.xlsx")).then(cb);
}
app.get("/pdf_packing_list",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname,"packing_list.pdf"));
});
app.get("/pdf_sales_order",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname,"sales_order.pdf"));
});
app.get("/sales_invoice_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/sales_invoice_g.xlsx"));
});
app.get("/payment_voucher_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/payment_voucher_g.xlsx"));
});
app.get("/reciept_voucher_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/reciept_voucher_g.xlsx"));
});
app.get("/gr_note_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/goods_recieving_note_g.xlsx"));
});
app.get("/sales_order_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/sales_order_g.xlsx"));
});
app.get("/purchase_order_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/purchase_order_g.xlsx"));
});
app.get("/packing_list_report",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(path.join(__dirname,"public/reports/packing_list_g.xlsx"));
});

app.get("/pdf_sales_invoice",(req,res)=>{
    res.setHeader( 'Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname,"sales_invoice.pdf"));
})

async function generate_gr_note(items_list,company,date,invoice_ref,recieved_by,po_ref,cb) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/goods_recieving_note.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
        worksheet.getRow(6).getCell(2).value = company.company_name;
        worksheet.getRow(7).getCell(2).value = company.street+","+company.city;
        worksheet.getRow(8).getCell(2).value = company.name;
        worksheet.getRow(9).getCell(2).value = company.phone;
        worksheet.getRow(6).getCell(7).value = invoice_ref;
        worksheet.getRow(7).getCell(7).value = date;
        worksheet.getRow(8).getCell(7).value = po_ref;
        worksheet.getRow(10).getCell(7).value = recieved_by;

      
    let g_total = 0;
    items_list.forEach((item , index)=>{
        worksheet.getRow(17+index).getCell(1).value = item.recieved; 
        worksheet.getRow(17+index).getCell(2).value = item.item+"-"+item.description; 
        worksheet.getRow(17+index).getCell(6).value = item.quantity; 
        worksheet.getRow(17+index).getCell(7).value = item.price; 
        worksheet.getRow(17+index).getCell(8).value = parseInt(item.recieved) * parseInt(item.price); 
        g_total += parseInt(item.recieved) * parseInt(item.price);
    });
    worksheet.getRow(36).getCell(8).value = g_total; 
   
    

    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/goods_recieving_note_g.xlsx")).then(cb);
}
app.post("/generate_gr_note",(req,res)=>{
    let flag;
    let po_num= req.body.po_num;
    let vendor=req.body.vendor,
    date=req.body.date,
    recieved_by=req.body.recieved_by,
    invoice_num=req.body.invoice_num,
    items_list=JSON.parse(req.body.items_list);
     g_total = 0;
    items_list.forEach((item , index)=>{
            g_total += parseInt(item.recieved) * parseInt(item.price);
    });
    let qtys = JSON.parse(req.body.qtys);
    Vendors.findOne({company_name:vendor},(err,company)=>{
        console.log(po_num);
    console.log(vendor);
    console.log(date)
    console.log(recieved_by)
    console.log(invoice_num);
    console.log(req.body.items_list);
    generate_gr_note(items_list,company,date,invoice_num,recieved_by,po_num,()=>{
       new GR_Note({
           po_ref:po_num,
           invoice_num:invoice_num,
           date:date,
           recieved_by:recieved_by,
           items_list:JSON.stringify(items_list),
           vendor:vendor,
           payment:g_total
       }).save(()=>{
        console.log("gr note generated");
        res.json({success:true});
        res.end();

       })
    })
    })
    

//     Pos.findOne({po_num:po_num},(err,po)=>{
//         let purchase_array = JSON.parse(po.purchase_array);
//              console.log("before:",purchase_array);
//              purchase_array.forEach((item,index) => {
//                  item.quantity = parseInt(item.quantity) - parseInt(qtys[index]);
//              });
//              console.log("mid:",purchase_array);
        
//          let filtered = purchase_array.filter((item)=>
//           item.quantity!=0
//         )   
//         if(filtered.length<1){
//             flag = "purchased_done";
//             po.flag=flag;
//         }      
//           po.purchase_array = JSON.stringify(purchase_array);
//           po.save((err,po)=>{
//             // lpos
//                     Lpos.findOne({ref:po.ref},(err,lpo)=>{
//      let purchase_array = JSON.parse(lpo.purchase_array);
//      console.log("before:",purchase_array);
//      purchase_array.forEach((item,index) => {
//          item.quantity = parseInt(item.quantity) - parseInt(qtys[index]);
//      });
//      console.log("mid:",purchase_array);

//  let filtered = purchase_array.filter((item)=>
//   item.quantity!=0
// )   
// if(filtered.length<1){
//     flag = "purchased_done";
//     lpo.flag=flag;
// }      
//   lpo.purchase_array = JSON.stringify(purchase_array);
//   lpo.save((err,lpo)=>{
    
//     res.json({success:true,lpo:lpo});
//     res.end();

//   });

// });

//             //lpos
//           });
//     })

});
async function generate_purchase_order(items_list,company,ship,lpo_num,date,p_date,ref,cb) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/purchase_order.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
        worksheet.getRow(6).getCell(2).value = company.company_name;
        worksheet.getRow(7).getCell(2).value = company.street+","+company.city;
        worksheet.getRow(8).getCell(2).value = company.name;
        worksheet.getRow(9).getCell(2).value = company.phone;
        worksheet.getRow(6).getCell(7).value = lpo_num;
        worksheet.getRow(7).getCell(7).value = date;
        worksheet.getRow(8).getCell(7).value = p_date;
        worksheet.getRow(10).getCell(7).value = ref;

        worksheet.getRow(12).getCell(2).value = ship.name;
        worksheet.getRow(13).getCell(2).value = ship.address;
        worksheet.getRow(14).getCell(2).value = ship.city;
        worksheet.getRow(15).getCell(2).value = ship.phone;
    let g_total = 0;
    items_list.forEach((item , index)=>{
        worksheet.getRow(19+index).getCell(1).value = index+1; 
        worksheet.getRow(19+index).getCell(2).value = item.item+"_"+item.description; 
        worksheet.getRow(19+index).getCell(6).value = item.quantity; 
        worksheet.getRow(19+index).getCell(7).value = item.price; 
        worksheet.getRow(19+index).getCell(8).value = parseInt(item.quantity) * parseInt(item.price); 
        g_total += parseInt(item.quantity) * parseInt(item.price);
    })
    
    worksheet.getRow(37).getCell(8).value = g_total; 



    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/purchase_order_g.xlsx")).then(cb);
};
async function generate_payment_voucher(vendor,invoice_num,invoice_date,po_num,paying,total,balance,p_type,c_number,t_number,cb) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/payment_voucher.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
    worksheet.getRow(6).getCell(2).value = vendor.company_name;
    worksheet.getRow(7).getCell(2).value = vendor.street + "/"+ vendor.city;
    worksheet.getRow(8).getCell(2).value = vendor.name;
    worksheet.getRow(9).getCell(2).value = vendor.phone;
    worksheet.getRow(6).getCell(7).value = invoice_num;
    worksheet.getRow(7).getCell(7).value = invoice_date;
    worksheet.getRow(8).getCell(7).value = po_num;
    worksheet.getRow(12).getCell(4).value = paying;
    worksheet.getRow(12).getCell(5).value = total;
    worksheet.getRow(12).getCell(6).value = balance;
    worksheet.getRow(11).getCell(2).value = p_type;
    worksheet.getRow(11).getCell(5).value = "Total Payment";

    if(p_type === "cheque")
    {
        worksheet.getRow(13).getCell(1).value ="Cheque Number";
        worksheet.getRow(13).getCell(2).value =c_number;

    }
    else if(p_type === "online transfer")
    {
        worksheet.getRow(13).getCell(1).value ="Transaction Number";
        worksheet.getRow(13).getCell(2).value =t_number;
    }



   

    
    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/payment_voucher_g.xlsx")).then(cb);
}

app.post('/payment_voucher',(req,res)=>{
    let invoice_id = req.body.invoice_id,
    p_type= req.body.p_type,
    c_number=req.body.c_number,
    t_number=req.body.t_number,
    paying=req.body.paying,
    total=req.body.total,
    balance=req.body.balance;
    GR_Note.findById(invoice_id,(err,invoice)=>{
        console.log(invoice);
        Vendors.findOne({company_name: invoice.vendor},(err,company)=>{
            generate_payment_voucher(company,invoice.invoice_num,invoice.date,invoice.po_ref,
                paying,total,balance,p_type,c_number,t_number,()=>{
                    console.log("payment voucher is generated");
                    res.json({success:true});
                    res.end();
                })
        })
    })
    console.log(invoice_id);
    console.log(p_type)
    console.log(c_number)
    console.log(t_number)
    console.log(paying)
    console.log(total)
    console.log(balance)



});
async function generate_reciept_voucher(vendor,invoice_num,invoice_date,po_num,paying,total,balance,cb) {
   console.log("/////////////////////////////////////");
    console.log(vendor);
    console.log(invoice_num);
    console.log(invoice_date);
    console.log(po_num);
    console.log(paying);
    console.log(total);
    console.log(balance);
    console.log("/////////////////////////////////////");



    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(path.join(__dirname,"/public/reports/reciept_voucher.xlsx")); // replace question_39869739.xls with your file
    let worksheet = workbook.getWorksheet('Sheet1'); // replace sheetname with actual sheet name
    worksheet.getRow(6).getCell(2).value = vendor.company_name;
    worksheet.getRow(7).getCell(2).value = vendor.street + "/"+ vendor.city;
    worksheet.getRow(8).getCell(2).value = vendor.name;
    worksheet.getRow(9).getCell(2).value = vendor.phone;
    worksheet.getRow(6).getCell(7).value = invoice_num;
    worksheet.getRow(7).getCell(7).value = invoice_date;
    worksheet.getRow(8).getCell(7).value = po_num;
    worksheet.getRow(12).getCell(4).value = paying;
    worksheet.getRow(12).getCell(5).value = total;
    worksheet.getRow(12).getCell(6).value = balance;
    worksheet.getRow(11).getCell(5).value = "Total Payment";    
    workbook.xlsx.writeFile(path.join(__dirname,"/public/reports/reciept_voucher_g.xlsx")).then(cb);
}
app.post('/reciept_voucher',(req,res)=>{
    let invoice_id = req.body.invoice_id,
    paying=req.body.paying,
    total=req.body.total,
    balance=req.body.balance;
    Invoices.findById(invoice_id,(err,invoice)=>{
        console.log(invoice);
         Clients.findOne({company_name: invoice.company},(err,company)=>{
             generate_reciept_voucher(company,invoice.ref,invoice.date,invoice.lpo_ref,
                 paying,total,balance,()=>{
                      console.log("reciept voucher is generated");
                      res.json({success:true});
                      res.end();
                 })
         })
    })
    console.log(invoice_id);
    console.log(paying)
    console.log(total)
    console.log(balance)



});

app.post('/purchase_order',(req,res)=>{
    let vendor = req.body.vendor;
    let po_num = req.body.po_num;
    let ref = req.body.ref;
    let po_ref = "po/"+vendor+"/"+po_num;
    let purchase_array = JSON.parse(req.body.purchase_array);
    let ship_info = JSON.parse(req.body.ship_info);
    let date = req.body.date;
    let p_date = req.body.p_date;
    console.log(vendor);
    console.log(po_num);
    console.log(ref);
    console.log(ship_info);
    console.log(p_date);

    Vendors.findOne({company_name:vendor},(err,company)=>{
        generate_purchase_order(purchase_array,company,ship_info,ref,date,p_date,po_ref,()=>{
            console.log("purchase order created");
             Lpos.findOne({ref:ref},(err,lpo)=>{
        lpo.vendor = vendor;
        lpo.purchase_array = req.body.purchase_array;
        lpo.po_num = po_num;
        lpo.flag = 'order_phase';
        Info.findOneAndUpdate({},{$inc:{po_num:1}},()=>{});
        lpo.save((err,lpo)=>{
            new Pos({ref:ref,vendor:vendor,po_num:po_ref,date:date,p_date:p_date,purchase_array:req.body.purchase_array}).save();
            res.json({success:true});
            res.end();
    
        })
    })
   
        })

    })
        
    
});





    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "rapshek@gmail.com", // generated ethereal user
            pass: "logical007" // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });



 

   
    
   
    //
    app.listen(80,()=>{
        console.log("server is running on port 80");
    })
