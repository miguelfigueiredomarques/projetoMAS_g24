const STORAGE_KEY = "unirent_reservas_v1";

function getReservas() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    console.log("DEBUG [Storage]: Reading from", STORAGE_KEY, "Value:", data);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("DEBUG [Storage]: Error reading from Storage:", e);
    return [];
  }
}

function saveReserva(reserva) {
  try {
    const reservas = getReservas();
    reservas.push(reserva);
    const jsonData = JSON.stringify(reservas);
    localStorage.setItem(STORAGE_KEY, jsonData);
    
    // Safety check
    const confirmation = localStorage.getItem(STORAGE_KEY);
    if (confirmation === jsonData) {
      console.log("DEBUG [Storage]: Saved successfully! New count:", reservas.length);
      return true;
    } else {
      throw new Error("Persistence verification failed");
    }
  } catch (e) {
    console.error("DEBUG [Storage]: Error saving to Storage:", e);
    return false;
  }
}

function removeReserva(index) {
  try {
    const reservas = getReservas();
    if (index >= 0 && index < reservas.length) {
      reservas.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      console.log("DEBUG [Storage]: Removed item at index", index, "New count:", reservas.length);
      return true;
    }
    return false;
  } catch (e) {
    console.error("DEBUG [Storage]: Error removing from Storage:", e);
    return false;
  }
}

// Make functions available globally
window.getReservas = getReservas;
window.saveReserva = saveReserva;
window.removeReserva = removeReserva;