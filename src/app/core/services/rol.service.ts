import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../models/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolService {

  urlRol = 'http://localhost:3000/api/rol/';

  constructor(private http: HttpClient) { }


  getRoles() {
    return this.http.get<Rol[]>(this.urlRol);
  }

  saveRol(Rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.urlRol, Rol);
  }

  // getCategoria(id: string): Observable<Categoria> {
  //   return this.http.get<Categoria>(this.urlCategorias + id);
  // }

  // updateCategoria(id: string, categoria: Categoria): Observable<Categoria> {
  //   return this.http.put<Categoria>(this.urlCategorias + id, categoria);
  // }

  // deleteCategoria(id: string): Observable<Categoria> {
  //   return this.http.delete<Categoria>(this.urlCategorias + id);
  // }
}
