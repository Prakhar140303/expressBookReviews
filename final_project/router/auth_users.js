const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bcrypt = require('bcrypt');
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;  
  return usernameRegex.test(username);
}

const authenticatedUser = async (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records with
  const user = users.find(u=>u.username===username);
  if(user && bcrypt.compare(password, user.password)){
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", async(req,res) => {
  //Write your code here
  try{
    const {username, password} =req.body;
    if(authenticatedUser(username, password)){
      const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1d' });
      return res.status(200).json({token});
    }
  }catch(err){
    return res.status(500).json({error: err.message});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try{
    const {isbn} = req.params;
    const {review} = req.body;
    if(!username){
      return res.status(401).json({message: "Unauthorized. Please login"});
    }
    if(!review){
      return res.status(400).json({message: "Review is required"});
    }
    const book = books.find(b=>b.isbn===isbn);
    if(!book){
      return res.status(404).json({message: "Book not found"});
    }
    books.reviews.push(review);
    res.status(201).json({
      success: true,
      message: book
    })
  }catch(err){
    return res.status(500).json({error: err.message});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
