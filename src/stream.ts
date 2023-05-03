import { IPaciente, Paciente } from "../types/Paciente";

const path = require("path");
import fs from 'fs';
import csvtojson from "csvtojson";
const { Readable } = require("node:stream");
import json2csv from 'json2csv';
const parser = require('csv-parser')
// import json2 from 'json-2-csv';
// const { Transform } = require('stream');

const filePath = path.join(__dirname, '..', 'data', '20230502_Ano2022.csv')
const output = path.join(__dirname, '..', 'data', 'out.json')

const adverbToBoolean = (adv: boolean | string) => {
  return adv === 'NAO' ? false : true
}

const headers = [
  'COD_IBGE',
  'MUNICIPIO',
  'COD_REGIAO_COVID',
  'REGIAO_COVID',
  'SEXO',
  'FAIXAETARIA',
  'IDADE',
  'CRITERIO',
  'DATA_CONFIRMACAO',
  'DATA_SINTOMAS',
  'DATA_INCLUSAO',
  'DATA_EVOLUCAO',
  'EVOLUCAO',
  'HOSPITALIZADO',
  'UTI',
  'FEBRE',
  'TOSSE',
  'GARGANTA',
  'DISPNEIA',
  'OUTROS',
  'CONDICOES',
  'GESTANTE',
  'DATA_INCLUSAO_OBITO',
  'DATA_EVOLUCAO_ESTIMADA',
  'RACA_COR',
  'ETNIA_INDIGENA',
  'PROFISSIONAL_SAUDE',
  'BAIRRO',
  'SRAG',
  'FONTE_INFORMACAO',
  'PAIS_NASCIMENTO',
  'PES_PRIV_LIBERDADE',
]

let count = 1;
const readFileStream = () => {
  return Readable.toWeb(fs.createReadStream(filePath))
    .pipeThrough(new TransformStream({
      async transform(chunk, controller) {
        count++;
        try {
          const csv = Buffer.from(chunk).toString()
          console.log(count)
          csvtojson({ delimiter: [';'], headers: headers, output: 'json' }).fromString(csv).then((json: any) => {
            controller.enqueue(JSON.stringify(json))
          })
        } catch (error) {
          console.warn('Error to convert data to json')
        }
      }
    }))
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        try {
          const data = JSON.parse(Buffer.from(chunk).toString())
          const pacientes: IPaciente[] = data.map((paciente: Paciente) => {
            // console.log(paciente)
            return {
              cod_ibge: paciente.COD_IBGE,
              municipio: paciente.MUNICIPIO,
              cod_regiao_covid: paciente.COD_REGIAO_COVID,
              regiao_covid: paciente.REGIAO_COVID,
              sexo: paciente.SEXO,
              faixa_etaria: paciente.FAIXAETARIA,
              idade: paciente.IDADE,
              criterio: paciente.CRITERIO,
              data_confirmacao: paciente.DATA_CONFIRMACAO,
              data_sintomas: paciente.DATA_SINTOMAS,
              data_inclusao: paciente.DATA_INCLUSAO,
              data_evolucao: paciente.DATA_EVOLUCAO,
              evolucao: adverbToBoolean(paciente.EVOLUCAO),
              hospitalizado: adverbToBoolean(paciente.HOSPITALIZADO),
              uti: adverbToBoolean(paciente.UTI),
              febre: adverbToBoolean(paciente.FEBRE),
              tosse: adverbToBoolean(paciente.TOSSE),
              garganta: adverbToBoolean(paciente.GARGANTA),
              dispneia: adverbToBoolean(paciente.DISPNEIA),
              outros: adverbToBoolean(paciente.OUTROS),
              condicoes: paciente.CONDICOES,
              gestante: paciente.GESTANTE,
              data_inclusao_obito: paciente.DATA_INCLUSAO_OBITO,
              data_evolucao_estimada: adverbToBoolean(paciente.DATA_EVOLUCAO_ESTIMADA),
              raca_cor: paciente.RACA_COR,
              etnia_indigena: adverbToBoolean(paciente.ETNIA_INDIGENA),
              profissional_saude: paciente.PROFISSIONAL_SAUDE,
              bairro: paciente.BAIRRO,
              srag: adverbToBoolean(paciente.SRAG),
            }
          })
          controller.enqueue(JSON.stringify(pacientes).concat('\n'))
        } catch (error) {
          console.warn('Error to map data')
        }
      }
    }))
    .pipeTo(new WritableStream({
      async write(chunk) {
        fs.writeFileSync(output, chunk)
      }
    }))
}

readFileStream()

// import json from "../data/out.json"

// console.log(JSON.stringify(json).length)
