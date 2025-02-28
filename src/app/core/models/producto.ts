// export interface Producto {
//     _id?: string;
//     nombre: string;
//     categoria: { _id: string; nombre: string }; // Ajustamos el tipo de categoria
//     ubicacion: string;
//     precio: number;
  
//     Declarar variables en el constructor
//     constructor(nombre: string, categoria: { _id: string; nombre: string }, ubicacion: string, precio: number) { 
//       this.nombre = nombre;
//       this.categoria = categoria; // Ahora acepta un objeto
//       this.ubicacion = ubicacion;
//       this.precio = precio;
//     }
//   }
export interface Producto {
  _id?: string;
  nombre: string;
  categoria: { _id: string; nombre: string }; 
  ubicacion: string;
  precio: number;
  fechaCreacion?: string;  // Agregado para incluir la fecha de creación
}
