const manutencaoLista = document.getElementById("manutencaoLista");
const modalReporte = document.getElementById("modalReporte");
const btnNovoReporte = document.getElementById("btnNovoReporte");
const btnCancelarReporte = document.getElementById("btnCancelarReporte");
const formReporte = document.getElementById("formReporte");
const equipamentoSelect = document.getElementById("equipamentoSelect");

function renderManutencao() {
  if (!manutencaoLista) return;

  const pedidos = getPedidosManutencao();

  if (pedidos.length === 0) {
    manutencaoLista.innerHTML = `
      <div class="empty-reservas">
        <p>Não tem nenhum pedido de manutenção ativo.</p>
      </div>
    `;
  } else {
    let html = "";
    pedidos.forEach((pedido) => {
      let statusClass = "status-ativa"; // Default
      if (pedido.estado === "Recebido") statusClass = "status-prep";
      if (pedido.estado === "Em análise") statusClass = "status-transporte";
      if (pedido.estado === "Resolvido") statusClass = "status-entregue";
      if (pedido.estado === "Recolha agendada" || pedido.estado === "Substituição agendada") statusClass = "status-finalizada";

      html += `
        <div class="reserva-item">
          <div class="reserva-detalhes">
            <h3>${pedido.equipamentoNome} <span class="badge ${statusClass}">${pedido.estado}</span></h3>
            <p class="reserva-meta"><strong>Data do Pedido:</strong> ${pedido.dataRegisto}</p>
            <p class="reserva-meta"><strong>Descrição:</strong> ${pedido.descricao}</p>
            ${pedido.dataAgendada ? `<p class="reserva-meta"><strong>Agendamento:</strong> ${pedido.dataAgendada}</p>` : ''}
          </div>
        </div>
      `;
    });
    manutencaoLista.innerHTML = html;
  }
}

function popularEquipamentos() {
  const reservas = getReservas().filter(r => r.estado === "Ativa" || r.estado === "A aguardar recolha");
  equipamentoSelect.innerHTML = '<option value="">Selecione um equipamento...</option>';
  reservas.forEach(reserva => {
    const option = document.createElement("option");
    option.value = reserva.id_reserva;
    option.textContent = reserva.nome;
    equipamentoSelect.appendChild(option);
  });
}

btnNovoReporte.onclick = () => {
  popularEquipamentos();
  modalReporte.style.display = "flex";
};

btnCancelarReporte.onclick = () => {
  modalReporte.style.display = "none";
};

formReporte.onsubmit = (e) => {
  e.preventDefault();
  
  const idReserva = equipamentoSelect.value;
  const descricao = document.getElementById("descricaoAvaria").value;
  
  if (!idReserva || !descricao) {
    alert("Por favor preencha todos os campos obrigatórios.");
    return;
  }

  const reserva = getReservas().find(r => r.id_reserva === idReserva);

  const novoPedido = {
    id_reserva: idReserva,
    equipamentoNome: reserva.nome,
    descricao: descricao
  };

  if (savePedidoManutencao(novoPedido)) {
    alert("Pedido de manutenção enviado com sucesso!");
    modalReporte.style.display = "none";
    formReporte.reset();
    renderManutencao();
  } else {
    alert("Erro ao enviar pedido.");
  }
};

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderManutencao();
});