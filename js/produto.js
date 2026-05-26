const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const product = products.find(p => p.id === productId);

const detalhe = document.getElementById("produtoDetalhe");

if(product) {
  detalhe.innerHTML = `
    <div class="product-detail-card">
      <img src="${product.imagem}" alt="${product.nome}">
      <div class="product-info">
        <h1>${product.nome}</h1>
        <p class="description">${product.descricao}</p>
        <div class="specs">
          <p><strong>Preço:</strong> ${product.preco}€/mês</p>
          <p><strong>Características:</strong> ${product.caracteristicas}</p>
          <p><strong>Dimensões:</strong> ${product.dimensoes}</p>
          <p><strong>Consumo:</strong> ${product.consumo}</p>
        </div>
        <button class="btn-reserve" id="btnReservar">Reservar Agora</button>
      </div>
    </div>
  `;

  document.getElementById("btnReservar").addEventListener("click", function() {
    console.log("DEBUG [Produto]: Clique no botão Reservar detetado para o produto ID:", product.id);
    
    const novaReserva = {
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      imagem: product.imagem,
      dataReserva: new Date().toLocaleDateString('pt-PT')
    };

    const sucesso = saveReserva(novaReserva);

    if (sucesso) {
      console.log("DEBUG [Produto]: Reserva guardada com sucesso.");
      alert("Sucesso! O equipamento foi reservado.");
      console.log("DEBUG [Produto]: Redirecionando para reservas em 500ms...");
      setTimeout(() => {
        window.location.href = "reservas.html";
      }, 500);
    } else {
      console.error("DEBUG [Produto]: Falha ao guardar reserva.");
      alert("Erro: Não foi possível guardar a reserva no seu navegador.");
    }
  });
} else {
  detalhe.innerHTML = "<h1>Produto não encontrado</h1>";
}