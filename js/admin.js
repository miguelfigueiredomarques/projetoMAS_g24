const tabelaEntregas = document.querySelector("#tabelaEntregas tbody");
const tabelaManutencao = document.querySelector("#tabelaManutencao tbody");
const modalAdminMnt = document.getElementById("modalAdminMnt");
const selectMntAcao = document.getElementById("mntAcao");
const inputDataMnt = document.getElementById("dataMnt");
const grpDataMnt = document.getElementById("grpDataMnt");

let currentPedidoId = null;

function renderAdmin() {
  const reservas = getReservas();
  const pedidos = getPedidosManutencao();

  // Tabela Entregas
  tabelaEntregas.innerHTML = "";
  reservas.forEach(reserva => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${reserva.id_reserva}</td>
      <td>${reserva.nome}</td>
      <td>${reserva.dataEntrega || 'N/A'}</td>
      <td><span class="badge">${reserva.estadoEntrega || 'Pendente'}</span></td>
      <td>
        <button class="btn btn-small" onclick="atualizarEntrega('${reserva.id_reserva}', 'Em transporte')">Transporte</button>
        <button class="btn btn-small" onclick="atualizarEntrega('${reserva.id_reserva}', 'Entregue')" style="background:#28a745;">Entregue</button>
      </td>
    `;
    tabelaEntregas.appendChild(tr);
  });

  // Tabela Manutenção
  tabelaManutencao.innerHTML = "";
  pedidos.forEach(pedido => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pedido.id_pedido}</td>
      <td>${pedido.equipamentoNome}</td>
      <td><span class="badge">${pedido.estado}</span></td>
      <td>
        <button class="btn btn-small" onclick="abrirGerirMnt('${pedido.id_pedido}')">Gerir</button>
      </td>
    `;
    tabelaManutencao.appendChild(tr);
  });
}

window.atualizarEntrega = function(id, novoEstado) {
  if (updateReserva(id, { estadoEntrega: novoEstado })) {
    renderAdmin();
  }
};

window.abrirGerirMnt = function(id) {
  const pedido = getPedidosManutencao().find(p => p.id_pedido === id);
  currentPedidoId = id;
  document.getElementById("mntInfo").textContent = `Equipamento: ${pedido.equipamentoNome} | Problema: ${pedido.descricao}`;
  selectMntAcao.value = pedido.estado;
  grpDataMnt.style.display = (pedido.estado.includes("agendada")) ? "block" : "none";
  modalAdminMnt.style.display = "flex";
};

selectMntAcao.onchange = () => {
  grpDataMnt.style.display = (selectMntAcao.value.includes("agendada")) ? "block" : "none";
};

document.getElementById("btnSalvarMnt").onclick = () => {
  const novosDados = {
    estado: selectMntAcao.value,
    dataAgendada: selectMntAcao.value.includes("agendada") ? inputDataMnt.value : null
  };

  if (novosDados.estado.includes("agendada") && !novosDados.dataAgendada) {
    alert("Por favor selecione uma data.");
    return;
  }

  if (updatePedidoManutencao(currentPedidoId, novosDados)) {
    alert("Pedido atualizado!");
    modalAdminMnt.style.display = "none";
    renderAdmin();
  }
};

document.getElementById("btnFecharMnt").onclick = () => {
  modalAdminMnt.style.display = "none";
};

// Histórico
const filtroEquipamento = document.getElementById("filtroEquipamento");
const historicoResultados = document.getElementById("historicoResultados");

filtroEquipamento.oninput = () => {
  const idProduto = filtroEquipamento.value.trim();
  if (!idProduto) {
    historicoResultados.innerHTML = "";
    return;
  }

  const pedidos = getPedidosManutencao().filter(p => {
    // Aqui assumimos que id_reserva pode ser usado para rastrear o histórico do produto alugado
    const reserva = getReservas().find(r => r.id_reserva === p.id_reserva);
    return reserva && reserva.id.toString() === idProduto;
  });

  if (pedidos.length === 0) {
    historicoResultados.innerHTML = "<p>Sem histórico para este equipamento.</p>";
  } else {
    let html = "<table><thead><tr><th>Data</th><th>Problema</th><th>Estado Final</th></tr></thead><tbody>";
    pedidos.forEach(p => {
      html += `<tr><td>${p.dataRegisto}</td><td>${p.descricao}</td><td>${p.estado}</td></tr>`;
    });
    html += "</tbody></table>";
    historicoResultados.innerHTML = html;
  }
};

// Initial render
document.addEventListener("DOMContentLoaded", renderAdmin);