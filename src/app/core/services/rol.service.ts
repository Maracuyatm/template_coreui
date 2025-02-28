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

  getRol(id: string): Observable<Rol> {
    return this.http.get<Rol>(this.urlRol + id);
  }

  updateRol(id: string, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(this.urlRol + id, rol);
  }

  deleteRol(id: string): Observable<Rol> {
    return this.http.delete<Rol>(this.urlRol + id);
  }
}
