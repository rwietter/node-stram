export type Paciente = {
  COD_IBGE: string
  MUNICIPIO: string
  COD_REGIAO_COVID: string
  REGIAO_COVID: string
  SEXO: string
  FAIXAETARIA: string
  IDADE: string
  CRITERIO: string
  DATA_CONFIRMACAO: string
  DATA_SINTOMAS: string
  DATA_INCLUSAO: string
  DATA_EVOLUCAO: string
  EVOLUCAO: string | boolean
  HOSPITALIZADO: string | boolean
  UTI: string | boolean
  FEBRE: string | boolean
  TOSSE: string | boolean
  GARGANTA: string | boolean
  DISPNEIA: string | boolean
  OUTROS: string | boolean
  CONDICOES: string
  GESTANTE: string
  DATA_INCLUSAO_OBITO: string
  DATA_EVOLUCAO_ESTIMADA: string | boolean
  RACA_COR: string
  ETNIA_INDIGENA: string | boolean
  PROFISSIONAL_SAUDE: string
  BAIRRO: string
  SRAG: string | boolean
}

type LowerCase<T> = {
  [K in keyof T as Lowercase<string & K>]: T[K]
}

export type IPaciente = LowerCase<Paciente>
