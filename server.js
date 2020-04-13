'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 4000 ;
const cors = require('cors');
const superagent = require('superagent');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');

app.use(express.static(__dirname + './public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) =>{
  res.render('./pages/index');
});


app.get('/search/new',(req,res)=>{
  res.render('searches/new');
});
// app.get('/search/new',(req,res)=>{
//   res.render('searches/new', req.body);
// });

app.post('/search', (req, res) => {
  let bookarr = [];
  let url;
  if (req.body.search === 'title'){
    url = `https://www.googleapis.com/books/v1/volumes?q=search+intitle:${req.body.catagory}`;
  }else if (req.body.search === 'author') {
    url = `https://www.googleapis.com/books/v1/volumes?q=search+inauthor:${req.body.catagory}`;
  }
  superagent.get(url)
    .then(data =>{
      data.body.items.map( element =>{
        const book= new Book(element);
        bookarr.push(book);
      });
      res.render('searches/show' , {search:bookarr});
    });
});


function Book(details){
  this.img = details.volumeInfo.imageLinks.smallThumbnail;
  this.title = details.volumeInfo.title;
  this.authors = details.volumeInfo.authors;
  this.description = details.volumeInfo.description;
  Book.all.push(this);
}
Book.all = [];

app.get('*',(req,res)=>{
  res.status(404).send('Not found');
});

app.listen(PORT, () => console.log(`up and running on port ${PORT}`));
