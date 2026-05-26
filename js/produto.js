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
          <p><strong>Preço Base:</strong> ${product.preco}€/mês</p>
          <p><strong>Características:</strong> ${product.caracteristicas}</p>
        </div>
        
        <div class="reservation-form">
          <div class="form-group">
            <label for="dataInicio">Data de Início:</label>
            <input type="date" id="dataInicio" min="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label for="duracaoPredefinida">Duração:</label>
            <select id="duracaoPredefinida">
              <option value="personalizado">Personalizado</option>
              <option value="1semana">1 Semana</option>
              <option value="1mes">1 Mês</option>
              <option value="1semestre">1 Semestre (5 meses)</option>
              <option value="1ano">1 Ano Letivo (10 meses)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="dataFim">Data de Fim:</label>
            <input type="date" id="dataFim">
          </div>
          
          <div id="priceCalculator" class="price-summary" style="display:none;">
            <p>Duração: <span id="resumoDuracao">-</span></p>
            <p>Preço Total: <span id="resumoPreco">-</span>€</p>
          </div>

          <button class="btn-reserve" id="btnReservar" disabled>Reservar Agora</button>
        </div>
      </div>
    </div>

    <!-- Modal de Resumo -->
    <div id="modalResumo" class="modal" style="display:none;">
      <div class="modal-content">
        <h2>Resumo da Reserva</h2>
        <div id="detalhesResumo"></div>
        <div class="modal-actions">
          <button id="btnConfirmarFinal" class="btn">Confirmar e Pagar</button>
          <button id="btnCancelarModal" class="btn btn-secondary">Voltar</button>
        </div>
      </div>
    </div>
  `;

  const inputInicio = document.getElementById("dataInicio");
  const inputFim = document.getElementById("dataFim");
  const selectDuracao = document.getElementById("duracaoPredefinida");
  const btnReservar = document.getElementById("btnReservar");
  const priceCalculator = document.getElementById("priceCalculator");

  function atualizarDataFim() {
    if (!inputInicio.value) return;
    
    const inicio = new Date(inputInicio.value);
    let fim = new Date(inicio);

    switch (selectDuracao.value) {
      case "1semana":
        fim.setDate(inicio.getDate() + 7);
        break;
      case "1mes":
        fim.setMonth(inicio.getMonth() + 1);
        break;
      case "1semestre":
        fim.setMonth(inicio.getMonth() + 5);
        break;
      case "1ano":
        fim.setMonth(inicio.getMonth() + 10);
        break;
      default:
        return; // No change for "personalizado"
    }

    inputFim.value = fim.toISOString().split('T')[0];
    calcularPreco();
  }

  function calcularPreco() {
    const inicio = new Date(inputInicio.value);
    const fim = new Date(inputFim.value);

    if (inputInicio.value && inputFim.value) {
      if (fim <= inicio) {
        document.getElementById("resumoDuracao").textContent = "Data inválida (Fim deve ser após Início)";
        document.getElementById("resumoDuracao").style.color = "red";
        document.getElementById("resumoPreco").textContent = "-";
        btnReservar.disabled = true;
        return null;
      }

      const diffTime = Math.abs(fim - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const meses = (diffDays / 30).toFixed(1);
      const precoTotal = (meses * product.preco).toFixed(2);

      document.getElementById("resumoDuracao").textContent = `${diffDays} dias (~${meses} meses)`;
      document.getElementById("resumoDuracao").style.color = "inherit";
      document.getElementById("resumoPreco").textContent = precoTotal;
      priceCalculator.style.display = "block";
      btnReservar.disabled = false;
      return { diffDays, meses, precoTotal };
    } else {
      priceCalculator.style.display = "none";
      btnReservar.disabled = true;
      return null;
    }
  }

  inputInicio.addEventListener("change", () => {
    atualizarDataFim();
    calcularPreco();
  });
  inputFim.addEventListener("change", () => {
    selectDuracao.value = "personalizado";
    calcularPreco();
  });
  selectDuracao.addEventListener("change", atualizarDataFim);

  btnReservar.addEventListener("click", function() {
    const dados = calcularPreco();
    if (!dados) return;

    const modal = document.getElementById("modalResumo");
    const detalhes = document.getElementById("detalhesResumo");
    
    detalhes.innerHTML = `
      <p><strong>Equipamento:</strong> ${product.nome}</p>
      <p><strong>De:</strong> ${inputInicio.value}</p>
      <p><strong>Até:</strong> ${inputFim.value}</p>
      <p><strong>Duração:</strong> ${dados.diffDays} dias</p>
      <p><strong>Preço Total:</strong> ${dados.precoTotal}€</p>
    `;
    
    modal.style.display = "flex";
  });

  document.getElementById("btnCancelarModal").onclick = () => {
    document.getElementById("modalResumo").style.display = "none";
  };

  document.getElementById("btnConfirmarFinal").onclick = () => {
    const dados = calcularPreco();
    const duracaoTexto = selectDuracao.options[selectDuracao.selectedIndex].text;
    const novaReserva = {
      id: product.id,
      nome: product.nome,
      preco: dados.precoTotal,
      imagem: product.imagem,
      dataInicio: inputInicio.value,
      dataFim: inputFim.value,
      duracaoDias: dados.diffDays,
      duracaoLabel: duracaoTexto,
      dataRegisto: new Date().toLocaleDateString('pt-PT'),
      estado: "Ativa"
    };

    if (saveReserva(novaReserva)) {
      alert("Reserva efetuada com sucesso!");
      window.location.href = "reservas.html";
    } else {
      alert("Erro ao processar reserva.");
    }
  };

} else {
  detalhe.innerHTML = "<h1>Produto não encontrado</h1>";
}