//criando constatens para seleção de itens
let modalQt = 1;



const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);

// mapenado JSON
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Chamando as informações para o modal

    pizzaItem.setAttribute('data-key', index);
    
    
    
    //Alterando as infos exibidas na tela
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    // Criando evento de Clique do Modal 

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        //Continuando as informações do modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

       
        //Preenchendo as informações no modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        
        //Deixando a Pizza Grande sempre selecionada

        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
                if (sizeIndex == 2){
                    size.classList.add('selected');
                }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });


        // Adicionando a função de quantidade
        modalQt = 1;
        modalKey = key;

        c('.pizzaInfo--qt').innerHTML = modalQt;

      
        //Mudando a apresentação do estilo do modal

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = '1';

        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
});



  //Adicionando a Função de Voltar ou Cancelar
    function closeModal() {
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(()=>{
            c('.pizzaWindowArea').style.display = 'none';
        }, 500)
    }

    cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click', closeModal);
    });

    //Botões de Quantidade de Item

    c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
        if (modalQt >1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;}
    });

    c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    });

    //Selecionando os tamanhos

    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
       size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

       });
});

    //Carrinho de compras
    let cart = [];
    let modalKey = 0;    
    
    c('.pizzaInfo--addButton').addEventListener('click', ()=>{
        //Qual o Tamanho?
        let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
        //Agrupando itens no carrinho
        let identifier = pizzaJson[modalKey].id+'@'+size;
        // Verificar e adicionar Pizza
        let key = cart.findIndex((item)=>item.identifier == identifier);
        if (key > -1) {
            cart[key].qt += modalQt;

        } else {
         //Quantidade?
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
        closeModal();
        updateCart();
  });


//Carrinho mobile abrir

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0 ){
        c('aside').style.left = '0';
    } 
});


//Ação do fechamento no mobile
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});



  // Manipulando os preços no carrinho
  function updateCart(){

    //Carrinho do Mobile
    c('.menu-openner span').innerHTML = cart.length;



      if(cart.length > 0){
          c('aside').classList.add('show');
          c('.cart').innerHTML = '';
            let subtotal = 0;  
            let desconto = 0;
            let total = 0;    





          for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            
            subtotal += pizzaItem.price  * cart [i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                break;

                case 1:
                    pizzaSizeName = 'M';
                break;

                case 2:
                    pizzaSizeName = 'G';
                break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; 

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                cart[i].qt--;}
                else {cart.splice(i,1)};
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });            
            
            c('.cart').append(cartItem);        
          }

          desconto = subtotal * 0.1;
          total = subtotal - desconto;

          c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
          c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
          c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;  



      } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }           
  };