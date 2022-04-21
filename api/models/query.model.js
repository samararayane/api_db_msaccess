const ADODB = require('node-adodb');
const dbConfig = require("../../config/db.config");
const dbConfigDream = require("../../config/db.config_dream");

const connection = ADODB.open(`Provider=${dbConfig.PROVIDER};Data Source=${dbConfig.PATH}`, process.arch.includes('64'));
const connecDream = ADODB.open(`Provider=${dbConfig.PROVIDER};Data Source=${dbConfigDream.PATH}`, process.arch.includes('64'));

const Search = function(searchInfo) {
    this.system = searchInfo.System;
};

Search.findById = async (system, result) => {
    try {
        let resultDB = [];

        const resultDBIrrigation = await connection.query('SELECT TOP 10 "F" & System AS EstacionFiltrado, ' +
                                                          '                      Time AS FechaIrrigacion,  ' +
                                                          '         [Time Water Done] AS TiempoAgua,       ' +
                                                          '         [Last Flow] AS EvaporacionAnterior,    ' +
                                                          '         [Valve A] + [Valve B] + [Valve C] + [Valve D] + [Valve E] AS TotalM3 ' +
                                                          'FROM [Irrigation Information]                   ' +
                                                          'WHERE System = ' + system + '    and Time = "2021-03-23T13:47:00Z"               ' );

        const resultDBWater = await connection.query('SELECT TOP 10 [Counter 1] AS Counter1, ' +
                                                     '              [Counter 2] AS Counter2, ' +
                                                     '              [Counter 3] AS Counter3,  ' +
                                                     '              Time AS dataWater  ' +
                                                     'FROM [Water Counters Accumulation]     ' +
                                                     'WHERE System = ' + system + '          ' );

        resultDBIrrigation.forEach((el, index) => {
            var FechaIrrigacion = resultDBIrrigation[index].FechaIrrigacion;
            var TiempoAgua = resultDBIrrigation[index].TiempoAgua;
            var HorarioRiegoFin = horaFormatar(FechaIrrigacion);
            var HorarioRiegoInicial = toTimestamp(HorarioRiegoFin, FechaIrrigacion, TiempoAgua);

            HorarioRiegoInicial = horaFormatar(HorarioRiegoInicial);

            let HidrometroInicial;
            resultDBWater.forEach((el, index) => HidrometroInicial = resultDBWater[index].Counter1 + resultDBWater[index].Counter2 + resultDBWater[index].Counter3);
            
            let HidrometroFin = HidrometroInicial + resultDBIrrigation[index].TotalM3;

            resultDB.push({
                'FechaIrrigacion': dataFormatar(FechaIrrigacion),
                'EstacionFiltrado': resultDBIrrigation[index].EstacionFiltrado,
                'TiempoAgua': TiempoAgua,
                'HorarioRiegoInicial': HorarioRiegoInicial,
                'HorarioRiegoFin': HorarioRiegoFin,
                'EvaporacionAnterior': resultDBIrrigation[index].EvaporacionAnterior,
                'HidrometroInicial': HidrometroInicial,
                'HidrometroFin': HidrometroFin,
                'TotalM3': resultDBIrrigation[index].TotalM3,
                'dataWater': resultDBWater[index].dataWater,
                'dataIrrig': resultDBIrrigation[index].FechaIrrigacion,
            });
        });

        result(null, JSON.stringify({resultDB}));
    } catch (err) {
        console.error('Err modal: ', err);
        result(null, err);
        return;
    }
};

