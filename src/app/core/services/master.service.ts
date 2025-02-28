import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/productos';
import { Categoria } from '../models/categorias';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  urlProductos = 'http://localhost:3000/api/producto/';
  urlCategorias = 'http://localhost:3000/api/categoria/';

  constructor(private http: HttpClient) {}

  //Productos
  getProductos() {
    return this.http.get<Producto[]>(this.urlProductos);
  }

  deleteProducto(id: String): Observable<Producto> {
    return this.http.delete<Producto>(this.urlProductos + id);
  }

  saveProducto(Producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.urlProductos, Producto);
  }

  getProducto(id: String): Observable<Producto> {
    return this.http.get<Producto>(this.urlProductos + id);
  }

  updateProducto(id: String, Producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(this.urlProductos + id, Producto);
  }

  //Categorías

  getCategorias() {
    return this.http.get<Categoria[]>('http://localhost:3000/api/categoria');
  }

  saveCategoria(Categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.urlCategorias, Categoria);
  }

  getCategoria(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(this.urlCategorias + id);
  }

  updateCategoria(id: string, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(this.urlCategorias + id, categoria);
  }

  deleteCategoria(id: string): Observable<Categoria> {
    return this.http.delete<Categoria>(this.urlCategorias + id);
  }
}
