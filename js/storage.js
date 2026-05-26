const STORAGE_KEY = "unirent_reservas_v1";
const MAINTENANCE_KEY = "unirent_manutencao_v1";

// Gera um ID único simples
function generateId(prefix = 'RES') {
  return prefix + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function getReservas() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("DEBUG [Storage]: Erro ao ler Storage:", e);
    return [];
  }
}

function saveReserva(reserva) {
  try {
    const reservas = getReservas();
    // Atribuir ID único se não tiver
    if (!reserva.id_reserva) {
      reserva.id_reserva = generateId();
    }
    // Estado inicial
    if (!reserva.estado) {
      reserva.estado = "Ativa";
    }
    // Estado de entrega inicial
    if (!reserva.estadoEntrega) {
      reserva.estadoEntrega = "Em preparação";
    }
    
    reservas.push(reserva);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    return true;
  } catch (e) {
    console.error("DEBUG [Storage]: Erro ao guardar:", e);
    return false;
  }
}

function updateReserva(id_reserva, novosDados) {
  try {
    let reservas = getReservas();
    const index = reservas.findIndex(r => r.id_reserva === id_reserva);
    if (index !== -1) {
      reservas[index] = { ...reservas[index], ...novosDados };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      return true;
    }
    return false;
  } catch (e) {
    console.error("DEBUG [Storage]: Erro ao atualizar:", e);
    return false;
  }
}

function cancelReserva(id_reserva) {
  return updateReserva(id_reserva, { estado: "Cancelada" });
}

function finalizeReserva(id_reserva) {
  return updateReserva(id_reserva, { estado: "Finalizada" });
}

function requestRecolha(id_reserva, dataRecolha) {
  return updateReserva(id_reserva, { 
    estado: "A aguardar recolha",
    dataRecolha: dataRecolha
  });
}

function removeReserva(index) {
  try {
    const reservas = getReservas();
    if (index >= 0 && index < reservas.length) {
      reservas.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// --- MANUTENÇÃO ---

function getPedidosManutencao() {
  try {
    const data = localStorage.getItem(MAINTENANCE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function savePedidoManutencao(pedido) {
  try {
    const pedidos = getPedidosManutencao();
    pedido.id_pedido = generateId('MNT');
    pedido.estado = pedido.estado || "Recebido";
    pedido.dataRegisto = new Date().toLocaleDateString('pt-PT');
    pedidos.push(pedido);
    localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(pedidos));
    return true;
  } catch (e) {
    return false;
  }
}

function updatePedidoManutencao(id_pedido, novosDados) {
  try {
    let pedidos = getPedidosManutencao();
    const index = pedidos.findIndex(p => p.id_pedido === id_pedido);
    if (index !== -1) {
      pedidos[index] = { ...pedidos[index], ...novosDados };
      localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(pedidos));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

window.getReservas = getReservas;
window.saveReserva = saveReserva;
window.updateReserva = updateReserva;
window.cancelReserva = cancelReserva;
window.finalizeReserva = finalizeReserva;
window.requestRecolha = requestRecolha;
window.removeReserva = removeReserva;
window.getPedidosManutencao = getPedidosManutencao;
window.savePedidoManutencao = savePedidoManutencao;
window.updatePedidoManutencao = updatePedidoManutencao;