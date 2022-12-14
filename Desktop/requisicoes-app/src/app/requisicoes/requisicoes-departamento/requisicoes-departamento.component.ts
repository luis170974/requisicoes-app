import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public departamentos$: Observable<Departamento[]>;
  private processoAutenticado$: Subscription;

  public funcionarioLogadoId: string;
  public form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(6)]),

      dataAbertura: new FormControl(""),

      dataAtualizacao: new FormControl(""),

      status: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),

    });

    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!;

      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => {
          this.funcionarioLogadoId = funcionario?.id;
            this.requisicoes$ = this.requisicaoService
            .selecionarRequisicoesFuncionarioAtual(this.funcionarioLogadoId);
        });
      
        

    });
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualiza????o" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get departamentoId() {
    return this.form.get("departamentoId");
  }

  get descricao() {
    return this.form.get("descricao");
  }

  get status() {
    return this.form.get("status");
  }

  public async atualizar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();
    this.configurarValoresPadrao();

    if (requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
      }

      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!requisicao)
          await this.requisicaoService.inserir(this.form.value);
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastrService.success(`A movimenta????o foi salva com sucesso!`, "Cadastro de Requisi????es");
      }
      else
        this.toastrService.error("Verifique o preenchimento do formul??rio e tente novamente.", "Cadastro de Requisi????es")
      
    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao salvar a movimenta????o. Tente novamente.", "Cadastro de Requisi????es")
    }

  }

  public async verMovimentacoes(requisicao: Requisicao) {

  }

  private configurarValoresPadrao(): void {
    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("dataAtualizacao")?.setValue(new Date());
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogadoId);
  }

}