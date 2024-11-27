export interface Pregunta {
  id?: string;
  userId: string;
  pregunta: string;
  timestamp: Date;
  respondida: boolean;
  respuesta?: string;
}
