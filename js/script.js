

const cartBtn = document.querySelector(".fa-shopping-cart");
const cartOverlay = document.querySelector(".cart-overlay")
const cartDOM = document.querySelector(".cart2");
const closeCartBtn = document.querySelector(".close-btn");

cartBtn.addEventListener('click',()=>{
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart2");



});
  closeCartBtn.addEventListener("click",()=>{
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart2");
});
 




const CART = {
    KEY: 'cartProduct',
    contents: [],
    init(){
        //check localStorage and initialize the contents of CART.contents
        let _contents = localStorage.getItem(CART.KEY);
        if(_contents){
            CART.contents = JSON.parse(_contents);
           
        }/* else{
            //dummy test data
            CART.contents = [
                {id:1, title:'Apple', qty:5, itemPrice: 0.85},
                {id:2, title:'Banana', qty:3, itemPrice: 0.35},
                {id:3, title:'Cherry', qty:8, itemPrice: 0.05}
            ];
            CART.sync();
        } */
    },
    async sync(){
        let _cart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, _cart);
    }, 
    find(id){
        //find an item in the cart by it's id
        let match = CART.contents.filter(item=>{
            if(item.id == id)
                return true;
        });
        if(match && match[0])
            return match[0];
            
    },
    add(id){
        //add a new item to the cart
        //check that it is not in the cart already
        if(CART.find(id)){
            CART.increase(id);
        }else{
            let arr = PRODUCTS.filter(product=>{
                if(product.id == id){
                    return true;
                }
            });
            if(arr && arr[0]){
                let obj = {
                    id: arr[0].id,
                    title: arr[0].title,
                    qty: 1,
                    price: arr[0].price,
                    desc: arr[0].desc,
                    img:arr[0].img
                };
                CART.contents.push(obj);
                //update localStorage
                CART.sync();
                
            }else{
                //product id does not exist in products data
                console.error('Invalid Product');
            }
        }

     inc();
    },
    increase(id){
        //increase the quantity of an item in the cart
        CART.contents = CART.contents.map(item=>{
            if(item.id === id)
                item.qty = item.qty + 1;
                
            return item;
        });
        //update localStorage
        CART.sync()
    },
    reduce(id){
        //reduce the quantity of an item in the cart
        CART.contents = CART.contents.map(item=>{
            if(item.id === id)
                item.qty = item.qty - 1;
                
            return item;
        });
        CART.contents.forEach(async item=>{
            if(item.id === id && item.qty === 0)
                await CART.remove(id);
        });
        //update localStorage
        CART.sync()
    },
    remove(id){
        //remove an item entirely from CART.contents based on its id
        CART.contents = CART.contents.filter(item=>{
            if(item.id !== id)
                return true;
        });
        //update localStorage
        CART.sync()
    },
    empty(){
        //empty whole cart
        CART.contents = [];
        //update localStorage
        CART.sync()
    },
    sort2(field){
        //sort by field - title, price
        //return a sorted shallow copy of the CART.contents array
        /* let sorted = CART.contents.sort((a,b)=>{
            if(a[field]< b[field]){
                return -1;
               
            }else if(a[field]> b[field]){
                return 1;
            }else{
                return 0;
            }
        }); */
        let sorted = CART.contents;
        return sorted;
       // return sorted.reverse();
        //NO impact on localStorage
    },

    logContents(prefix){
        console.log(prefix, CART.contents)
    }
};

let PRODUCTS = [];

document.addEventListener('DOMContentLoaded', ()=>{
    //when the page is ready
    getProducts( showProducts, errorMessage );
    //get the cart items from localStorage
    CART.init();
    //load the cart items
    showCart();
    updateCart2();
});

function showCart(){
    updateCart2();
    let products_incart = document.querySelector('.products-incart');
    let cart_no = document.querySelector('.cart_no');
    let imgPath = './images/';
    products_incart.innerHTML = '';
  //  console.log('in side  show cart function');cart_no
    let sorted2 = CART.sort2('qty');
    //cart_no.innerHTML
    sorted2.forEach( item =>{
        // totalcount+=item.qty;
        let product_div= document.createElement('div');
        product_div.className = 'product1';
       

        let image_div = document.createElement('div');
        image_div.className = 'product-image-incart';
        
       
        let image_tag = document.createElement('img');
        image_tag.className = 'item-img';
        image_tag.src=imgPath+item.img;
        image_tag.alt=item.title;
        image_div.appendChild(image_tag);

        product_div.appendChild(image_div);

        /*  image of product  */
        let product_info_div = document.createElement('div');
        product_info_div.className = 'product-info-incart';
       

        /*  name of product  */
        let product_name_p = document.createElement('p');
        product_name_p.textContent=item.title;
        product_info_div.appendChild(product_name_p);

         /*  description of product  */
        let product_desc_p = document.createElement('p');
        product_desc_p.textContent=item.desc;
        product_info_div.appendChild(product_desc_p);
    
         /*  price of product  */
        let product_price_p = document.createElement('p');
        let cost = new Intl.NumberFormat('en-CA', 
        {style: 'currency', currency:'CAD'}).format(item.qty * item.price);
        product_price_p.textContent=cost;
        product_info_div.appendChild(product_price_p);

         /*  controls of product  */
        let controls_div = document.createElement('div');
        controls_div.className='span-div';
        product_info_div.appendChild(controls_div);
      
          /*  decrement of product  */
        let product_minus = document.createElement('i');
        product_minus.className='fa fa-minus';
        product_minus.ariaHidden='true';
        product_minus.setAttribute('data-id', item.id)
        product_minus.addEventListener('click', decrementCart)
        controls_div.appendChild(product_minus);

          /*  product_qty of product  */
        let product_qty = document.createElement('span');
        product_qty.textContent=item.qty
        controls_div.appendChild(product_qty);
      
        /*  increment of product  */
        let product_plus = document.createElement('i');
        product_plus.className='fa fa-plus';
        product_plus.ariaHidden='true';
        product_plus.setAttribute('data-id', item.id);
        product_plus.addEventListener('click', incrementCart);
        controls_div.appendChild(product_plus);
     
        product_div.appendChild(product_info_div);
        products_incart.appendChild(product_div);
    })
}

