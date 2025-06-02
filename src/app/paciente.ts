import { Convenio } from "./convenio";



export interface Paciente {
  pacienteId: number;
  nome: string;
  sobreNome: string;
  dataNascimento: Date;
  genero: string;
  cpf: string;
  rg: string;
  ufrg: string;
  email: string;
  celular: string;
  telefoneFixo: string;
  convenioId: number;
  convenio: Convenio;
  numeroCarteirinha: string;
  validadeCarteirinha: string;
  ativo: boolean;
}
