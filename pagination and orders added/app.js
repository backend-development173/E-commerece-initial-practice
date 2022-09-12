const path = require('path');

const express = require('express');
const cors=require('cors')
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize=require('./util/database');
const Product=require('./models/product');
const User=require('./models/user')
const Cart=require('./models/cart')
const CartItem=require('./models/cart-item')
const Order = require('./models/order');
const orderItem  = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user)=>{
        req.user=user;
        next();
    })                           // this one middleware runs only for incomming request 
    .catch(err=>{
        console.log(err)
    })
})


app.use('/admin', adminRoutes);  // registered routes for the admin model 
app.use(shopRoutes);  //  registered routes for the shop model 


app.use(errorController.get404);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})
User.hasMany(Order)
Order.belongsTo(User)
Product.belongsToMany(Order,{through:orderItem})
Order.belongsToMany(Product,{through:orderItem})

sequelize.sync()            // this one run at npm start and registered user ,  creating table for the user 
    .then(()=>{
        return User.findByPk(1)
    })
    .then((user)=>{
    if(!user){
       return User.create({
                        name:'sunil',
                        email:'sunilrana1730@gmai.com'
                })
            }
            else
            return user;

        })
    .then((user)=>{
            user.getCart()
            .then(cart=>{
                if(!cart)
                return user.createCart()
                else
                return cart;
            })
            .catch(err=>{
                console.log(err)
            })
            
        })
    .then((cart)=>{
            app.listen(4000)
        })
    .catch(err=>{
        console.log(err)
    })