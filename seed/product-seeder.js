var Product = require('../models/product');
var mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
}


const products = [
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


const connectWithRetry = () => {
  console.log('MongoDB connection with retry product')
  mongoose.connect("mongodb://mongo:27017/shopping", options).then(async ()=>{
    console.log('MongoDB is connected')
    var productsCount = await Product.count()
    console.log("Products Count:"+productsCount);
    if(!(productsCount > 0)){
      var done=0;
      for (let i=0; i < products.length; i++){
        products[i].save(function(err,result) {
        done++;
        if (done === products.length) {
          mongoose.disconnect();
        }
      })
    }
  }
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
}

module.exports =  connectWithRetry