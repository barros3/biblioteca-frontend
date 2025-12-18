// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { Relatorio } from '../model/relatorio.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class RelatorioService {
//   private apiUrl = `${environment.api}/relatorios`;

//   // Mock data para teste
//   private mockRelatorios: Relatorio[] = [
//     { 
//       codl: 1, 
//       titulo: 'Dom Casmurro', 
//       autor: 'Machado de Assis', 
//       assunto: 'Romance', 
//       editora: 'Companhia das Letras',
//       edicao: 3,
//       anoPublicacao: '2023',
//       valor: 49.90,
//       atualizadoEm: '2024-01-15 14:30:00'
//     },
//     { 
//       codl: 2, 
//       titulo: '1984', 
//       autor: 'George Orwell', 
//       assunto: 'Ficção Científica', 
//       editora: 'Penguin',
//       edicao: 1,
//       anoPublicacao: '2022',
//       valor: 39.90,
//       atualizadoEm: '2024-01-10 10:15:00'
//     },
//     { 
//       codl: 3, 
//       titulo: 'A Hora da Estrela', 
//       autor: 'Clarice Lispector', 
//       assunto: 'Literatura Brasileira', 
//       editora: 'Rocco',
//       edicao: 2,
//       anoPublicacao: '2023',
//       valor: 34.90,
//       atualizadoEm: '2024-01-05 09:45:00'
//     }
//   ];

//   constructor(private http: HttpClient) {}

//   listarLivrosEditados(parametros: Relatorio): Observable<Relatorio> {
//     // Mock para teste - substitua por chamada real depois
//     const dataFiltrada = this.mockRelatorios.filter(livro => {
//       let passa = true;
      
//       // if (parametros.dataInicio && livro.atualizadoEm) {
//       //   const dataLivro = new Date(livro.atualizadoEm);
//       //   const dataInicio = new Date(parametros.dataInicio);
//       //   passa = passa && dataLivro >= dataInicio;
//       // }
      
//       // if (parametros.dataFim && livro.atualizadoEm) {
//       //   const dataLivro = new Date(livro.atualizadoEm);
//       //   const dataFim = new Date(parametros.dataFim);
//       //   passa = passa && dataLivro <= dataFim;
//       // }
      
//       // if (parametros.editora) {
//       //   passa = passa && livro.editora?.toLowerCase().includes(parametros.editora.toLowerCase());
//       // }
      
//       return passa;
//     });

//     return of({
//       success: true,
//       message: 'Relatório gerado com sucesso',
//       data: dataFiltrada,
//       total: dataFiltrada.length,
//       pagina: 1,
//       totalPaginas: 1
//     });

//     /* Chamada real (descomente depois):
//     let params = new HttpParams();
    
//     if (parametros.dataInicio) {
//       params = params.set('dataInicio', parametros.dataInicio.toString());
//     }
    
//     if (parametros.dataFim) {
//       params = params.set('dataFim', parametros.dataFim.toString());
//     }
    
//     if (parametros.editora) {
//       params = params.set('editora', parametros.editora);
//     }
    
//     return this.http.get<RelatorioResponse>(`${this.apiUrl}/livros-editados`, { params });
//     */
//   }

//   exportarParaPDF(parametros: Relatorio): Observable<Blob> {
//     const params = new HttpParams({ fromObject: parametros as any });
    
//     return this.http.get(`${this.apiUrl}/exportar-pdf`, { 
//       params, 
//       responseType: 'blob' 
//     });
//   }

//   exportarParaExcel(parametros: Relatorio): Observable<Blob> {
//     const params = new HttpParams({ fromObject: parametros as any });
    
//     return this.http.get(`${this.apiUrl}/exportar-excel`, { 
//       params, 
//       responseType: 'blob' 
//     });
//   }
// }