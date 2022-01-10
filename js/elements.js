var cart;
window.onload = function() {
  if (localStorage.getItem("cart") !== null) {
    const jsonCart = localStorage.getItem("cart");
    const objCart = JSON.parse(jsonCart);
    cart = new Cart(objCart.producto, objCart.gustos);
  } else {
    cart = new Cart({nombre: '', precio: 0.0});
  }

  $("#button-close-cart").html('<button onclick="closeCart()" class="buttonCloseCart"><h2>Finalizar compra <span id="price-cart"></span></h2></button>')
  $("#product-cart").text(`Helado ${cart.producto ? cart.producto.nombre : ''}`);
  if (cart.producto) {
    $("#price-cart").text(`$ ${cart.producto.precio}`);
  }
  
  let gustosHTML = cart.gustos.map(gusto => `<li>${gusto}</li>`).join('');
  $("#tastes-cart").html(gustosHTML);
  loadData();

}

function loadData() {
  $.get({
    url: "js/data.json" ,
    dataType: "json",
    success: function(contenidoJSON) {
      for(let i = 0; i < contenidoJSON.productos.length; i++) {
        const { nombre, precio } = contenidoJSON.productos[i];
        bindProduct(nombre, precio, cart.producto.nombre === nombre);
      }

      for(let i = 0; i < contenidoJSON.categoriasGustos.length; i++) {
        const { nombre, gustos } = contenidoJSON.categoriasGustos[i];
        bindTastes(nombre, gustos, cart.gustos);
      }
    },
  });
}

function closeCart() {
  cart.finalizarCompra()
  cart = new Cart();
  localStorage.removeItem('cart');
  location.reload();
}

function accBtn(e) {//Función para desplegar accordion

  console.dir(e.target.parentElement.nextElementSibling)
  const divOculto = e.target.parentElement.nextElementSibling
  console.log(divOculto)
  if (divOculto.classList.contains("show")) {
  divOculto.classList.remove("show");
  }
  else {
    divOculto.classList.toggle("show");
  }    
}

function bindTastes(nombre, gustos, gustosCarro) {//Función para crear accordion item
  const estaEnCarro = (gusto) => gustosCarro.findIndex(g => g === gusto) !== -1
  const listGustos = gustos.map((gusto) => `
    <li class="list-group-item">
      <input class="form-check-input me-1" type="checkbox" value="" ${estaEnCarro(gusto.nombre) ? 'checked' : ''} onchange="selectTaste('${gusto.nombre}')">
      ${gusto.nombre}
    </li>
  `);
  
  let accordionItem = `
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" onclick="accBtn(event)">${nombre}</button>
    </h2>
    <div class="accordion-collapse collapse">
      <div class="accordion-body">
        <ul class="list-group">${listGustos.join('')}</ul>
      </div>
    </div>
  </div>`
  $("#accordion-container").append(accordionItem);
}

function bindProduct(nombre, precio, enCarro) {//Función para crear raddio button

  let radioButton = `<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" ${enCarro ? 'checked' : ''} onchange="selectProduct('${nombre}', ${precio})">
  <label class="form-check-label" for="inlineRadio1">${nombre}</label>
  </div>`;
  $("#groupRadioButtons").append(radioButton);
}

function mostrarLog() {//Función para probar eventos
  console.log("Funciona el evento");
}

function selectTaste(nombreGusto) {
  // Alternar gusto del producto y guardar en localStorage
  cart.alternarGusto(nombreGusto);
  let gustosHTML = cart.gustos.map(gusto => `<li>${gusto}</li>`).join('');
  $("#tastes-cart").html(gustosHTML);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function selectProduct(nombre, precio) {
  // Agregar producto al carro y guardar en localStorage
  cart.producto = {nombre, precio};
  $("#product-cart").text(`Helado ${cart.producto.nombre}`);
  $("#price-cart").text(`$ ${cart.producto.precio}`);
  localStorage.setItem('cart', JSON.stringify(cart));
}