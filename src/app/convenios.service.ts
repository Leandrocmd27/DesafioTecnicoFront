import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Convenio } from './convenio'; 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})

export class ConveniosService {

  url = "http://localhost:5270/api/Convenios";

  constructor(private http: HttpClient) {}

    PegarTodos(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(this.url);
    }

    PegarPeloId(convenioId: number): Observable<Convenio> {
      const apiUrl = `${this.url}/${convenioId}`;
      return this.http.get<Convenio>(apiUrl);
    }

    SalvarConvenio(convenio: Convenio): Observable<any> {
      return this.http.post<Convenio>(this.url, convenio, httpOptions);
    }

    AtualizarConvenio(convenio: Convenio): Observable<any> {
      return this.http.put<Convenio>(this.url, convenio, httpOptions);
    }

    ExcluirConvenio(convenioId: number): Observable<any> {
      const apiUrl = `${this.url}/${convenioId}`;
      return this.http.delete<number>(apiUrl, httpOptions);
    }
   
}
