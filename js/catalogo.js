const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const tipoFilter = document.getElementById("tipoFilter");
const precoMaxFilter = document.getElementById("precoMax");
const duracaoMinFilter = document.getElementById("duracaoMin");
const clearFiltersBtn = document.getElementById("clearFilters");

// Dynamic types population
function populateTypes() {
  const types = [...new Set(products.map(p => p.tipo))].sort();
  types.forEach(tipo => {
    const option = document.createElement("option");
    option.value = tipo;
    option.textContent = tipo;
    tipoFilter.appendChild(option);
  });
}

function renderProducts(lista) {
  productsContainer.innerHTML = "";

  if (lista.length === 0) {
    productsContainer.innerHTML = "<p class='no-results'>Nenhum resultado encontrado</p>";
    return;
  }

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

function filterProducts() {
  const termo = searchInput.value.toLowerCase();
  const tipo = tipoFilter.value;
  const precoMax = parseFloat(precoMaxFilter.value) || Infinity;
  const duracaoMin = parseInt(duracaoMinFilter.value) || 0;

  const filtrados = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(termo);
    const matchesTipo = tipo === "" || product.tipo === tipo;
    const matchesPreco = product.preco <= precoMax;
    const matchesDuracao = product.duracao >= duracaoMin;

    return matchesSearch && matchesTipo && matchesPreco && matchesDuracao;
  });

  renderProducts(filtrados);
}

searchInput.addEventListener("input", filterProducts);
tipoFilter.addEventListener("change", filterProducts);
precoMaxFilter.addEventListener("input", filterProducts);
duracaoMinFilter.addEventListener("input", filterProducts);

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  tipoFilter.value = "";
  precoMaxFilter.value = "";
  duracaoMinFilter.value = "";
  renderProducts(products);
});

// Initial setup
populateTypes();
if (products.length === 0) {
    productsContainer.innerHTML = "<p class='no-results'>Nenhum eletrodoméstico disponível</p>";
} else {
    renderProducts(products);
}