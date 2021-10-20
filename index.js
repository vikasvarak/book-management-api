require("dotenv").config();

// express
const express = require("express");

// mongoose
const mongoose = require("mongoose");

//body parser
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

// models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// connection
mongoose.connect(process.env.MONGO_URL, 
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then( () => console.log("connection established"));


/******************* GET method **********************/

/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json(getSpecificBook);
});


/*
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/

booky.get("/c/:category", async (req,res) => {
  const getSpecificBook =  await BookModel.findOne({category: req.params.category});

  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.category}`});
  }

  return res.json(getSpecificBook);
});

/*
Route            /d
Description      get a list of books based on languages
Access           PUBLIC
Parameter        language
Methods          GET
*/
 
booky.get("/d/:language", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({language: req.params.language});

    if(!getSpecificBook){
        return res.json({error: `No book found for language ${req.params.language}`});
    }
    return res.json(getSpecificBook);
});


/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/author", async (req,res) => {
  const getAllAuthor =  await AuthorModel.find();
  return res.json(getAllAuthor);
});

/*
Route            /author/is
Description      get a specific author based on id
Access           PUBLIC
Parameter        id
Methods          GET
*/

booky.get("/author/is/:id", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id : parseInt(req.params.id)});
  
    if(!getSpecificAuthor) {
      return res.json({error: `No author found for the id of ${req.params.id}`});
    }
  
    return res.json(getSpecificAuthor);
  });



/*
Route            /author/book
Description      Get all authors based on book
Access           PUBLIC
Parameter        isbn
Methods          GET
*/



booky.get("/author/book/:isbn", async (req,res) => {
  const getSpecificAuthor =  await AuthorModel.findOne({books: req.params.isbn});

  if(!getSpecificAuthor){
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json(getSpecificAuthor);
});

/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/publications", async (req,res) => {
  const getAllPublication = await PublicationModel.find();
  return res.json(getAllPublication);
})


/*
Route            /p
Description      Get specific publications
Access           PUBLIC
Parameter        name
Methods          GET
*/

booky.get("/p/:name", async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({name: req.params.name});
  
    if(!getSpecificPublication) {
      return res.json({error: `No publication found for the name of ${req.params.name}`});
    }
  
    return res.json(getSpecificPublication);
  });

  /*
Route            /publication/book
Description      get a list of publications based on a book
Access           PUBLIC
Parameter        name
Methods          GET
*/

booky.get("/publiction/book/:isbn", async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({books: req.params.isbn});
    if(!getSpecificPublication){
      return res.json({
        error: `No publication found for the book of ${req.params.isbn}`
      });
    }
    return res.json(getSpecificPublication);
  });


  /***************** POST ************************/ 

    /*
Route            /book/new
Description      add new book
Access           PUBLIC
Parameter        none
Methods          POST
*/

booky.post("/book/new", async (req,res) => {
  const {newBook} = req.body;
  const addNewBook = await BookModel.create(newBook);
  return res.json({
    books:addNewBook,
    message: "book was added !!!"
  });
});

    /*
Route            /auhtor/new
Description      add new author
Access           PUBLIC
Parameter        none
Methods          POST
*/

booky.post("/author/new", async (req,res) => {
  const {newAuthor} = req.body;
  const addNewAuthor = await AuthorModel.create(newAuthor);
  return res.json({
    authors : addNewAuthor,
    message: "author was added !!!"
  });
});

    /*
Route            /publication/new
Description      add new publication
Access           PUBLIC
Parameter        none
Methods          POST
*/

booky.post("/publication/new", async (req,res) => {
  const {newPublication} = req.body;
  const addNewPublication = await PublicationModel.create(newPublication);
  return res.json({
    publication : addNewPublication,
    message: "publication was added !!!"
  });
});



/**************** PUT method ******************/

/*
Route            book/update
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/book/update/:isbn", async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN : req.params.isbn
    },
    {
      title : req.body.bookTitle
    },
    {
      new: true
    }
  );
  return res.json({
    books: updatedBook
  });
});

/****** updating new author ********/
/*
Route            book/update
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/author/update/:isbn", async (req,res) => {
  //update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN : req.params.isbn
    },
    {
      $addToSet : {
        author: req.body.newAuthor
      }
    },
    {
      new:true
    }
  );

  // update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet : {
        books : req.params.isbn
      }
    },
    {
      new: true
    }
  );
  return res.json(
    {
      books:updatedBook,
      author: updatedAuthor,
      message: "new author was added"
    }
  )
  
});



/***************DELETE method *************/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN : req.params.isbn
    }
  );
  return res.json(
    {
      books: updatedBookDatabase
    }
  );

  });

  booky.listen(3000, () => {
    console.log("server is up and running");
  });

