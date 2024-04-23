const express = require("express")
const ejs = require("ejs")
const app = express();
const mongoose = require('mongoose')
app.set("view engine", "ejs")
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
 const PORT = 7000
 
 let userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{type:String, require:true, unique:true},
    password:String
   
 })

 let userModel = mongoose.models.user_tbs || mongoose.model
 ("user_tbs", userSchema)
app.get("/signup", (req,res)=>{
    res.render("signup", {message:""})
    
})

app.post("/signup", async (req,res)=>{
    let data = req.body
    console.log(data)
    let form = new userModel(data)
  await form.save().then((results)=>{
        console.log(results);
        res.render("signup", {message:" signup successfully"})
        res.redirect("/signin")
    }).catch((err)=>{
        res.render("signup", {message:err.message})
        console.log(err);

    })
   
})
app.get("/signin",(req,res, next )=>{
    res.render("signin",{message:""})
})
app.post("/signin", async (req,res,next)=>{
    let data = req.body
    let email = data.email
    let password = data.password
    await userModel.findOne({email:email}).then((results)=>{
        if (results.password == password) {
        res.render("signin", {message:"Log in Successfully"})
        } else {
        res.render("signin", {message:"Invalid Password"})
        }
    }).catch((err)=>{
        console.log(err);
        res.render("signin", {message:"Account doesnt exit"})
                next()
    })
    
})

let todoSchema = mongoose.Schema({
    title: String,
    entry: String,
})

let todoModel = mongoose.models.todo_tbs || mongoose.model("todo_tbs", todoSchema)

app.get("/dashbord", async (req, res) =>{
    try{
        await todoModel.find().then((result2) => {
            res.render("dashbord", { result: result2, message: "Entry created successfully"})
        })
    } catch (error) {
        res.render("dashbord", {message: "Internal server error", title: "", entry: ""})
        return next(error)
    }
   
})

app.post("/dashboard", async (req, res, next) =>{
    try{
        console.log(req.body)
        let form = new todoModel(req.body)
        await form.save().then((result) => {
            console.log(result)
            todoModel.find().then((result2) => {
                res.render("dashbord", {result: result2, message: "entry created successfully"})
            })
            
        }).catch((err)=>{
            console.log(err)
            res.render("dashbord", {message: "entry creation faild", title: "", entry: ""})
            
        })
        
    } catch (error) {
        res.render("dashbord", {message: "Internal server error", title: "", entry: ""})
        return next(error)
    }
})

app.post("/delete", (req, res, next) =>{
    console.log(req.body)
    try{
        todoModel.deleteOne({_id: req.body._id }).then((result)=>{
            console.log(result)
            res.redirect("/dashbord")
        })
    } catch (err) {
        console.log(err)
        return next(err)
        
    }
})

const uri = "mongodb+srv://First-Class:11480494@cluster0.pzhpnvm.mongodb.net/?retryWrites=true&w=majority"

const connect = async  () =>{
    try{
        mongoose.set("strictQuery",false)
        await mongoose.connect(uri).then((results)=>{
            console.log("mongoose don connect");
        })
    }
    catch (error){
        console.log(error);
    }
}
connect()

app.listen(7000, ()=>{
    console.log(`App running 
    on port ${PORT}`)
})
