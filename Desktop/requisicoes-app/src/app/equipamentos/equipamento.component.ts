import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastrService: ToastrService
    
  ) { }

  ngOnInit(): void {
      this.equipamentos$ = this.equipamentoService.selecionarTodos();
  
      this.form = this.fb.group({
        id: new FormControl(""),
        numeroDeSerie: new FormControl("", [Validators.required]),
        nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
        preco: new FormControl("", [Validators.required, Validators.min(0)]),
        dataFabricacao: new FormControl("", [Validators.required])
      })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(){
    return this.form.get("id");
  }

  get numeroDeSerie() {
    return this.form.get("numeroDeSerie");
  }

  get nome() {
    return this.form.get("nome");
  }

  get preco() {
    return this.form.get("preco");
  }

  get dataFabricacao() {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    if (equipamento)
      this.form.setValue(equipamento);



    try {
      await this.modalService.open(modal).result;
      
    if(this.form.dirty && this.form.valid){
      if (!equipamento)
      await this.equipamentoService.inserir(this.form.value)
    else
      await this.equipamentoService.editar(this.form.value);

      this.toastrService.success(`O equipamento foi salvo com sucesso`,"Cadastro de Equipamentos");
    }
    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente","Cadastro de Equipamentos");
    }

  }

  public excluir(equipamento: Equipamento) {
    try{
    this.equipamentoService.excluir(equipamento);
    
    this.toastrService.success(`O equipamento foi excluido com sucesso`,"Cadastro de Equipamentos");
    } catch (error) {
      this.toastrService.error("Houve um erro ao excluir o equipamento. Tente novamente","Cadastro de Equipamentos");
   }
  }

}
