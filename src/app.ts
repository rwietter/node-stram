import csvtojson from 'csvtojson';
import path from 'path';
import fs from 'fs';

import { headers } from "./constants/headers";

import { toIsoDate } from "./usecases/iso-format";
import { isFieldNull } from "./usecases/field-null";
import { normalizeAgeGroup } from "./usecases/age-group";
import { isTrueField } from "./usecases/adverb-boolean";
import { filterCountryBirth } from "./usecases/country-birth";

const fileCsvPatch = path.join(__dirname, '..', 'data', '20230502_Ano2022.csv')
const outputJSON = path.join(__dirname, '..', 'data', 'out.json')

const inputStream = fs.createReadStream(fileCsvPatch);
let outputStream = fs.createWriteStream(outputJSON);

outputStream.write('[');

const compose = (...fns: any[]) => (value: any) => fns.reduceRight((acc: any, fn: any) => fn(acc), value);

inputStream.pipe(csvtojson({ delimiter: [';'], headers, output: 'json' }))
  .on('data', (chunk: any) => {
    const pacienteJSON = JSON.parse(Buffer.from(chunk).toString());
    const paciente = {
      cod_ibge: compose(isFieldNull)(Object.values(pacienteJSON)[0]),
      municipio: compose(isFieldNull)(pacienteJSON.MUNICIPIO),
      cod_regiao_covid: compose(isFieldNull)(pacienteJSON.COD_REGIAO_COVID),
      regiao_covid: compose(isFieldNull)(pacienteJSON.REGIAO_COVID),
      sexo: compose(isFieldNull)(pacienteJSON.SEXO),
      faixa_etaria: compose(normalizeAgeGroup, isFieldNull)(pacienteJSON.FAIXAETARIA),
      idade: compose(isFieldNull)(pacienteJSON.IDADE),
      criterio: compose(isFieldNull)(pacienteJSON.CRITERIO),
      data_confirmacao: compose(toIsoDate)(pacienteJSON.DATA_CONFIRMACAO),
      data_sintomas: compose(toIsoDate)(pacienteJSON.DATA_SINTOMAS),
      data_inclusao: compose(toIsoDate)(pacienteJSON.DATA_INCLUSAO),
      data_evolucao: compose(toIsoDate)(pacienteJSON.DATA_EVOLUCAO),
      evolucao: compose(isFieldNull)(pacienteJSON.EVOLUCAO), // 100% RECUPERADO
      hospitalizado: compose(isTrueField, isFieldNull)(pacienteJSON.HOSPITALIZADO),
      uti: compose(isTrueField, isFieldNull)(pacienteJSON.UTI),
      febre: compose(isTrueField, isFieldNull)(pacienteJSON.FEBRE),
      tosse: compose(isTrueField, isFieldNull)(pacienteJSON.TOSSE),
      garganta: compose(isTrueField, isFieldNull)(pacienteJSON.GARGANTA),
      dispneia: compose(isTrueField, isFieldNull)(pacienteJSON.DISPNEIA),
      outros_sintomas: compose(isTrueField, isFieldNull)(pacienteJSON.OUTROS),
      condicoes: compose(isFieldNull)(pacienteJSON.CONDICOES),
      gestante: compose(isTrueField, isFieldNull)(pacienteJSON.GESTANTE),
      data_inclusao_obito: compose(toIsoDate, isFieldNull)(pacienteJSON.DATA_INCLUSAO_OBITO),
      data_evolucao_estimada: compose(toIsoDate)(pacienteJSON.DATA_EVOLUCAO_ESTIMADA),
      raca_cor: compose(isFieldNull)(pacienteJSON.RACA_COR),
      // etnia_indigena: compose(filterEtnia_indigena, isFieldNull)(pacienteJSON.ETNIA_INDIGENA), // all null
      profissional_saude: compose(isTrueField, isFieldNull)(pacienteJSON.PROFISSIONAL_SAUDE),
      bairro: compose(isFieldNull)(pacienteJSON.BAIRRO),
      srag: compose(isTrueField, isFieldNull)(pacienteJSON.SRAG),
      pais_nascimento: compose(filterCountryBirth, isFieldNull)(pacienteJSON.PAIS_NASCIMENTO),
      pes_priv_liberdade: compose(isTrueField, isFieldNull)(pacienteJSON.PES_PRIV_LIBERDADE),
    }

    outputStream.write(JSON.stringify(paciente) + ',\n');
  })
  .on('end', () => {
    outputStream.write(']');
    outputStream.end();
  });
