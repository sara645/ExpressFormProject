var express=require('express');
var app=express();
var bodyParser=require('body-parser');

var mysql=require('mysql');
var conn=mysql.createConnection({host:"127.0.0.1",user:"root",password:"",database:"sara"});


app.set('view engine','ejs');

var Usernamee;
var Passwordd;

var jsonParser=bodyParser.json();

app.use(bodyParser.urlencoded({extended:false}));
app.get('/',function(req,res){
    res.render("signup");
})

app.post('/save',function(req,res){
    var name=req.body.uname;
    var pass=req.body.pass;
    var fname=req.body.fname;
    var gen=req.body.gen;
    var phno=req.body.phno;
    // conn.connect(function(error){
    //     if(error) throw error;
        conn.query("select Username from projectinfo where Username=? ",[name],function(error,result){
            if(result.length==0)  {
                var sql="insert into projectinfo(Username,Password,FirstName,Gender,PhoneNumber) values('"+name+"','"+pass+"','"+fname+"','"+gen+"','"+phno+"')";
                conn.query(sql,function(error,result1){
                    if(error) throw error;
                    console.log("Record saved successfully");
                })
                res.redirect("/login");

             }
           else {
            res.render("error_page");
        }

        
        })
      
    })
    
   
// })

app.get('/login',function(req,res){
    res.render("login");
})

app.post('/validate',function(req,res){
        var uname=req.body.uname;
        var pass1=req.body.pass1;
        conn.query("SELECT Username, Password FROM projectinfo WHERE Username=? AND Password=?",[uname,pass1],function(error,result){
           
            if(result.length==0){
                res.render("error_page2");
            }
            else{
                Usernamee=result[0].Username;
                Passwordd=result[0].Password;
                res.redirect("/menu");
            }
        })
})

app.get('/menu',function(req,res){
    res.render("menu");
})

app.get('/result',function(req,res){
    conn.query("SELECT * FROM projectinfo WHERE Username=? AND Password=?",[Usernamee,Passwordd],function(error,result){
           
        if(result.length==0){
            res.render("error_page2");
        }
        else{
           res.render("result",{result:result});
        }
    })
})

app.get('/changePass',function(req,res){
    res.render("newPass");
})

app.post('/finalPass',function(req,res){
    var newPass=req.body.pass2;
    var newPass2=req.body.pass3;
    var oldPass=req.body.oldPass;
    if(newPass===newPass2){
        conn.query("UPDATE projectinfo SET Password=? where Username=? and Password=?",[newPass,Usernamee,oldPass],function(error,result){
            if(result){
                console.log("update successful");
                res.redirect("/menu");
            }
            res.send("Update not successfull");
        })
    }
})




app.listen(4444);