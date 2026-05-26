function getReservas() {
    return JSON.parse(localStorage.getItem("reservas")) || [];
  }
  
  function saveReserva(reserva) {
    const reservas = getReservas();
    reservas.push(reserva);
  
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }