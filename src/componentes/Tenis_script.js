let cart = [];
let modalQt = 1;
let modalKey = 0;


// Retorna o item
const c = (e)=>document.querySelector(e)
// Retorna o array de itens
const sa = (el)=>document.querySelectorAll(el)

produtosJson.map((item, index)=>{

    //Analisar requisições
    console.log(item)

    let produtoItem = c('.models .produto-item').cloneNode(true);

    // Index do produto
    produtoItem.setAttribute('data-key', index);

    produtoItem.querySelector('.produto-item--img img').src = item.img
    produtoItem.querySelector('.produto-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //toFixed() mostra 2 casa após a vírgula
    produtoItem.querySelector('.produto-item--name').innerHTML = item.name;

    // Cancelar o evento de link da tag "a" e add o evento de click
    produtoItem.querySelector('a').addEventListener('click', (e)=> {

        // Blockeia o evento padrãon 
         e.preventDefault();

        let key = e.target.closest('.produto-item').getAttribute('data-key');
        // Analisar ações de itens
        console.log(produtosJson[key]);
        modalQt = 1;
        modalKey = key;

        c('.produtoInfo h1').innerHTML = produtosJson[key].name
        c('.produtoBig img').src = produtosJson[key].img
        c('.produtoInfo--actualPrice').innerHTML = `R$ ${produtosJson[key].price.toFixed(2)}`
        sa('.produtoInfo--size').forEach((size, sizeIndex)=>{

            size.querySelector('span').innerHTML = produtosJson[key].size[sizeIndex];

        })

        c('.produtoInfo--qt').innerHTML = modalQt

    //     // "Animação" ao mostrar o pop-up
        c('.produtoWindowArea').style.opacity = 0;

    //     // Mostra o pop-up
         c('.produtoWindowArea').style.display= 'flex';

        // Contagem da "animação" ao mostrar o pop-up
        setTimeout(()=>{
            c('.produtoWindowArea').style.opacity = 1;
        }, 30);

    });

    // Adicionar produto
    c('.produto-area').append(produtoItem);
});


function closeModal() {
    c('.produtoWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.produtoWindowArea').style.display = 'none';
    }, 500);
}

sa('.produtoInfo--cancelButton, .produtoInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})

c('.produtoInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.produtoInfo--qt').innerHTML = modalQt;
    }
});
c('.produtoInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.produtoInfo--qt').innerHTML = modalQt;
});
c('.produtoInfo--addButton').addEventListener('click', ()=>{

    // Qual o produto?
    // Verificar no console qual o produto está sendo add
    // console.log(`Produto ${modalKey}`)
    // Quantas unidades
    // console.log(`Quantidade ${modalQt}`)

    let identifier = produtosJson[modalKey].id+'@';

    let key = cart.findIndex((item)=>item.identifier == identifier)

    if(key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id:produtosJson[modalKey].id,
            qt:modalQt
        })
    }

    updateCart()
    closeModal()
})

c('.menu-openner').addEventListener('click', () => {
    c('aside').style.left = '0';
})

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
})

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let produtoItem = produtosJson.find((item)=>item.id == cart[i].id)
            subtotal += produtoItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true)

            cartItem.querySelector('img').src = produtoItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = produtoItem.name
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1 ) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            })

            
            c('.cart').append(cartItem)
        }
        // Casos de desconto
        // desconto = subtotal * 0.1;
        total = subtotal;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        //c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }
    else {
        c('aside').classList.remove('show')
    }   
}