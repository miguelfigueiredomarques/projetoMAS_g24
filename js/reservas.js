const reservasLista = document.getElementById("reservasLista");

function renderReservas() {
  if (!reservasLista) return;

  const reservas = getReservas();

  if(reservas.length === 0) {
    reservasLista.innerHTML = `
      <div class="empty-reservas">
        <p>Ainda não tem nenhum equipamento reservado.</p>
        <a href="catalogo.html" class="btn">Explorar Catálogo</a>
      </div>
    `;
  } else {
    let html = "";
    reservas.forEach((reserva) => {
      const isAtiva = reserva.estado === "Ativa";
      let statusClass = "status-ativa";
      if (reserva.estado === "Cancelada") statusClass = "status-cancelada";
      if (reserva.estado === "Finalizada") statusClass = "status-finalizada";
      
      html += `
        <div class="reserva-item ${reserva.estado !== 'Ativa' ? 'reserva-inativa' : ''}">
          <img src="${reserva.imagem}" alt="${reserva.nome}">
          <div class="reserva-detalhes">
            <h3>${reserva.nome} <span class="badge ${statusClass}">${reserva.estado}</span></h3>
            <p class="reserva-meta">Início: ${reserva.dataInicio} | Fim: ${reserva.dataFim}</p>
            <p class="reserva-meta">Duração: ${reserva.duracaoLabel || reserva.duracaoDias + ' dias'}</p>
            <p class="reserva-preco">Total: ${reserva.preco}€</p>
          </div>
          <div class="reserva-actions">
            ${isAtiva ? `
              <button class="btn-extend" onclick="openProlongar('${reserva.id_reserva}')">Prolongar</button>
              <button class="btn-finalize" onclick="handleFinalizar('${reserva.id_reserva}')">Finalizar</button>
              <button class="btn-remove" onclick="handleCancelar('${reserva.id_reserva}')">Cancelar</button>
            ` : `
              <button class="btn-secondary" onclick="handleEliminar('${reserva.id_reserva}')">Eliminar Registo</button>
            `}
          </div>
        </div>
      `;
    });
    reservasLista.innerHTML = html;
  }
}

// --- FINALIZAÇÃO ---
window.handleFinalizar = function(id) {
  if(confirm("Deseja marcar esta reserva como finalizada? (Simula a entrega do equipamento)")) {
    const sucesso = finalizeReserva(id);
    if (sucesso) {
      alert("Reserva finalizada com sucesso!");
      renderReservas();
    } else {
      alert("Erro ao finalizar a reserva.");
    }
  }
}

// --- CANCELAMENTO ---
window.handleCancelar = function(id) {
  const reserva = getReservas().find(r => r.id_reserva === id);
  if (!reserva) return;

  // Política: impede cancelamento se já começou (exemplo simples)
  const hoje = new Date().toISOString().split('T')[0];
  if (reserva.dataInicio <= hoje) {
    alert("Não é possível cancelar uma reserva que já se iniciou ou já foi entregue.");
    return;
  }

  if(confirm("Tem a certeza que deseja cancelar esta reserva?")) {
    const sucesso = cancelReserva(id);
    if (sucesso) {
      alert("Reserva cancelada com sucesso. O equipamento voltará ao inventário.");
      renderReservas();
    } else {
      alert("Erro ao cancelar a reserva.");
    }
  }
}

window.handleEliminar = function(id) {
  const index = getReservas().findIndex(r => r.id_reserva === id);
  if (index !== -1 && confirm("Eliminar este registo permanentemente?")) {
    removeReserva(index);
    renderReservas();
  }
}

// --- PROLONGAMENTO ---
let currentReservaId = null;

window.openProlongar = function(id) {
  const reserva = getReservas().find(r => r.id_reserva === id);
  if (!reserva) return;

  currentReservaId = id;
  document.getElementById("pNome").textContent = reserva.nome;
  document.getElementById("pDataFimAtual").textContent = reserva.dataFim;
  
  const inputNovaData = document.getElementById("pNovaDataFim");
  inputNovaData.min = reserva.dataFim;
  inputNovaData.value = reserva.dataFim;
  
  document.getElementById("pPrecoTotal").textContent = reserva.preco;
  document.getElementById("modalProlongar").style.display = "flex";
  
  inputNovaData.onchange = () => calcularNovoPreco(reserva);
}

function calcularNovoPreco(reserva) {
  const novaData = document.getElementById("pNovaDataFim").value;
  if (!novaData || novaData <= reserva.dataFim) return;

  const inicio = new Date(reserva.dataInicio);
  const fim = new Date(novaData);
  
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Assumindo que o preço base mensal está no produto, mas vamos estimar pelo preço atual/duração
  const precoBaseMensal = reserva.preco / (reserva.duracaoDias / 30);
  const novoPreco = ((diffDays / 30) * precoBaseMensal).toFixed(2);
  
  document.getElementById("pPrecoTotal").textContent = novoPreco;
}

document.getElementById("btnConfirmarProlongar").onclick = () => {
  const novaData = document.getElementById("pNovaDataFim").value;
  const novoPreco = document.getElementById("pPrecoTotal").textContent;
  
  if (!novaData || novaData <= document.getElementById("pDataFimAtual").textContent) {
    alert("Por favor escolha uma data posterior ao fim atual.");
    return;
  }

  // Validação de disponibilidade (simulada)
  // No mundo real, verificaríamos se há conflito com outras reservas
  
  const sucesso = updateReserva(currentReservaId, {
    dataFim: novaData,
    preco: novoPreco,
    duracaoLabel: "Prolongado"
  });

  if (sucesso) {
    alert("Aluguer prolongado com sucesso!");
    document.getElementById("modalProlongar").style.display = "none";
    renderReservas();
  } else {
    alert("Erro ao prolongar.");
  }
};

document.getElementById("btnCancelarProlongar").onclick = () => {
  document.getElementById("modalProlongar").style.display = "none";
};

// Initial render
document.addEventListener("DOMContentLoaded", renderReservas);