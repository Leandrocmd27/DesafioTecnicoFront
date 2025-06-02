import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from './paciente'; 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})

export class PacientesService {

  url = "http://localhost:5270/api/Pacientes";

  constructor(private http: HttpClient) {}

    PegarTodos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url);
    }

    PegarPeloId(pacienteId: number): Observable<Paciente> {
      const apiUrl = `${this.url}/${pacienteId}`;
      return this.http.get<Paciente>(apiUrl);
    }

    SalvarPaciente(paciente: Paciente): Observable<any> {
      return this.http.post<Paciente>(this.url, paciente, httpOptions);
    }

    AtualizarPaciente(paciente: Paciente): Observable<any> {
      const apiUrl = `${this.url}/${paciente.pacienteId}`;
      return this.http.put<Paciente>(apiUrl, paciente, httpOptions);
    }

    ExcluirPaciente(pacienteId: number): Observable<any> {
      const apiUrl = `${this.url}/${pacienteId}`;
      return this.http.delete<number>(apiUrl, httpOptions);
    }
   
}
