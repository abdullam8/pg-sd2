// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});


// Create a route for all students
app.get("/all-students", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    })
});

// Create a route for all students formatted in html format
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    var output = '<table border = "1px">';
    db.query(sql).then(results => {
        for (var row of results){
            output += '<tr>';
            output += '<td>' + row.id + '</td>';
            // create a link to each student showing student ID
            output += '<td>' + '<a href="./single-student/' + row.id + '">' + row.name + '</a>' + '</td>';
            output += '</tr>';
        }
        output += '</table>';
        res.send(output);
    })
});


// single-student page which lists a student name, their programme and their modules
app.get("/single-student/:id", function (req, res) {
    var stId = req.params.id;
    console.log(stId);
    var stSql = "SELECT s.name as student, ps.name as programme, \
    ps.id as pcode from Students s \
    JOIN Student_Programme sp on sp.id = s.id \
    JOIN Programmes ps on ps.id = sp.programme \
    WHERE s.id = ?"
    var modSql = "SELECT * FROM Programme_Modules pm \
    JOIN Modules m on m.code = pm.module \
    WHERE programme =?"
    db.query(stSql, [stId]).then(results => {
        // console.log(results);
        var pCode = results[0].pcode;
        output = '';
        output += '<div><b>Student: </b>' + results[0].student; + '</div>';
        output += '<div><b>Programme: </b>' + results[0].programme; + '<div>'
        //Now call the database for the modules
        db.query(modSql, [pCode]).then(results => {
            output += '<table border="1px">';
            for (var row of results){
                output += '<tr>';
                output += '<td>' + row.module + '</td>';
                output += '<td>' + row.name + '<td>';
                output += '</tr>';
            }
            output += '</table>';
            res.send(output);

        });
    });
});



// Create a route for all Programmes
app.get("/all-Programmes", function(req, res) {
    var sql = 'select * from Programmes';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    })
});

// Create a route for all Programmes formatted in html table
app.get("/all-programmes-formatted", function(req, res) {
    var sql = 'select * from Programmes';
    var output = '<table border = "1px">';
    db.query(sql).then(results => {
        for (var row of results){
            output += '<tr>';
            output += '<td>' + row.id + '</td>';
            // create a link to each student showing student ID
            output += '<td>' + '<a href="./single-programme/' + row.id + '">' + row.name + '</a>' + '</td>';
            output += '</tr>';
        }
        output += '</table>';
        res.send(output);
    })
});



// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});