const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");

function renderProducts(lista) {
  productsContainer.innerHTML = "";

  lista.forEach(product => {
    productsContainer.innerHTML += `
      <div class="product-card">
        <img src="${product.imagem}" alt="${product.nome}">

        <div class="product-info">
          <h3>${product.nome}</h3>
          <p>${product.preco}€/mês</p>

          <button onclick="verProduto(${product.id})">
            Ver Detalhes
          </button>
        </div>
      </div>
    `;
  });
}

function verProduto(id) {
  window.location.href = `produto.html?id=${id}`;
}

searchInput.addEventListener("input", () => {
  const termo = searchInput.value.toLowerCase();

  const filtrados = products.filter(product =>
    product.nome.toLowerCase().includes(termo)
  );

  renderProducts(filtrados);
});

renderProducts(products);