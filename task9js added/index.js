const cart_items = document.querySelector('#cart .cart-items');


const sectioncont = document.getElementById('e-container');
sectioncont.addEventListener('click',(e)=>{

    if (e.target.className=='addtocart-button'){
        const id = e.target.parentNode.parentNode.id;
        console.log(id);
        const name = document.querySelector(`#${id} h3`).innerText;
        const imgurl = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
      let total_price  = document.querySelector('#total-value').innerText ;
      document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
      total_price  = parseFloat(total_price)+ parseFloat(price);
      total_price = total_price.toFixed(2)
      document.querySelector('#total-value').innerText  = `${total_price}`;
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${id}`);
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${imgurl}" alt="">
            <span>${name}</span>
    </span>
    <span class='cart-price cart-column'>${price}</span>
    <span class='cart-quantity cart-column'>
        <input type="text" value="1">
        <button>REMOVE</button>
    </span>`
    if (document.querySelector(`#in-cart-${id}`)){
        alert('This item is already added to the cart');
        return
    }
        cart_items.appendChild(cart_item)
        const container = document.getElementById('container');
         const box  = document.createElement('div');
         box.classList.add("cssadded");
                box.innerText = `Your product :${name} is Added to the cart`;
              container.append(box);
         setTimeout(() => {
            box.remove();
         }, 2000);

    }


    if ( e.target.className=='cart-btn' || e.target.className == 'cart-bottom'){
        document.querySelector('#cart').style = "display:block;"
    }
  if(e.target.className=='cancel'){
     document.querySelector('#cart').style  = "display:none;"

  }
  if (e.target.innerText=='REMOVE'){
    let total_price = document.querySelector('#total-value').innerText;
        total_price = parseFloat(total_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1;
    document.querySelector('#total-value').innerText = `${total_price.toFixed(2)}`
    e.target.parentNode.parentNode.remove()
}
   
})
