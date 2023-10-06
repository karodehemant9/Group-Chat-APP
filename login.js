const express = require('express');
const fs = require('fs');

const router = express.Router();

const storage = require('node-persist');

storage.init();



const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');





router.get('/login', (req, res, next) =>{
    console.log('Inside the login middleware!');
    res.send('<form action = "/sendMessage" method = "POST"><div><label for="name">Username:</label><input type = "text" name = "username" ><br><button type = "submit">Login</button></div></form>');
})

router.post('/sendMessage', (req, res, next) =>{

    let reqbody = req.body;
    console.log(reqbody);
    console.log('Inside the send message middleware!');
    // Set a key-value pair
    localStorage.setItem('username', `${reqbody.username}` );

    // Get the value by key
    const storedUsername = localStorage.getItem('username');
    console.log(storedUsername); 

    res.send(`<form action = "/storeMessage" method = "POST"><div><label for="name">Message : </label><input type = "text" name = "message" ><br><button type = "submit">Send message</button></div><input type = "hidden" name = "username" value = ${storedUsername}></form>`); 
    //localStorage.setItem('username', `${reqbody.username}`);
    
})

router.post('/storeMessage', (req, res, next) =>{
    let reqbody = req.body;
    console.log('Inside the storeMessage middleware!');
    console.log(reqbody);
    let newData = `"${reqbody.username}":"${reqbody.message}"`;

    // Read the existing data from the file
    fs.readFile('message.txt', 'utf8', (err, existingData) => {
        if (err) {
        console.error('Error reading the file:', err);
        return;
        }
    
        // Append the new data to the existing data
        const combinedData = existingData + newData;
        
    
        fs.writeFile('message.txt', combinedData, ()=>{
            console.log('message written to file'); 
            res.redirect('/showMessage'); 
        })
    })
})


router.get('/showMessage', (req, res, next) =>{
    let reqbody = req.body;
    console.log('Inside the showMessage middleware!');
    console.log(reqbody);
    //let msg = {${reqbody.username}: ${reqbody.message}};

    const storedUsername = localStorage.getItem('username');
    console.log(storedUsername); 
    
    fs.readFile('message.txt', 'utf8', (err, data)=>{
        if (err) {
            console.error('Error reading the file:', err);
            return;
          }
        
          // Process the data
        console.log(data);
        res.send(`<h2>${data}</h2><form action = "/storeMessage" method = "POST"><div><label for="name">Message : </label><input type = "text" name = "message" ><br><button type = "submit">Send message</button></div><input type = "hidden" name = "username" value = ${storedUsername}></form>`);
    });   
})


module.exports = router;