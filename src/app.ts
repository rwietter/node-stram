import { headers } from "./constants/headers";
import csvtojson from 'csvtojson';
import path from 'path';
import fs from 'fs';

const fileCsvPatch = path.join(__dirname, '..', 'data', '20230502_Ano2022.csv')
const outputJSON = path.join(__dirname, '..', 'data', 'out.json')

const inputStream = fs.createReadStream(fileCsvPatch);
let outputStream = fs.createWriteStream(outputJSON);

outputStream.write('[');

/**
 * Converte local date string para ISO Date 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
 *
 * Para fazer a conversão inversa considere usar timeZone UTC (toISOString)
 * use: new Date().toLocaleDateString('pt-BR', {timeZone: 'UTC'})

 * @param date:string => DD/MM/YYYY
 * @returns string => YYYY-MM-DD:THH:mm:ss.sssZ
 */
const toIsoDate = (date: string) => {
  if (!date) return null;

  const [day, month, year] = date.split('/');
  const dateISOString = `${year}-${month}-${day}`;

  const dateObject = new Date(dateISOString);
  const gmtBrazil = dateObject.getTimezoneOffset() / 60;
  dateObject.setHours(dateObject.getHours() + gmtBrazil);

  return dateObject.toISOString()
}

const isNull = (value: any) => {
  if (!value) return null;
  return value;
}

const normalizeFaixaEtaria = (faixaEtaria: string) => {
  if (!faixaEtaria) return null;

  if (faixaEtaria === '<1') return `0 a 1`;

  if (faixaEtaria.toLowerCase() === '80 e mais') return `80 a 120`;

  return faixaEtaria.toLowerCase();
}

const compose = (...fns: any[]) => (value: any) => fns.reduceRight((acc: any, fn: any) => fn(acc), value);

inputStream.pipe(csvtojson({ delimiter: [';'], headers, output: 'json' }))
  .on('data', (chunk: any) => {
    const pacienteJSON = JSON.parse(Buffer.from(chunk).toString());
    const paciente = {
      cod_ibge: compose(isNull)(Object.values(pacienteJSON)[0]),
      municipio: compose(isNull)(pacienteJSON.MUNICIPIO),
      cod_regiao_covid: compose(isNull)(pacienteJSON.COD_REGIAO_COVID),
      regiao_covid: compose(isNull)(pacienteJSON.REGIAO_COVID),
      sexo: compose(isNull)(pacienteJSON.SEXO),
      faixa_etaria: compose(normalizeFaixaEtaria, isNull)(pacienteJSON.FAIXAETARIA),
      idade: compose(isNull)(pacienteJSON.IDADE),
      criterio: compose(isNull)(pacienteJSON.CRITERIO),
      data_confirmacao: compose(toIsoDate)(pacienteJSON.DATA_CONFIRMACAO),
      data_sintomas: compose(toIsoDate)(pacienteJSON.DATA_SINTOMAS),
      data_inclusao: compose(toIsoDate)(pacienteJSON.DATA_INCLUSAO),
      data_evolucao: compose(toIsoDate)(pacienteJSON.DATA_EVOLUCAO),
      evolucao: compose(isNull)(pacienteJSON.EVOLUCAO), // 100% RECUPERADO
      hospitalizado: compose(adverbToBoolean, isNull)(pacienteJSON.HOSPITALIZADO),
      uti: compose(adverbToBoolean, isNull)(pacienteJSON.UTI),
      febre: compose(adverbToBoolean, isNull)(pacienteJSON.FEBRE),
      tosse: compose(adverbToBoolean, isNull)(pacienteJSON.TOSSE),
      garganta: compose(adverbToBoolean, isNull)(pacienteJSON.GARGANTA),
      dispneia: compose(adverbToBoolean, isNull)(pacienteJSON.DISPNEIA),
      outros_sintomas: compose(adverbToBoolean, isNull)(pacienteJSON.OUTROS),
      condicoes: compose(isNull)(pacienteJSON.CONDICOES),
      gestante: compose(adverbToBoolean, isNull)(pacienteJSON.GESTANTE),
      data_inclusao_obito: compose(toIsoDate, isNull)(pacienteJSON.DATA_INCLUSAO_OBITO),
      data_evolucao_estimada: compose(toIsoDate)(pacienteJSON.DATA_EVOLUCAO_ESTIMADA),
      raca_cor: compose(isNull)(pacienteJSON.RACA_COR),
      // etnia_indigena: compose(filterEtnia_indigena, isNull)(pacienteJSON.ETNIA_INDIGENA), // all null
      profissional_saude: compose(adverbToBoolean, isNull)(pacienteJSON.PROFISSIONAL_SAUDE),
      bairro: compose(isNull)(pacienteJSON.BAIRRO),
      srag: compose(adverbToBoolean, isNull)(pacienteJSON.SRAG),
    }

    outputStream.write(JSON.stringify(paciente) + ',\n');
  })
  .on('end', () => {
    outputStream.write(']');
    outputStream.end();
  });

const adverbToBoolean = (adv: boolean | string) => {
  return adv === 'NAO' ? false : adv === 'SIM' ? true : null;
}
