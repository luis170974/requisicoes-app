import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public departamentos$: Observable<Departamento[]>;
  funcionarioLogado: Funcionario;
  public form: FormGroup;
  

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.form = this.fb.group({
        id: new FormControl(""),
        descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),

        dataAbertura: new FormControl(this.dataAbertura),

        departamentoId: new FormControl("", [Validators.required]),
        departamento: new FormControl(""),


        equipamentoId: new FormControl("",[Validators.required]),
        equipamento: new FormControl("")

    });

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
   
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }

  get equipamentoId(): AbstractControl | null {
    return this.form.get("equipamentoId");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }

  get dataAbertura() {
    return new Date().toDateString;
  }

  obterFuncionarioLogado(){
    this.authService.usuarioLogado
    .subscribe(dados => {
      this.funcionarioService.selecionarFuncionarioLogado(dados!.email!)
        .subscribe(funcionario => {
          this.funcionarioLogado = funcionario;

          this.requisicoes$ = this.requisicaoService.selecionarTodos()
          .pipe(
            map(requisicoes => {
              return requisicoes
                .filter(r => r.solicitante.email === this.funcionarioLogado?.email)
            })
          )
        })
    })
  }

  setValoresPadrao(){
    this.form.patchValue({
      solicitante: this.funcionarioLogado,
      status: 'Aberto',
      dataAbertura: new Date(),
      ultimaAtualizacao: new Date()
    })
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    if (requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;

      const equipamento = requisicao.equipamento ? requisicao.departamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento 
      }

      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }
      

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid){

        if (!requisicao)
        await this.requisicaoService.inserir(this.form.value);
      else
        await this.requisicaoService.editar(this.form.value);

      this.toastrService.success(`A requisicao foi salva com sucesso`,"Cadastro de Requisicoes");
      }
      else{
        this.toastrService.error("O formulario precisa ser preenchido.","Cadastro de Requisicoes");
      }

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar a requisição. Tente novamente","Cadastro de Requisicoes");
      console.log(error);
    }

  }

  public excluir(requisicao: Requisicao) {
    try{
    this.requisicaoService.excluir(requisicao);
    
    this.toastrService.success(`O equipamento foi excluido com sucesso`,"Cadastro de Funcionarios");
    } catch (error) {
      this.toastrService.error("Houve um erro ao excluir o funcionario. Tente novamente","Cadastro de Funcionarios");
   }
  }

}
