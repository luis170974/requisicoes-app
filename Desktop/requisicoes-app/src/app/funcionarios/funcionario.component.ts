import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal
    
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      funcionario: new FormGroup({
        id: new FormControl(""),
        nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        funcao: new FormControl("", [Validators.required, Validators.minLength(3)]),
        departamentoId: new FormControl("", [Validators.required]),
        departamento: new FormControl(""),
      }),
      senha: new FormControl("")
    });

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }
  
  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("funcionario.id");
  }


  get nome(): AbstractControl | null {
    return this.form.get("funcionario.nome");
  }

  
  get email(): AbstractControl | null {
    return this.form.get("funcionario.email");
  }
  

  get funcao(): AbstractControl | null {
    return this.form.get("funcionario.funcao");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("funcionario.departamentoId");
  }

  get senha(): AbstractControl | null {
    return this.form.get("senha");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset();

    if (funcionario){
      const departamento = funcionario.departamento ? funcionario.departamento : null;

      const funcionarioCompleto = {
        ...funcionario,
        departamento
      }

      this.form.get("funcionario")?.setValue(funcionarioCompleto);
    }
      

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid){

        if (!funcionario){

          await this.authService.cadastrar(this.email?.value, this.senha?.value);

          await this.funcionarioService.inserir(this.form.get("funcionario")?.value);

          await this.authService.logout();

          await this.router.navigate(["/login"]);
        }  
      else
        await this.funcionarioService.editar(this.form.get("funcionario")?.value);

      this.toastrService.success(`O funcionario foi salvo com sucesso`,"Cadastro de Funcionarios");
      }
      else{
        this.toastrService.error("O formulario precisa ser preenchido.","Cadastro de Funcionarios");
      }

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar o funcionario. Tente novamente","Cadastro de Funcionarios");
    }

  }

  public excluir(funcionario: Funcionario) {
    try{
    this.funcionarioService.excluir(funcionario);
    
    this.toastrService.success(`O funcionario foi excluido com sucesso`,"Cadastro de Funcionarios");
    } catch (error) {
      this.toastrService.error("Houve um erro ao excluir o funcionario. Tente novamente","Cadastro de Funcionarios");
   }
  }
}