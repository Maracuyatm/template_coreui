import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../_model/productos';
import { Categoria } from '../_model/categorias';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  urlProductos='http://localhost:3000/api/productos/';
  urlCategorias='http://localhost:3000/api/categorias/';

  constructor(private http:HttpClient) { }
  
  //Productos
  getProductos() {
    return this.http.get<Producto[]>(this.urlProductos);
  }

  deleteProducto(id:String):Observable<Producto>{
    return this.http.delete<Producto>(this.urlProductos + id);
  }

  saveProducto(Producto: Producto):Observable<Producto>{
    return this.http.post<Producto>(this.urlProductos, Producto);
  }

  getProducto(id:String):Observable<Producto>{
    return this.http.get<Producto>(this.urlProductos + id);
  }

  updateProducto(id: String, Producto : Producto):Observable<Producto>{
    return this.http.put<Producto>(this.urlProductos + id, Producto);
  }


  //Categorías

  getCategorias(){
    return this.http.get<Categoria[]>('http://localhost:3000/api/categorias');
  }

  saveCategoria(Categoria: Categoria):Observable<Categoria>{
    return this.http.post<Categoria>(this.urlCategorias, Categoria);
  }
}
