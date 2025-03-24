const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const bcrypt = require('bcrypt');
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async(req,res) => {
  try{
    const {username, password} =req.body;
    if(!username || !password){
      return res.status(400).json({message: "Username and password are required"});
    }
    
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if(!isValid(username)){
      return res.status(400).json({ message: "Invalid username. Only alphanumeric characters, underscores and hyphens are allowed." });
    }
    const salt =  await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    
    users.push({username :username,password :hashedPassword});
    return res.status(200).json({success: true,message : users.at(-1) });
  }catch(e){
    console.error(e);
    return res.status(500).json({success: "false",message: "An error occurred while registering user"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try{
    if(!books || books.length==0){
      return res.status(404).json({message: "No books found"});
    }
    return res.status(200).json({
      books: books
    });

  }catch(err){
    return res.status(500).json({message: "An error occurred while fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try{
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return  res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  }catch(err){
    return res.status(400).json({message: "An error occurred while fetching book details"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try{
    const author = req.params.author;
    const bookList = Object.values(books).filter(book => book.author === author);
    if (bookList.length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    } else {
      return res.status(200).json(bookList);
    }
  }catch(err){
    return res.status(400).json({message: "An error occurred while fetching book details"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try{
    //Write your code here
    const title = req.params.title;
    const bookList = Object.values(books).filter(book => book.title === title);
    if (bookList.length === 0) {
      return res.status(404).json({ message: "No books found by this title" });
    } else {
      return res.status(200).json(bookList);
    }

  }catch (err) {
    return res.status(400).json({ message: "An error occurred while fetching book details" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try{
    const isbn = req.params.isbn;
    const bookReviews = books[isbn].reviews;
    if (bookReviews.length === 0){
      return res.status(404).json({ message: "No reviews found for this book" });
    }else{
      return res.status(200).json(bookReviews);
    }
  }catch(err){
    return res.status(400).json({message: "An error occurred while fetching book reviews"});
  }
});

module.exports.general = public_users;