Search.getAll = async result => {
    try {
        let resultDB = [];

        const resultDBIrrigation = await connection.query('SELECT TOP 10 "F" & System AS EstacionFiltrado, ' +
                                                          '                      Time AS FechaIrrigacion,  ' +
                                                          '         [Time Water Done] AS TiempoAgua,       ' +
                                                          '         [Last Flow] AS EvaporacionAnterior,    ' +
                                                          '         [Valve A] + [Valve B] + [Valve C] + [Valve D] + [Valve E] AS TotalM3 ' +
                                                          'FROM [Irrigation Information]');

        const resultDBWater = await connection.query('SELECT TOP 10 [Counter 1] AS Counter1, ' +
                                                     '              [Counter 2] AS Counter2, ' +
                                                     '              [Counter 3] AS Counter3  ' +
                                                     'FROM [Water Counters Accumulation]');

        resultDBIrrigation.forEach((el, index) => {
            var FechaIrrigacion = resultDBIrrigation[index].FechaIrrigacion;
            var TiempoAgua = resultDBIrrigation[index].TiempoAgua;
            var HorarioRiegoFin = horaFormatar(FechaIrrigacion);
            var HorarioRiegoInicial = toTimestamp(HorarioRiegoFin, FechaIrrigacion, TiempoAgua);

            HorarioRiegoInicial = horaFormatar(HorarioRiegoInicial);

            let HidrometroInicial;
            resultDBWater.forEach((el, index) => HidrometroInicial = resultDBWater[index].Counter1 + resultDBWater[index].Counter2 + resultDBWater[index].Counter3);
            
            let HidrometroFin = HidrometroInicial + resultDBIrrigation[index].TotalM3;

            resultDB.push({
                'FechaIrrigacion': dataFormatar(FechaIrrigacion),
                'EstacionFiltrado': resultDBIrrigation[index].EstacionFiltrado,
                'TiempoAgua': TiempoAgua,
                'HorarioRiegoInicial': HorarioRiegoInicial,
                'HorarioRiegoFin': HorarioRiegoFin,
                'EvaporacionAnterior': resultDBIrrigation[index].EvaporacionAnterior,
                'HidrometroInicial': HidrometroInicial,
                'HidrometroFin': HidrometroFin,
                'TotalM3': resultDBIrrigation[index].TotalM3,
            });
        });

        result(null, JSON.stringify({resultDB}));
    } catch (err) {
        console.error('Err modal: ', err);
        result(null, err);
        return;
    }
};

Search.getAllDream = async result => {
    try {
        let resultDB = [];

        const resultRTAccum = await connecDream.query('SELECT TOP 100 "F" & Line AS EstacionFiltrado, ' +
                                                          '                Dream AS Dream,  ' +
                                                          '          Tact_Number AS Tact_Number,  ' +
                                                          '           Tact_Index AS Tact_Index,  ' +
                                                          '                [Date] AS DateAccum,  ' +
                                                          '                Time AS TimeAccum  ' +
                                                        'FROM RTAccum');

        resultRTAccum.forEach((el, index) => {
            resultDB.push({
                'EstacionFiltrado': resultRTAccum[index].EstacionFiltrado,
                'Dream': resultRTAccum[index].Dream,
                'Tact_Number': resultRTAccum[index].Tact_Number,
                'Tact_Index': resultRTAccum[index].Tact_Index,
                'DateAccum': resultRTAccum[index].DateAccum,
                'TimeAccum': resultRTAccum[index].TimeAccum,
            });
        });

        result(null, JSON.stringify({resultDB}));
    } catch (err) {
        console.error('Err modal: ', err);
        result(null, err);
        return;
    }
};

function toTimestamp(horario, data, tempo) {
    var aux = horario.split(':');
    var dt = new Date(data);

    dt.setHours(aux[0]);
    dt.setMinutes(aux[1]);
    dt.setSeconds(0);

    var dtFormatado = dt.getTime();
    var minutosAdd = dtFormatado - (tempo *60*1000);
    var dataMinAdd = new Date(minutosAdd);

    return dataMinAdd;
}

function horaFormatar(dataIso) {
	var data = new Date(dataIso);

	var horas = data.getHours();
	var minutos = data.getMinutes();

	if(horas < 10) horas = '0' + horas;
	if(minutos < 10) minutos = '0' + minutos;
	
	var segundos = data.getSeconds();
	if(segundos < 10) segundos = '0' + segundos;

	return horas + ':' + minutos + ':' + segundos + '.0';
}

function dataFormatar(data) {
	var data = new Date(data);
	
	dia = data.getDate();
	mes = data.getMonth() + 1;
	ano = data.getFullYear();

	str_dia = new String(dia);
	str_mes = new String(mes);
	
	if (str_dia.length < 2) 
	   str_dia = 0 + str_dia;
	if (str_mes.length < 2) 
	   str_mes = 0 + str_mes;
	
    data = str_dia + '/' + str_mes + '/' + ano;

    return data.toString();
}

module.exports = Search;