import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public formRecuperacao: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private toastrService: ToastrService

  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl(""),
      senha: new FormControl("")
    });

    this.formRecuperacao = this.formBuilder.group({
      emailRecuperacao: new FormControl("")
    })
  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  get senha(): AbstractControl | null {
    return this.form.get("senha");
  }

  get emailRecuperacao(): AbstractControl | null {
    return this.formRecuperacao.get("emailRecuperacao");
  }

  public async login() {
    const email = this.email?.value;
    const senha = this.senha?.value;

    try {
      const resposta = await this.authService.login(email, senha);

      if (resposta?.user) {
        this.router.navigate(["/painel"]);
      }

    } catch (error: any) {
      this.toastrService.error(error, "Falha na tentativa de login");
    }
  }

  public async abrirModalRecuperacao(modal: TemplateRef<any>) {
      try{
        const resultado = await this.modalService.open(modal).result;
      
        if (resultado === "enviar") {
          this.authService.resetarSenha(this.emailRecuperacao?.value);
        
          this.toastrService.success(`Um email com instruções de recuperação foi enviado com sucesso para: ${this.emailRecuperacao?.value}.`, "Email de recuperação enviado");
        }
      }
      catch(error) {
        if (error != "0" && error != "1" && error != "fechar")
        this.toastrService.error("Houve um erro ao tentar enviar o email! Verifique o endereço.", "Falha na recuperação de conta")
      }
  }
}
