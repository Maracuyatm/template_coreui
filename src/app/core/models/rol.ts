export interface Rol {
    _id?: string;
    nombre: string;
    descripcion: string;
    estado: boolean;
    fechaCreacion?: string;  // Agregado para incluir la fecha de creación
  }