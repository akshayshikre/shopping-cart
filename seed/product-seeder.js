var Product = require('../models/product').default;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping',{ useNewUrlParser: true });

var products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D.jpg',
    title: 'Car',
    description: 'Awesome car !!!',
    price: 13,
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D.jpg',
    title: 'Car',
    description: 'Awesome car !!!',
    price: 14,
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D.jpg',
    title: 'Car',
    description: 'Awesome car !!!',
    price: 15,
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D.jpg',
    title: 'Car',
    description: 'Awesome car !!!',
    price: 16,
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D.jpg',
    title: 'Car',
    description: 'Awesome car !!!',
    price: 17,
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/14/2018_Tesla_Model_S_75D.jpg',
    title: 'Car',
    description: 'Awesome car !!!',
    price: 18,
  })
]
var done=0;
for (let i=0; i < products.length; i++){
  products[i].save(function(err,result) {
    done++;
    if (done === products.length) {
      mongoose.disconnect();
    }
  })
  
}
