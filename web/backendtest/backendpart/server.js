const express = require ('express');
const app= express();
const port= 5000;


app.get('/mint', (req,res)=>{
    res.send("minting");
});

app.get('/transfer', (req,res)=>{
    res.send("hello testing donedsf");
});

app.get('/callfun', (req,res)=>{
    res.send("hello testing donedsf");
});

app.get('/', (req,res)=>{
    res.send("hello testing donedsf");
});
app.listen(port, () =>{
    console.log("my server is running on port " + port);
});