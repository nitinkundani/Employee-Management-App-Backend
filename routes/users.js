const express = require('express');
const router = express.Router();
var User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');
var ObjectId = require('mongoose').Types.ObjectId;

var DateObj = require('../models/date');
var DateObj2 = require('../models/date2');



    // http://localhost:8080/users
router.post('/register', function(req, res) {
    /* res.send("Hello");
    return; 
    console.log("Hello from Register employee");
    return; */
    let user = new User({
    email: req.body.email,
    username : req.body.username,
    password : req.body.password,
    name : req.body.name,
    role : req.body.role,
    dob : req.body.dob,
    salary: req.body.salary,
    });

    if(user.username == " " || user.password == " " || user.role == " " || user.name == " " || user.email == " " || user.dob == undefined)
    {
        return res.status(400).json({msg: 'The input fields should not be blank.'});
    }
    
        User.addUser(user, (err, user) => {
            if(err) {
                console.log(err);
                return res.status(501).json(err);
                //return res.status(501).json(err);
            } else {
                return res.status(201).json('User registered.');
            }
        
            
        }
    );
     
});


router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.status(400).json({msg: 'User with this E-mail not found'});    
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err)  { return res.status(501).json(err); }
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 28800
                });
                // {"token": token}
                res.status(200).json(token);
            }
            else{
                return res.status(400).json({msg: 'Wrong password'});    
            }
        });
    });
});

/* router.get('/employee/:username', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
}); */

//CRUD OPERATIONS

//Get list of employees
router.get('/employee', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.find({}, (err, docs) => {
        if(err){
            console.log('There was an error retriving the data '+err);
                    
        }
        else{
           
                    
                        res.send(docs);
                }
            });
    });

//To add employee after login
router.post('/employee' , passport.authenticate('jwt', {session: false}) , (req, res, next) => {
    //res.json({user: req.user});
    let newUser = new User({
        email: req.body.email,
        username : req.body.username,
        password : req.body.password,
        name : req.body.name,
        role : req.body.role,
        dob : req.body.dob,
        salary: req.body.salary,
        });

        if(newUser.username == " " || newUser.password == " " || newUser.role == " " || newUser.name == " " || newUser.email == " " || newUser.dob == new Date(1-1-1970) || newUser.salary == 0)
        {
        return res.status(400).json({msg: 'The input fields should not be blank.'});
        }
        
        User.addUser(newUser, (err, user) => {
            if(err) {
                console.log(err);
                return res.status(501).json(err);
                //return res.status(501).json(err);
            } else {
                return res.status(201).json('User registered.');
            }
        
            
        });
});

//Checking user details by username
router.get('/employee/:username', passport.authenticate('jwt', {session: false}), (req, res, next) => {

    User.getUserByUsername(req.params.username, (err, user) => {
    if (!err) { 
        res.status(200).json(user); 
    }
    else { 
        res.status(501).json({msg: 'Error in getting user details: '+ JSON.stringify(err, undefined, 2)}); 
    }
});
});

router.get('/employee/profile/:email', passport.authenticate('jwt', {session: false}), (req, res, next) => {

    User.getUserByEmail(req.params.email, (err, user) => {
    if (!err) { 
        res.status(200).json(user); 
    }
    else { 
        res.status(501).json({msg: 'Error in getting user details: '+ JSON.stringify(err, undefined, 2)}); 
    }
});
});

router.put('/employee/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    /* console.log("Hello from Update employee");
    return;  */

    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
            let updatedUser = {
                email: req.body.email,
                username : req.body.username,
                password : req.body.password,
                name : req.body.name,
                role : req.body.role, 
                dob : req.body.dob,
                salary: req.body.salary,
                };

                if(updatedUser.username == " " || updatedUser.password == " " || updatedUser.role == " " || updatedUser.name == " " || updatedUser.email == " " || updatedUser.dob == new Date(1-1-1970) || updatedUser.salary == 0)
                {
                return res.status(400).json({msg: 'The input fields should not be blank.'});
                }   

                User.findByIdAndUpdate(req.params.id, { $set: updatedUser }, { new: true }, (err, doc) => {
                    if (!err) { res.send(doc); }
                    else {  return res.status(501).json(err); }
                });

            /* User.updateUserByUsername(updatedUser, (err, doc) => {
                if (!err) { res.send(docs); }
                else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
            }); */
});

router.delete('/employee/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

        User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
    });

    /* User.deleteUserByUsername(req.params.username, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
    }); */
});

router.get('/date', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    DateObj.find({}, (err, docs) => {
        if(err){
            console.log('There was an error retriving the data '+err);
                    
        }
        else{
           
                    
                        res.send(docs);
                }
            });
    });

    router.get('/date2', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        DateObj2.find({}, (err, docs) => {
            if(err){
                console.log('There was an error retriving the data '+err);
                        
            }
            else{
               
                        
                            res.send(docs);
                    }
                });
        });



module.exports = router;

