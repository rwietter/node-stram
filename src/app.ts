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
  return new Date(dateISOString).toISOString();
}

inputStream.pipe(csvtojson({ delimiter: [';'], headers, output: 'json' }))
  .on('data', (chunk: any) => {
    const pacienteJSON = JSON.parse(Buffer.from(chunk).toString());
    const paciente = {
      cod_ibge: Object.values(pacienteJSON)[0],
      municipio: pacienteJSON.MUNICIPIO,
      cod_regiao_covid: pacienteJSON.COD_REGIAO_COVID,
      regiao_covid: pacienteJSON.REGIAO_COVID,
      sexo: pacienteJSON.SEXO,
      faixa_etaria: pacienteJSON.FAIXAETARIA,
      idade: pacienteJSON.IDADE,
      criterio: pacienteJSON.CRITERIO,
      data_confirmacao: toIsoDate(pacienteJSON.DATA_CONFIRMACAO),
      data_sintomas: toIsoDate(pacienteJSON.DATA_SINTOMAS),
      data_inclusao: toIsoDate(pacienteJSON.DATA_INCLUSAO),
      data_evolucao: toIsoDate(pacienteJSON.DATA_EVOLUCAO),
      evolucao: pacienteJSON.EVOLUCAO,
      hospitalizado: adverbToBoolean(pacienteJSON.HOSPITALIZADO),
      uti: adverbToBoolean(pacienteJSON.UTI),
      febre: adverbToBoolean(pacienteJSON.FEBRE),
      tosse: adverbToBoolean(pacienteJSON.TOSSE),
      garganta: adverbToBoolean(pacienteJSON.GARGANTA),
      dispneia: adverbToBoolean(pacienteJSON.DISPNEIA),
      outros: adverbToBoolean(pacienteJSON.OUTROS),
      condicoes: pacienteJSON.CONDICOES,
      gestante: adverbToBoolean(pacienteJSON.GESTANTE),
      data_inclusao_obito: pacienteJSON.DATA_INCLUSAO_OBITO,
      data_evolucao_estimada: pacienteJSON.DATA_EVOLUCAO_ESTIMADA,
      raca_cor: pacienteJSON.RACA_COR,
      etnia_indigena: pacienteJSON.ETNIA_INDIGENA,
      profissional_saude: adverbToBoolean(pacienteJSON.PROFISSIONAL_SAUDE),
      bairro: pacienteJSON.BAIRRO,
      srag: adverbToBoolean(pacienteJSON.SRAG),
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
