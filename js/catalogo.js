const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const tipoFilter = document.getElementById("tipoFilter");
const precoMaxFilter = document.getElementById("precoMax");
const duracaoMinFilter = document.getElementById("duracaoMin");
const clearFiltersBtn = document.getElementById("clearFilters");

console.log("DEBUG [Catalogo]: Script Carregado - Versão 1.5 (Filtro Ativo)");

function populateTypes() {
  if (!tipoFilter) return;
  const types = [...new Set(products.map(p => p.tipo))].sort();
  tipoFilter.innerHTML = '<option value="">Todos os Tipos</option>'; // Reset
  types.forEach(tipo => {
    const option = document.createElement("option");
    option.value = tipo;
    option.textContent = tipo;
    tipoFilter.appendChild(option);
  });
}

function renderProducts(lista) {
  if (!productsContainer) return;
  productsContainer.innerHTML = "";

  if (lista.length === 0) {
    productsContainer.innerHTML = "<p class='no-results'>Nenhum resultado encontrado (ou todos estão reservados)</p>";
    return;
  }

  lista.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imagem}" alt="${product.nome}">
      <div class="product-info">
        <h3>${product.nome}</h3>
        <p>${product.preco}€/mês</p>
        <button onclick="verProduto(${product.id})">Ver Detalhes</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

window.verProduto = function(id) {
  window.location.href = `produto.html?id=${id}`;
};

function filterProducts() {
  console.log("DEBUG [Catalogo]: Executando filtragem...");
  
  const termo = searchInput ? searchInput.value.toLowerCase() : "";
  const tipo = tipoFilter ? tipoFilter.value : "";
  const precoMax = precoMaxFilter ? (parseFloat(precoMaxFilter.value) || Infinity) : Infinity;
  const duracaoMin = duracaoMinFilter ? (parseInt(duracaoMinFilter.value) || 0) : 0;

  // Obter reservas diretamente do localStorage para garantir frescura total
  let idsReservados = [];
  try {
    const data = localStorage.getItem("unirent_reservas_v1");
    if (data) {
      const reservas = JSON.parse(data);
      idsReservados = reservas.map(r => String(r.id));
    }
  } catch (e) {
    console.error("DEBUG [Catalogo]: Erro ao ler storage diretamente:", e);
  }
  
  console.log("DEBUG [Catalogo]: IDs Bloqueados (Reservados):", idsReservados);

  const filtrados = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(termo);
    const matchesTipo = tipo === "" || product.tipo === tipo;
    const matchesPreco = product.preco <= precoMax;
    const matchesDuracao = product.duracao >= duracaoMin;
    const naoEstaReservado = !idsReservados.includes(String(product.id));

    return matchesSearch && matchesTipo && matchesPreco && matchesDuracao && naoEstaReservado;
  });

  renderProducts(filtrados);
}

if (searchInput) searchInput.addEventListener("input", filterProducts);
if (tipoFilter) tipoFilter.addEventListener("change", filterProducts);
if (precoMaxFilter) precoMaxFilter.addEventListener("input", filterProducts);
if (duracaoMinFilter) duracaoMinFilter.addEventListener("input", filterProducts);

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    tipoFilter.value = "";
    precoMaxFilter.value = "";
    duracaoMinFilter.value = "";
    filterProducts();
  });
}

// Iniciar e também reagir quando a página ganha foco (ex: voltar atrás no browser)
document.addEventListener("DOMContentLoaded", () => {
  populateTypes();
  filterProducts();
});

window.addEventListener("focus", () => {
  console.log("DEBUG [Catalogo]: Página em foco, atualizando filtro...");
  filterProducts();
});