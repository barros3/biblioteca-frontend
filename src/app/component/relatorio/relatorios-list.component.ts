// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { MatTableDataSource } from '@angular/material/table';
// import { Assunto } from 'src/app/model/assunto.model';
// import { Autor } from 'src/app/model/autor.model';
// import { Relatorio } from 'src/app/model/relatorio.model';
// import { AssuntoService } from 'src/app/service/assunto.service';
// import { AutorService } from 'src/app/service/autor.service';
// import { RelatorioService } from 'src/app/service/relatorio.service';

// @Component({
//   selector: 'app-relatorios-list',
//   templateUrl: './relatorios-list.component.html',
//   styleUrls: ['./relatorios-list.component.sass'],
//   standalone: false
// })
// export class RelatoriosListComponent implements OnInit {
//   form: FormGroup;
//   loading = false;
//   exportando = false;
  
//   // Tabela
//   displayedColumns: string[] = ['codl', 'titulo', 'autor', 'assunto', 'editora', 'edicao', 'anoPublicacao', 'valor', 'atualizadoEm'];
//   dataSource = new MatTableDataSource<Relatorio>();
  
//   // Filtros
//   autores: Autor[] = [];
//   assuntos: Assunto[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private relatorioService: RelatorioService,
//     private autorService: AutorService,
//     private assuntoService: AssuntoService
//   ) {
//     const hoje = new Date();
//     const umMesAtras = new Date();
//     umMesAtras.setMonth(hoje.getMonth() - 1);

//     this.form = this.fb.group({
//       dataInicio: [umMesAtras],
//       dataFim: [hoje],
//       autorId: [''],
//       assuntoId: [''],
//       editora: ['']
//     });
//   }

//   ngOnInit(): void {
//     // this.carregarFiltros();
//     this.gerarRelatorio();
//   }

// //   carregarFiltros(): void {
// //     this.autorService.listar(1, 100).subscribe({
// //       next: (response) => {
// //         this.autores = response.items;
// //       }
// //     });

// //     this.assuntoService.listar(1, 100).subscribe({
// //       next: (response) => {
// //         this.assuntos = response.items;
// //       }
// //     });
// //   }

//   gerarRelatorio(): void {
//     this.loading = true;
//     const parametros: Relatorio = this.form.value;

//     this.relatorioService.listarLivrosEditados(parametros).subscribe({
//       next: (response) => {
//         this.dataSource.data = response.data;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Erro ao gerar relatório:', error);
//         this.loading = false;
//       }
//     });
//   }

//   exportarPDF(): void {
//     this.exportando = true;
//     const parametros: Relatorio = this.form.value;

//     this.relatorioService.exportarParaPDF(parametros).subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, `relatorio-livros-${new Date().getTime()}.pdf`);
//         this.exportando = false;
//       },
//       error: (error) => {
//         console.error('Erro ao exportar PDF:', error);
//         this.exportando = false;
//       }
//     });
//   }

//   exportarExcel(): void {
//     this.exportando = true;
//     const parametros: Relatorio = this.form.value;

//     this.relatorioService.exportarParaExcel(parametros).subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, `relatorio-livros-${new Date().getTime()}.xlsx`);
//         this.exportando = false;
//       },
//       error: (error) => {
//         console.error('Erro ao exportar Excel:', error);
//         this.exportando = false;
//       }
//     });
//   }

//   limparFiltros(): void {
//     const hoje = new Date();
//     const umMesAtras = new Date();
//     umMesAtras.setMonth(hoje.getMonth() - 1);

//     this.form.reset({
//       dataInicio: umMesAtras,
//       dataFim: hoje,
//       autorId: '',
//       assuntoId: '',
//       editora: ''
//     });

//     this.gerarRelatorio();
//   }

//   private downloadFile(blob: Blob, filename: string): void {
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   }
// }