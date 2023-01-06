import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import https from "https";
import { url } from "inspector";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

var app = express();

var port = process.env.PORT;



app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
})


app.post('/', function(req,res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    console.log(firstName, lastName, email)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
	                LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const  url = "https://us18.api.mailchimp.com/3.0/lists/a1f6ab4b4b";

    var option = {
        method: "POST",
        auth: "elijah111:f63c4ae303520be56fb2cf74043030d2-us18"
    }

    const request = https.request(url, option, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        }else{
            res.sendFile(__dirname + '/failure.html')
        }
        response.on('data', function(data) {
            console.log(JSON.parse(data))
        })
    } )

    request.write(jsonData)
    request.end();


    // res.send("Got it")
})

app.post('/failure', function(req,res) {
    res.redirect('/')
})

app.listen(port || 3000, function() {
    console.log("Server is up and running on port number " + port);
})



//f63c4ae303520be56fb2cf74043030d2-us18
//a1f6ab4b4b