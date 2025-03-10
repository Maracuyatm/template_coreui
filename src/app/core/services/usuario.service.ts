import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlUsuario = 'http://localhost:3000/api/usuario/';
  
    constructor(private http: HttpClient) { }
  
  
    getUsuarios() {
      return this.http.get<Usuario[]>(this.urlUsuario);
    }
  
    saveUsuario(Usuario: Usuario): Observable<Usuario> {
      return this.http.post<Usuario>(this.urlUsuario, Usuario);
    }
  
    getUsuario(id: string): Observable<Usuario> {
      return this.http.get<Usuario>(this.urlUsuario + id);
    }
  
    updateUsuario(id: string, Usuario: Usuario): Observable<Usuario> {
      return this.http.put<Usuario>(this.urlUsuario + id, Usuario);
    }
  
    deleteUsuario(id: string): Observable<Usuario> {
      return this.http.delete<Usuario>(this.urlUsuario + id);
    }
}
