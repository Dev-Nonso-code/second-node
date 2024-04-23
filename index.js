const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set("view engine", "ejs")
const PORT = 5500

let userSchema = mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type: String, required: true}, 
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
})

let userModel = mongoose.models.user_tbs || mongoose.model("user_tbs", userSchema)



app.get("/signup", (req, res) => {
    res.render("signup", { message: "" })
})

app.post("/signup", async (req, res, next) => {
    let data = req.body
    // console.log(data)
    let form = new userModel(data)
    await form.save().then((result) => {
        console.log(result)
        // res.render("signup", { message: "Sign up successful" })
        res.redirect("/signin")
    }).catch((err) => {
        console.log(err)
        res.render("signup", { message: "Sign up failed" })
        next()
    })
})

app.get("/signin", (req, res, next) => {
    res.render("signin", { message: "" })
})

app.post("/signin", async (req, res, next) => {
    let data = req.body
    let email = data.email
    let password = data.password
    await userModel.findOne({ email: email }).then((result) => {
        if (result.password == password) {
            res.render("signin", { message: "Log in Successful" })
        } else {
            res.render("signin", { message: "Invalid password" })
        }
    }).catch((err) => {
        console.log(err)
        res.render("signin", { message: "Account doesn't exist" })
        next()
    })
})


let todoSchema = mongoose.Schema({
    title: String,
    entry: String,
})

let todoModel = mongoose.models.todo_tbs || mongoose.model("todo_tbs", todoSchema)


app.get("/dashboard", async (req, res) => {
    try {
        await todoModel.find().then((result2) => {
            res.render("dashboard", { result: result2, message: "Entry created successfully" })
        })
    } catch (error) {
        res.render("dashboard", { message: "Internal server error", title: "", entry: "" })
        return next(error)
    }
})

app.post("/dashboard", async (req, res, next) => {
    try {
        console.log(req.body)
        let form = new todoModel(req.body)
        await form.save().then((result) => {
            console.log(result)
            todoModel.find().then((result2) => {
                res.render("dashboard", { result: result2, message: "Entry created successfully" })
            })
        }).catch((err) => {
            console.log(err)
            res.render("dashboard", { message: "Entry creation failed", title: "", entry: "" })
        })
    } catch (error) {
        res.render("dashboard", { message: "Internal server error", title: "", entry: "" })
        return next(error)
    }

})

app.post("/delete", async (req, res, next) => {
    console.log(req.body)
    try {
        todoModel.findByIdAndDelete({ _id: req.body._id }).then((result) => {
            console.log(result)
            res.redirect("/dashboard")
        })
    } catch (err) {
        console.log(err)
        return next(err)
    }
})


const uri = "mongodb+srv://First-Class:11480494@cluster0.pzhpnvm.mongodb.net/?retryWrites=true&w=majority"

const connect = async () => {
    try {
        mongoose.set("strictQuery", false)
        await mongoose.connect(uri).then((result) => {
            // console.log(result)
            console.log("Mongoose don connect")
        })
    } catch (error) {
        console.log(error)
    }
}

connect()

app.listen("5500", () => {
    console.log("Server don start")
})