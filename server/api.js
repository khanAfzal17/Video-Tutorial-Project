var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");

var conString = "mongodb://127.0.0.1:27017";

var app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/getusers", (req, res) => {
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblusers").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get("/getadmin", (req, res) => {
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tbladmin").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get("/getcategories", (req, res) => {
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblcategories").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get("/getvideos", (req, res) => {
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblvideos").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get("/getvideo/:id", (req, res) => {
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblvideos").find({ VideoId: id }).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.post("/adduser", (req, res) => {
    var user = {
        "UserId": req.body.UserId,
        "UserName": req.body.UserName,
        "Password": req.body.Password,
        "Email": req.body.Email,
        "Mobile": req.body.Mobile
    }
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblusers").insertOne(user).then(() => {
            console.log("User Added");
            res.end();
        })
    })
});

app.post("/addvideo", (req, res) => {
    var video = {
        "VideoId": parseInt(req.body.VideoId),
        "Title": req.body.Title,
        "Url": req.body.Url,
        "Likes": parseInt(req.body.Likes),
        "Views": parseInt(req.body.Views),
        "CategoryId": parseInt(req.body.CategoryId)
    }

    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblvideos").insertOne(video).then(() => {
            console.log("Video Added");
            res.end();
        })
    })
});

app.put("/updatevideo/:id", (req, res) => {
    var id = parseInt(req.params.id);

    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblvideos").updateOne({ VideoId: id }, {
            $set: {
                VideoId: parseInt(req.body.VideoId),
                Title: req.body.Title,
                Url: req.body.Url,
                Likes: parseInt(req.body.Likes),
                Views: parseInt(req.body.Views),
                CategoryId: parseInt(req.body.CategoryId)
            }
        }).then(() => {
            console.log("Video Updated");
            res.end();
        })
    })
});

app.delete("/deletevideo/:id", (req, res) => {
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then(response => {
        var database = response.db("videotutorials");
        database.collection("tblvideos").deleteOne({ VideoId: id }).then(() => {
            console.log("Video Deleted");
            res.end();
        })
    })
});

app.listen(6600);
console.log(`Server Started : http://127.0.0.1:6600`);
