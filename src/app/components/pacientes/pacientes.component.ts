import { PacientesService } from './../../pacientes.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Convenio } from 'src/app/convenio';
import { ConveniosService } from 'src/app/convenios.service';
import { Paciente } from 'src/app/paciente';
import { cpfValidator } from 'src/app/validadorCpf';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  formulario: any;
  tituloFormulario!: string;
  pacientes!: Paciente[];
  convenio!: Convenio[];
  nomePaciente!: string;
  pacienteId!: number;
  listaConvenio$!: Observable<Convenio[]>;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false; 
  
  modalRef!: BsModalRef;

  constructor(private pacientesService: PacientesService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private convenioService: ConveniosService) {
      this.formulario = this.fb.group({
      nome: ['', Validators.required],
      sobreNome: ['', Validators.required],
      cpf: ['', [Validators.required, cpfValidator]],
      dataNascimento: ['', Validators.required],
      convenioId: ['', Validators.required]
      });
    }

    toggleStatus(paciente: any): void {
    // Alterna o valor do campo 'ativo'
    paciente.ativo = !paciente.ativo;

    // Atualiza no backend, por exemplo
    this.pacientesService.AtualizarPaciente(paciente).subscribe(() => {
      console.log(`Paciente ${paciente.nome} está agora ${paciente.ativo ? 'ativo' : 'inativo'}`);
    }, (error) => {
      console.error('Erro ao atualizar paciente', error);
      // Caso dê erro, pode reverter o toggle
      paciente.ativo = !paciente.ativo;
    });
  }

  ngOnInit(): void {
      this.convenioService.PegarTodos().subscribe((resultado) => {
      this.convenio = resultado;
      });

    this.pacientesService.PegarTodos().subscribe((resultado) => {
      this.pacientes = resultado;
    });
  }

  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Novo Paciente';
    
    this.formulario = this.fb.group({
    nome: [null, Validators.required],
    sobreNome: [null, Validators.required],
    cpf: [null, [Validators.required, cpfValidator]],
    dataNascimento: ['', Validators.required],
    genero: [null, Validators.required],
    rg: [null, Validators.required],
    ufrg: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    celular: [null, Validators.required],
    telefoneFixo: [''],
    numeroCarteirinha: [null, Validators.required],
    validadeCarteirinha: [null, Validators.required],
    ativo: [true],
    convenioId: [null, Validators.required]
  });
}

  ExibirFormularioAtualizacao(pacienteId: number): void {
  this.pacientesService.PegarPeloId(pacienteId).subscribe((resultado) => {
    this.tituloFormulario = `Atualizar ${resultado.nome} ${resultado.sobreNome}`;

    const data = new Date(resultado.dataNascimento);
    const dataFormatada = data.toISOString().substring(0, 10);

    // ✅ Formatando validadeCarteirinha de 062025 -> 06/2025
    let validadeFormatada = resultado.validadeCarteirinha;
    if (validadeFormatada && validadeFormatada.length === 6) {
      validadeFormatada = validadeFormatada.substring(0, 2) + '/' + validadeFormatada.substring(2);
    }

    this.formulario = new FormGroup({
      pacienteId: new FormControl(resultado.pacienteId),
      nome: new FormControl(resultado.nome),
      sobreNome: new FormControl(resultado.sobreNome),
      cpf: new FormControl(resultado.cpf),
      dataNascimento: new FormControl(dataFormatada),
      genero: new FormControl(resultado.genero),
      rg: new FormControl(resultado.rg),
      ufrg: new FormControl(resultado.ufrg),
      email: new FormControl(resultado.email),
      celular: new FormControl(resultado.celular),
      telefoneFixo: new FormControl(resultado.telefoneFixo),
      convenioId: new FormControl(resultado.convenioId),
      numeroCarteirinha: new FormControl(resultado.numeroCarteirinha),
      validadeCarteirinha: new FormControl(validadeFormatada),
      ativo: new FormControl(resultado.ativo)
    });

    if(resultado.ativo == false)
    {
      this.formulario.disable();
    }

    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
  });
}

formatarValidadeCarteirinha(valor: string): string {
  if (valor && valor.length === 6) {
    return valor.substring(0, 2) + '/' + valor.substring(2);
  }
  return valor;
}

mascararRG(event: any): void {
  let valor = event.target.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '');

  // Aplica a máscara: 00.000.000-0
  if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
  }
  if (valor.length > 6) {
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  }
  if (valor.length > 9) {
    valor = valor.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  // Atualiza o valor no input
  event.target.value = valor;

  // Atualiza também o valor no form control
  this.formulario.get('rg')?.setValue(valor, { emitEvent: false });
}

mascararCelular(event: any): void {
  let valor = event.target.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '');

  // Aplica a máscara: (99) 99999-9999
  if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
  }
  if (valor.length > 7) {
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  }

  // Atualiza o valor no input
  event.target.value = valor;

  // Atualiza também o valor no form control
  this.formulario.get('celular')?.setValue(valor, { emitEvent: false });
}

mascararValidade(event: any): void {
  let valor = event.target.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '');

  // Aplica a máscara: MM/YYYY visualmente
  if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,4})/, '$1/$2');
  }

  // Limita a 7 caracteres (MM/YYYY)
  if (valor.length > 7) {
    valor = valor.substring(0, 7);
  }

  event.target.value = valor;

  // Atualiza o form control com a máscara visual
  this.formulario.get('validadeCarteirinha')?.setValue(valor, { emitEvent: false });
}


campoInvalido(campo: string): boolean {
  const controle = this.formulario.get(campo);
  return controle ? controle.invalid && (controle.dirty || controle.touched) : false;
}

  validarCpf(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  EnviarFormulario(): void {
    const paciente: Paciente = this.formulario.value;
    paciente.validadeCarteirinha = paciente.validadeCarteirinha.replace('/', '');

    this.formulario.markAllAsTouched();
      if (this.formulario.invalid) {
        return;
      }


    if (paciente.pacienteId > 0) {
      this.pacientesService.AtualizarPaciente(paciente).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Paciente atualizado com sucesso');
        this.pacientesService.PegarTodos().subscribe((registros) => {
          this.pacientes = registros;
        });
      });
    } else {
      this.pacientesService.SalvarPaciente(paciente).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Paciente inserido com sucesso');
        this.pacientesService.PegarTodos().subscribe((registros) => {
          this.pacientes = registros;
        });
      });
    }
  }

  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
  }

  ExibirConfirmacaoExclusao(pacienteId: number, nome: string, conteudoModal: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.pacienteId = pacienteId;
    this.nomePaciente = nome;
  }

  ExcluirPaciente(pacienteId: number){
    this.pacientesService.ExcluirPaciente(pacienteId).subscribe(resultado => {
      this.modalRef.hide();
      alert('Paciente excluído com sucesso');
      this.pacientesService.PegarTodos().subscribe(registros => {
        this.pacientes = registros;
      });
    });
  }
}