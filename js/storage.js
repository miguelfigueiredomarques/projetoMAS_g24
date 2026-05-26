const STORAGE_KEY = "unirent_reservas_v1";

// Gera um ID único simples
function generateId() {
  return 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
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

window.getReservas = getReservas;
window.saveReserva = saveReserva;
window.updateReserva = updateReserva;
window.cancelReserva = cancelReserva;
window.finalizeReserva = finalizeReserva;
window.removeReserva = removeReserva;