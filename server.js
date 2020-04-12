'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 4000 ;
const cors = require('cors');
const superagent = require('superagent');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) =>{
  res.render('pages/index');
});


app.get('/search/show',(req,res)=>{
  res.render('pages/searches/show');
});

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
      res.send(bookarr);
    });
});


function Book(details){
  this.img = details.volume.imageLinks.smallThumbnail;
  this.title = details.volume.title;
  this.authors = details.volume.authors;
  this.description = details.volume.description;
  Book.all.push(this);
}
Book.all = [];

app.get('*',(req,res)=>{
  res.status(404).send('Not found');
});

app.listen(PORT, () => console.log(`up and running on port ${PORT}`));
