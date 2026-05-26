const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const product = products.find(p => p.id === productId);

const detalhe = document.getElementById("produtoDetalhe");

if(product) {
  detalhe.innerHTML = `
    <div class="product-card">
      <img src="${product.imagem}" alt="${product.nome}">

      <div class="product-info">
        <h1>${product.nome}</h1>
        <p>${product.descricao}</p>
        <p><strong>${product.preco}€/mês</strong></p>

        <button onclick="reservarProduto()">
          Reservar
        </button>
      </div>
    </div>
  `;
}

function reservarProduto() {
  saveReserva({
    id: product.id,
    nome: product.nome,
    preco: product.preco
  });

  alert("Reserva efetuada com sucesso!");

  window.location.href = "reservas.html";
}