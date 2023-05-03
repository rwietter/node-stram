import { Transform } from "stream";
import { IPaciente, Paciente } from "../types/Paciente";

const path = require("path");
const fs = require('fs');
const csvtojson = require("csvtojson");
const { Readable } = require("node:stream");
// const json2csv = require('json2csv')
const parser = require('csv-parser')
// const { Transform } = require('stream');

const filePath = path.join(__dirname, '..', 'data', '20230502_Ano2022.csv')
const output = path.join(__dirname, '..', 'data', 'out.json')

// const inputStream = fs.createReadStream(filePath);
// const outputStream = fs.createWriteStream(output);

// inputStream.pipe(csvtojson({ delimiter: ";;" }))
//   .on('data', (row: any) => {
//     const json = JSON.stringify(row);
//     console.log(row)
//     // outputStream.write(json + '\n');
//   })
//   .on('end', () => {
//     outputStream.end();
//   });

// const results: any = []

// let count = 1

// fs.createReadStream(filePath)
//   .pipe(parser({ separator: ';' }))
//   .on('data', (data: any) => {
//     if (count === 5000) return data;
//     results.push(data)
//     count += 1
//   })
//   .on('end', () => {
//     fs.writeFileSync(output, JSON.stringify(results, null, 2));
//     console.log('Arquivo convertido para JSON com sucesso!');
//   });

// const json = require('../data/out.json')
// console.log(json.length)

const adverbToBoolean = (adv: boolean | string) => {
  return adv === 'NAO' ? false : true
}

const pacientesTransformStream = new Transform({
  writableObjectMode: true,
  transform(chunk: Paciente, encoding, callback) {
    try {
      const paciente = {
        cod_ibge: Object.values(chunk)[0],
        municipio: chunk.MUNICIPIO,
        cod_regiao_covid: chunk.COD_REGIAO_COVID,
        regiao_covid: chunk.REGIAO_COVID,
        sexo: chunk.SEXO,
        faixa_etaria: chunk.FAIXAETARIA,
        idade: chunk.IDADE,
        criterio: chunk.CRITERIO,
        data_confirmacao: chunk.DATA_CONFIRMACAO,
        data_sintomas: chunk.DATA_SINTOMAS,
        data_inclusao: chunk.DATA_INCLUSAO,
        data_evolucao: chunk.DATA_EVOLUCAO,
        evolucao: adverbToBoolean(chunk.EVOLUCAO),
        hospitalizado: adverbToBoolean(chunk.HOSPITALIZADO),
        uti: adverbToBoolean(chunk.UTI),
        febre: adverbToBoolean(chunk.FEBRE),
        tosse: adverbToBoolean(chunk.TOSSE),
        garganta: adverbToBoolean(chunk.GARGANTA),
        dispneia: adverbToBoolean(chunk.DISPNEIA),
        outros: adverbToBoolean(chunk.OUTROS),
        condicoes: chunk.CONDICOES,
        gestante: chunk.GESTANTE,
        data_inclusao_obito: chunk.DATA_INCLUSAO_OBITO,
        data_evolucao_estimada: adverbToBoolean(chunk.DATA_EVOLUCAO_ESTIMADA),
        raca_cor: chunk.RACA_COR,
        etnia_indigena: adverbToBoolean(chunk.ETNIA_INDIGENA),
        profissional_saude: chunk.PROFISSIONAL_SAUDE,
        bairro: chunk.BAIRRO,
        srag: adverbToBoolean(chunk.SRAG),
      };
      callback(null, JSON.stringify(paciente) + ',');
    } catch (error: any) {
      callback(error);
    }
  }
});

const outputStream = fs.createWriteStream(output);

fs.createReadStream(filePath)
  .pipe(parser({ separator: ';' }))
  .pipe(pacientesTransformStream)
  .pipe(outputStream)
  .on('error', (err: any) => {
    console.warn('Error to write data', err);
  })
  .on('finish', () => {
    console.log('Arquivo salvo com sucesso!');
  });
