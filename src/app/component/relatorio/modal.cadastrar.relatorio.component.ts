import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalerrorComponent } from 'src/app/modalerror/modalerror.component';
import { ActionType } from 'src/app/model/action-type.enum';
import { Assunto } from 'src/app/model/assunto.model';
import { Autor } from 'src/app/model/autor.model';
import { Relatorio } from 'src/app/model/relatorio.model';
import { ResponseError } from 'src/app/model/response.error';
import { RealatorioService } from 'src/app/service/relatorio.service';

@Component({
  selector: 'app-modal-cadastra-relatorio',
  templateUrl: './modal.cadastrar.relatorio.component.html',
  styleUrls: ['./modal.cadastrar.relatorio.component.sass']
})
export class ModalCadastrarRelatorioComponent implements OnInit {
  
  @Input() title: string | undefined;
  currentDate!: string;
  formData = new FormData();
  
  relatorio!: Relatorio;
  autoresDisponiveis: any[] = [];
  assuntosDisponiveis: any[] = [];
  selectedAutores: number[] = [];
  selectedAssuntos: number[] = [];

  isViewMode = false;
  isLoading = false;
  isLoadingRelacionamentos = false;
  isEditMode = false;
  isDeleteMode = false;
  isLoadingAutores = false;
  isLoadingAssuntos = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      title: string, 
      relatorio: Relatorio,
      actionType: ActionType
    },
    private dialogRef: MatDialogRef<ModalCadastrarRelatorioComponent>,
    private dialogError: MatDialog,
    private router: Router,
    private relatorioService: RealatorioService,
  ) {
    this.title = data.title;
    this.relatorio = { ...data.relatorio };
    this.isViewMode = data.actionType === ActionType.VIEW;
    this.isDeleteMode = data.actionType === ActionType.DELETE;
    this.isEditMode = data.actionType === ActionType.EDIT || data.actionType === ActionType.CREATE;
  }

  autoresRelacionados: Autor[] = [];
  assuntosRelacionados: Assunto[] = [];
  
  ngOnInit() {
    // Se for modo visualização, carrega dados completos
    if (this.data.actionType === ActionType.VIEW && this.relatorio.codl) {
      this.loadRelatorioDetails();
      this.loadRelacionamentos();
    }
        // Carrega listas disponíveis para CREATE e EDIT
    if (this.isEditMode) {
      // this.carregarAutoresDisponiveis();
      // this.carregarAssuntosDisponiveis();
    }
  }

  // Método único que decide qual ação executar
  actionRelatorio(): void {
    switch (this.data.actionType) {
      case ActionType.VIEW:
        this.detailRelatorio();
        break;
      case ActionType.CREATE:
        this.saveRelatorio();
        break;
      case ActionType.EDIT:
        this.updateRelatorio();
        break;
      case ActionType.DELETE:
        this.removeRelatorio();
        break;
      default:
        console.error('Tipo de ação não suportado:', this.data.actionType);
    }
  }

  // 1. Detalhar Relatorio (VIEW)
    private detailRelatorio(): void {
    if (!this.relatorio.titulo) return;
    
    this.isLoading = true;
    this.relatorioService.getRelatorioById(this.relatorio.codl).subscribe({
      next: (relatorioDetalhado) => {
        this.relatorio = relatorioDetalhado;
        this.isLoading = false;
        
        // Se o backend já retornar os relacionamentos
        if (relatorioDetalhado.autores) {
          this.autoresRelacionados = relatorioDetalhado.autores;
        }
        if (relatorioDetalhado.assuntos) {
          this.assuntosRelacionados = relatorioDetalhado.assuntos;
        }
        
        console.log('Relatorio detalhado:', relatorioDetalhado);
      },
      error: (error) => {
        this.handleError(error, 'Erro ao carregar detalhes do relatorio');
        this.isLoading = false;
      }
    });
  }

  // 2. Salvar Relatorio (CREATE)
  private saveRelatorio(): void {
    this.isLoading = true;
    this.relatorioService.save(this.relatorio).subscribe({
      next: (response) => {
        this.handleSuccess(
          `Relatorio "${response.titulo}" cadastrado com sucesso!`,
          response.createdAtRelatorio || this.formatDate(new Date())
        );
        this.isLoading = false;
        this.dialogRef.close('created'); // Fecha o modal com resultado
      },
      error: (error) => {
        this.handleError(error, 'Erro ao cadastrar relatorio');
        this.isLoading = false;
      }
    });
  }

  // 3. Atualizar Relatorio (EDIT)
  private updateRelatorio(): void {
    if (!this.relatorio.codl) return;
    
    this.isLoading = true;
    this.relatorioService.update(this.relatorio).subscribe({
      next: (response) => {
        this.handleSuccess(
          `Relatorio "${response.titulo}" atualizado com sucesso!`,
          this.formatDate(new Date())
        );
        this.isLoading = false;
        this.dialogRef.close('updated'); // Fecha o modal com resultado
      },
      error: (error) => {
        this.handleError(error, 'Erro ao atualizar relatorio');
        this.isLoading = false;
      }
    });
  }

  // 4. Remover Relatorio (DELETE)
  removeRelatorio(): void {
    if (!this.relatorio.codl) return;
    
    if (confirm(`Tem certeza que deseja remover o relatorio "${this.relatorio.titulo}"?`)) {
      this.isLoading = true;
      this.relatorioService.remove(this.relatorio).subscribe({
        next: () => {
          this.handleSuccess(
            `Relatorio "${this.relatorio.titulo}" removido com sucesso!`,
            this.formatDate(new Date())
          );
          this.isLoading = false;
          this.dialogRef.close('deleted');
        },
        error: (error) => {
          this.handleError(error, 'Erro ao remover relatorio');
          this.isLoading = false;
        }
      });
    }
  }

  // Método para carregar autores e assuntos relacionados
  private loadRelacionamentos(): void {
    if (!this.relatorio.titulo) return;
    
    this.isLoadingRelacionamentos = true;
    
    this.relatorioService.getRelatorioById(this.relatorio.codl).subscribe({
      next: (relatorio) => {
        this.autoresRelacionados = relatorio.autores;
        this.assuntosRelacionados = relatorio.assuntos;
        this.isLoadingRelacionamentos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar autores:', error);
        this.isLoadingRelacionamentos = false;
      }
    });
  }

  // 5. Carregar detalhes do relatorio (para visualização)
  private loadRelatorioDetails(): void {
    if (!this.relatorio.codl) return;
    
    this.isLoading = true;
    this.relatorioService.getRelatorioById(this.relatorio.codl).subscribe({
      next: (relatorioCompleto) => {
        this.relatorio = relatorioCompleto;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error, 'Erro ao carregar detalhes');
        this.isLoading = false;
      }
    });
  }

  // Métodos auxiliares
  private handleSuccess(message: string, date: string): void {
    const error = new ResponseError(
      message,
      `Data: ${date}`,
      'Sucesso!'
    );
    this.openErrorModal(error);
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);
    
    const errorMsg = error?.error?.mensagem || error?.message || defaultMessage;
    const errorCode = error?.error?.errorCode || 'ERRO_DESCONHECIDO';
    
    const responseError = new ResponseError(
      errorMsg,
      `Código: ${errorCode}`,
      'Ops..'
    );
    
    this.openErrorModal(responseError);
  }

  private openErrorModal(error: ResponseError): void {
    const dialogRef = this.dialogError.open(ModalerrorComponent, {
      width: '500px',
      data: error
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl('/relatorio');
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  getButtonText(): string {
    switch (this.data.actionType) {
      case ActionType.VIEW: return 'Fechar';
      case ActionType.CREATE: return this.isLoading ? 'Cadastrando...' : 'Cadastrar';
      case ActionType.EDIT: return this.isLoading ? 'Atualizando...' : 'Atualizar';
      case ActionType.DELETE: return this.isLoading ? 'Removendo...' : 'Confirmar Remoção';
      default: return 'Salvar';
    }
  }

  getButtonColor(): string {
    switch (this.data.actionType) {
      case ActionType.DELETE: return 'btn-danger';
      default: return 'btn-primary';
    }
  }

  isButtonDisabled(): boolean {
    if (this.isLoading) return true;
    if (this.data.actionType === ActionType.VIEW) return false;

    return !this.relatorio.titulo || !this.relatorio.editora;
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
    hasRelacionamentos(): boolean {
    return this.autoresRelacionados.length > 0 || this.assuntosRelacionados.length > 0;
  }
  
  visualizarAutor(autor: Autor): void {
    // Pode abrir outro modal ou navegar
    console.log('Visualizando autor:', autor);
    // this.router.navigate(['/autor', autor.codAu]);
  }

  visualizarAssunto(assunto: Assunto): void {
    console.log('Visualizando assunto:', assunto);
    // Exemplo: this.router.navigate(['/assunto', assunto.codAs]);
  }

  compararPorId(o1: any, o2: any): boolean {
    if (o1 && o2) {
      return o1.codAu === o2.codAu || o1.codAs === o2.codAs;
    }
    return false;
}


getAutorNome(autorId: number): string {
  const autor = this.autoresDisponiveis.find(a => a.codAu === autorId);
  return autor ? autor.nome : `Autor ${autorId}`;
}

getAssuntoDescricao(assuntoId: number): string {
  const assunto = this.assuntosDisponiveis.find(a => a.codAs === assuntoId);
  return assunto ? assunto.descricao : `Assunto ${assuntoId}`;
}

removerAutor(autorId: number): void {
  this.selectedAutores = this.selectedAutores.filter(id => id !== autorId);
}

removerAssunto(assuntoId: number): void {
  this.selectedAssuntos = this.selectedAssuntos.filter(id => id !== assuntoId);
}

  confirmDelete(): void {
    this.salvarAssunto();
  }
    salvarAssunto(): void {
    this.isLoading = true;
    
    if (this.data.actionType === 'create') {
      this.relatorioService.save(this.relatorio).subscribe({
        next: (response) => {
          this.dialogRef.close('created');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao criar assunto:', error);
          this.isLoading = false;
        }
      });
    } else if (this.data.actionType === 'edit') {
      this.relatorioService.update(this.relatorio).subscribe({
        next: (response) => {
          this.dialogRef.close('updated');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao atualizar assunto:', error);
          this.isLoading = false;
        }
      });
    } else if (this.data.actionType === 'delete') {
      this.relatorioService.remove(this.relatorio!).subscribe({
        next: (response) => {
          this.dialogRef.close('deleted');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao remover assunto:', error);
          this.isLoading = false;
        }
      });
    }
  }
}