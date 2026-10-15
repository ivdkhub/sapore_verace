// Tavoli della sala usati per assegnare le prenotazioni (nome e posti).
// La piantina grafica è stata spostata nel progetto separato "Piantina Tavoli".
export const INITIAL_TABLES = [
  { id: 'T10_TOP_LEFT', name: 'T10', room: 'left', type: 'square', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T6_MID_LEFT', name: 'T6', room: 'left', type: 'rect', seats: 2, status: 'disponibile', reservation: null },
  { id: 'T4_MERGED_LEFT', name: 'T4+T4+T4', room: 'left', type: 'rect', seats: 6, status: 'disponibile', reservation: null },
  { id: 'T10_BOTTOM_LEFT', name: 'T10', room: 'left', type: 'square', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T5_MERGED_CENTER', name: 'T5+T5+T5+T5', room: 'left', type: 'rect', seats: 8, status: 'disponibile', reservation: null },
  { id: 'T10_CENTER_TOP', name: 'T10', room: 'main', type: 'rect', seats: 6, status: 'disponibile', reservation: null },
  { id: 'T10_CENTER_MID', name: 'T10', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T10_CENTER_BOOKED', name: 'T10', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T6_RIGHT_ROUND_MID', name: 'T6', room: 'main', type: 'round', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T13_TOP_RIGHT', name: 'T13', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T13_MID_RIGHT', name: 'T13', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T13_CENTER_RIGHT', name: 'T13', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T13_LOWER_RIGHT', name: 'T13', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T6_T13_MERGED_BOTTOM', name: 'T6+T13', room: 'main', type: 'rect', seats: 4, status: 'disponibile', reservation: null },
  { id: 'T6_RIGHT_ROUND_BOTTOM', name: 'T6', room: 'main', type: 'round', seats: 4, status: 'disponibile', reservation: null },
];
