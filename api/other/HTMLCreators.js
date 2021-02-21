exports.createTableSubdivisions = (array) => {
    let subdivisionsStr = '';
    let subdivisions = array.map((item) => {
        return '<a href="subdivisions/' + item.id + '">' + item.name + '</a><br/>'
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    })
    return subdivisionsStr;
}

exports.createLinkSubdivision = (param) => {
    return '/subdivisions/' + param;
}

exports.createTableTechnics = (array, param) => {
    let subdivisionsStr = '<table><tr><th>Наименование</th><th>Модель</th><th>Год</th></tr>';
    let subdivisions = array.map((item) => {
        if(item.is_in_repair){
            return '<tr><td>' + item.name + '</td><td>' + item.model + '</td><td>' + item.year + '</td><td>В ремонте</td><td><a href="/subdivisions/' + param + '/technics/' + item.id + '/edit">Редактировать</a></td><td><a href="/subdivisions/' + param + '/technics/' + item.id + '/decom">Списать</a></td></tr>';
        }
        else {
            return '<tr><td>' + item.name + '</td><td>' + item.model + '</td><td>' + item.year + '</td><td><a href="/subdivisions/' + param + '/technics/' + item.id + '/torepair">Отправить в ремонт</a></td><td><a href="/subdivisions/' + param + '/technics/' + item.id + '/edit">Редактировать</a></td><td><a href="/subdivisions/' + param + '/technics/' + item.id + '/decom">Списать</a></td></tr>';
        }
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    });
    subdivisionsStr += '</table>';
    return subdivisionsStr;
}

exports.createOptionsSubdivisions = (array, selectedId) => {
    let subdivisionsStr = '';
    let subdivisions = array.map((item) => {
        if(item.id == selectedId){
            return '<option selected value="' + item.id + '">' + item.name + '</option>'
        }
        else {
            return '<option value="' + item.id + '">' + item.name + '</option>'
        }
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    })
    return subdivisionsStr;
}

exports.createTableEmployees = (array, param) => {
    let subdivisionsStr = '<table><th>ФИО</th><th>Подразделение</th><th>Возраст</th><th>Пол</th><th>Должность</th>';
    let subdivisions = array.map((item) => {
        if(!item.subdivision){
            return '<tr><td>' + item.full_name + '</td><td>Ремонтная мастерская</td><td>' + item.age + '</td><td>' + item.sex + '</td><td>' + item.position + '</td></tr>'
        }
        if(param == null){
            return '<tr><td>' + item.full_name + '</td><td>' + item.subdivision + '</td><td>' + item.age + '</td><td>' + item.sex + '</td><td>' + item.position + '</td><td><a href="/subdivisions/employees/'+ item.id + '/edit">Редактировать</a></td><td><a href="/subdivisions/employees/' + item.id + '/del">Удалить</a></td></tr>'
        }
        return '<tr><td>' + item.full_name + '</td><td>' + item.subdivision + '</td><td>' + item.age + '</td><td>' + item.sex + '</td><td>' + item.position + '</td><td><a href="/subdivisions/' + param + '/employees/' + item.id + '/edit">Редактировать</a></td><td><a href="/subdivisions/' + param + '/employees/' + item.id + '/del">Удалить</a></td></tr>'
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    });
    subdivisionsStr += '</table>';
    return subdivisionsStr;
}

exports.createOptionsEmployees = (array) => {
    let subdivisionsStr = '';
    let subdivisions = array.map((item) => {
        return '<option value="' + item.id + '">' + item.full_name + '</option>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    })
    return subdivisionsStr;
}

exports.createTableTechnicsRep = (array) => {
    let subdivisionsStr = '<table><th>Номер ремонта</th><th>Наименование</th><th>Модель</th><th>Дата передачи</th><th>Тип ремонта</th><th>Время ремонта(дни)</th>';
    let subdivisions = array.map((item) => {
        return '<tr><td>' + item.id + '</td><td>' + item.name + '</td><td>' + item.model + '</td><td>' + item.date_of_hand_over_for_repair + '</td><td>' + item.type_of_repair + '</td><td>' + item.repair_time + '</td><td><a href="/repairs/technics/' + item.technics_id + '/done">Завершить ремонт</a></td><td><a href="/repairs/technics/' + item.technics_id + '/history">История перемещений</a></td></tr>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    });
    subdivisionsStr += '</table>';
    return subdivisionsStr;
}

exports.createTableTechnicsHistory = (array) => {
    let subdivisionsStr = '<table><th>Наименование</th><th>Модель</th><th>Дата перемещения</th><th>Подразделение</th>';
    let subdivisions = array.map((item) => {
        return '<tr><td>' + item.name + '</td><td>' + item.model + '</td><td>' + item.date + '</td><td>' + item.subdivision_name + '</td></tr>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    });
    subdivisionsStr += '</table>';
    return subdivisionsStr;
}

exports.objWithMaxProperty = (array) => {
    let flag = 1;
    let max = array.reduce((prev, cur) => {
        if (prev.count > cur.count) {
            flag = 0;
            return prev;
        }
        if(prev.count < cur.count){
            flag = 0;
        }
        return cur;
    })
    if(flag == 1){
        // console.log('flag: ', flag);
        return 'отсутствует';
    }
    else {
        // console.log('flag: ', flag);
        // console.log('max: ', max);
        return max.name;
    }
}

exports.createTableSpares = (array) => {
    let subdivisionsStr = '<table><th>Наименование</th><th>Стоимость(BYN)</th><th>Дата получения</th><th>Номер ремонта</th>';
    let subdivisions = array.map((item) => {
        return '<tr><td>' + item.name + '</td><td>' + item.cost + '</td><td>' + item.date + '</td><td>' + item.repairs_id + '</td></tr>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    });
    subdivisionsStr += '</table>';
    return subdivisionsStr;
}

exports.createTableDecoms = (array) => {
    let subdivisionsStr = '<table><th>Наименование</th><th>Модель</th><th>Год</th><th>Дата списания</th>';
    let subdivisions = array.map((item) => {
        return '<tr><td>' + item.name + '</td><td>' + item.model + '</td><td>' + item.year + '</td><td>' + item.date + '</td></tr>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    });
    subdivisionsStr += '</table>';
    return subdivisionsStr;
}

exports.createOptionsSparesRep = (array) => {
    let subdivisionsStr = '';
    let subdivisions = array.map((item) => {
        return '<option value="' + item.id + '">' + item.id + '</option>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    })
    return subdivisionsStr;
}

exports.createOptionsNum = (array) => {
    let subdivisionsStr = '';
    let subdivisions = array.map((item) => {
        return '<option value="' + item.name + '">' + item.name + '</option>';
    });
    subdivisions.forEach((item) => {
        subdivisionsStr += item;
    })
    return subdivisionsStr;
}