function incrementCart(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.increase(id);
  /*   let controls = ev.target.parentElement;
    let qty = controls.querySelector('span:nth-child(1)');
    let item = CART.find(id);
    if(item){
        qty.textContent += item.qty;
    }else{
        document.getElementById('product1').removeChild(controls.parentElement);
    } */
    inc();
    showCart();
    
}

function decrementCart(ev){
   
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.reduce(id);
  /*   let controls = ev.target.parentElement;
    let qty = controls.querySelector('span');
    console.log(qty)
    let item = CART.find(id);
    if(item){
        qty.textContent -= item.qty;
    }else{
        document.getElementById('product1').removeChild(controls.parentElement);
    } */
    dec();
    showCart()
}

function getProducts(success, failure){
    //request the list of products from the "server"
    const URL = "./products-1.json?";
    fetch(URL, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response=>response.json())
    .then(showProducts)
    .catch(err=>{
        errorMessage(err.message);
    });
}

function showProducts( products ){
    PRODUCTS = products;
    //take data.products and display inside <section id="products">
    let imgPath = './images/';
    let box_container = document.querySelector('.box-container');
    box_container.innerHTML = "";
    products.forEach(product=>{
      //  let card = document.createElement('div');
       // card.className = 'box-container';

        let box = document.createElement('div');
        box.className = 'box';
        box.classList.add('vivify');  
        box.classList.add('fadeInTop');
        box.classList.add('duration');
        box.classList.add('4000');
        let img_div = document.createElement('div');
        img_div.className = 'image';

        //add the image to the card
        let img = document.createElement('img');
        img.alt = product.title;
        img.src = imgPath + product.img;
        img_div.appendChild(img);
    
         
        let icon_div = document.createElement('div');
        icon_div.className = 'icons';

     
        let btn_add_cart = document.createElement('a');
        btn_add_cart.className = 'cart-btn';
        btn_add_cart.textContent='Add To Cart';
        btn_add_cart.setAttribute('data-id', product.id);
        btn_add_cart.addEventListener('click', addItem);
        icon_div.appendChild(btn_add_cart);

        img_div.appendChild(icon_div);
        box.appendChild(img_div);

        let content_div = document.createElement('div');
        content_div.className = 'content';
    
        let product_name = document.createElement('h3');
        product_name.textContent=product.title;
        content_div.appendChild(product_name);

        let product_desc = document.createElement('h2');
        product_desc.textContent=product.desc;
        content_div.appendChild(product_desc);


        let price_div = document.createElement('div');
        price_div.className = 'price2';

        let price_span = document.createElement('span');
        let cost = new Intl.NumberFormat('en-CA', 
        {style:'currency', currency:'CAD'}).format(product.price);
        price_span.textContent=cost;
        price_div.appendChild(price_span);

        content_div.appendChild(price_div);

        box.appendChild(content_div);
        box_container.appendChild(box);
        
    })
}

function addItem(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
   // console.log('add to cart item', id);
    CART.add(id);
    showCart();
}

function errorMessage(err){
    //display the error message to the user
    console.error(err);
}
function updateCart2(){
    
    let cart_no2 = document.getElementById('cart_no');
    let no=localStorage.getItem('cart_no2');
    if(no && parseInt(no)>0){
            cart_no2.textContent=no;
           
    
    }else{
        localStorage.setItem('cart_no2',0);
        cart_no2.textContent='';
    }
    

}

function inc(){
    let no2=localStorage.getItem('cart_no2');
    no2=parseInt(no2);
    no2+=1;
    localStorage.setItem('cart_no2',no2);
    updateCart2();
}

function dec(){
    let no2=localStorage.getItem('cart_no2');
    no2=parseInt(no2);
    no2-=1;
    localStorage.setItem('cart_no2',no2);
    updateCart2();
}

















