var express = require('express');
var router  = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

router.get('/add/:id', (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if(err){
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    console.log(req.session.cart);
    return res.redirect('/');
  })
});

router.get('/', (req, res, next)=> {
if(!req.session.cart){
  return res.render('shop/shopping-cart', {products: null});
}

var cart = new Cart(req.session.cart);
res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout',(req, res, next)=>{
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout',{total: cart.totalPrice});
});

module.exports = router;
