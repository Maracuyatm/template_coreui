export interface Usuario {
    _id?: string;
    usuario: string;
    clave: string; 
    correo : string;
    rol : { nombre: string };
    estado : boolean;
    fechaCreacion?: string;  // Agregado para incluir la fecha de creación
  }