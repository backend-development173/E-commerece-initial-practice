const Product = require('../models/product');


const senditem=2;

exports.getProducts = (req, res, next) => {
  const page= (+req.query.page || 1);
  let total_items;
  Product.findAndCountAll({
    offset:(page-1)*senditem,
    limit:senditem
  })
  .then(response=>{
    total_items=response.count;
    res.status(200).json({
      totalItems: total_items,
      hasNextPage: (page*senditem<total_items),
      hasPreviousPage: page>1,
      currentPage:page,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:(Math.ceil(total_items/senditem)),
      products:response.rows

    })
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getProduct = (req,res,next)=>{
  const prodId=req.params.productId;
  console.log(prodId);
  Product.findByPk(prodId)
  .then((product)=>{
    res.render('shop/product-detail',{
      path:'/products',
      pageTitle:product.title,
      product:product
    })
  })
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then((products)=>{
  
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getCart = (req, res, next) => {
  // req.user.getCart()
  // .then((cart)=>{
  //   return cart.getProducts();
  // })
  // .then((products)=>{
  //     res.render('shop/cart', {
  //     path: '/cart',
  //     pageTitle: 'Your Cart',
  //     products:products

  //   });
  // })
  // .catch(err=>{
  //   console.log(err)
  // })
  const sendproduct=2
  let total_items;
  let fetchedCart;
  let all_products;
  let page= req.query.page || 1;
  req.user.getCart()
  .then((cart)=>{
      fetchedCart=cart
      return cart.countProducts()
  })
  .then((count)=>{
    total_items=count;
    return fetchedCart.getProducts();
  })
  .then((allProducts)=>{
    all_products=allProducts;
    return fetchedCart.getProducts({offset:(page-1)*sendproduct, limit:sendproduct})
  })
  .then(products=>{
    res.status(200).json({
      totalItems:total_items,
      allProducts:all_products,
      products:products,
      hasNextPage: (page*sendproduct<total_items),
      hasPreviousPage: page>1,
      currentPage:page,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:(Math.ceil(total_items/sendproduct))

    })
  })
  .catch(()=>{
    res.status(500).json({success:false,message:'can not extract from cart'})
  })

};

exports.postCart =(req, res, next) => {
  if(!req.body.productId)
  res.status(400).json({success:false, message: 'product id is missing'})
  const prodId=req.body.productId;
  let fetchedCart;
  req.user.getCart()
  .then((cart)=>{
      fetchedCart=cart;
      return cart.getProducts({where:{id:prodId}})  //  if cart have  product get that product by id and check if 
  })  
  .then((product)=>{
      product  = product[0];
      console.log("first",product)
      let newQuantity=1; 
      if(product){     // if product is  there already increase qty  by 1
        const oldQuantity=product.cartItem.quantity; 
        newQuantity=oldQuantity+1;
        return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})
      }
      else{
        Product.findByPk(prodId)
        .then((product)=>{
          return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})
        })
      }

  })
  .then(()=>{
    res.status(200).json({success:true,message:'Successfully added to the cart'})
  })
  .catch(err=>{
    res.status(500).json({success:false,message:'error occured while adding to the cart'})
  })

  //res.redirect('/cart');
}
// cart- item delete 
exports.postDelete=(req,res,next)=>{
  if(!req.body.productId)
  return res.status(400).json({success:false,message:'Product Id is missing'})
  const prodId=req.body.productId;
  req.user.getCart()
  .then((cart)=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then((products)=>{
    const product=products[0];
    product.cartItem.destroy();
    res.status(200).json({success:true, message: 'Successfully Deleted'})
    //res.redirect('/cart')
  })
  .catch(err=>{
    res.status(500).json({success:false,message:'error occured while deleting'})
  })
}
  

exports.postOrders  = (req,res)=>{
  let total_price=0;
  let orderId;
  let fetchedOrder;
  req.user.createOrder().then(order=>{
    console.log(order);
      fetchedOrder = order;
      orderId =order.id;
   return req.user.getCart().then(cart =>{
  
     return cart.getProducts()
   })
     .then(products=>{
    products.forEach((prod) =>{
        order.addProduct(prod,{through:{quantity:prod.cartItem.quantity}});
        total_price+=(prod.cartItem.quantity*prod.price)
                  prod.cartItem.destroy();
    })
  })
})
.then(()=>{
  fetchedOrder.set({amount:total_price})
  fetchedOrder.save()
  res.status(200).json({success:true, message: `Order successfully placed. Your Order Id:${orderId}`})
})
.catch((err)=>{
  console.log(err)
})

}


exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:[`products`]})
  .then((orders)=>{
    if(!orders)
    res.json({success:false,message:'No order Found'})
    else
    {
      res.status(200).json({success:true,orders:orders})
    }
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};