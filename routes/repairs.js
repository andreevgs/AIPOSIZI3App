const express = require('express');
const router = express();
const axios = require('axios').default;
const fs = require('fs');
const axiosPOSTconfig = {headers: {'Content-Type': 'application/json'}};
const createTableEmployees = require('../api/other/HTMLCreators').createTableEmployees;
const createTableTechnicsRep = require('../api/other/HTMLCreators').createTableTechnicsRep;
const createTableTechnicsHistory = require('../api/other/HTMLCreators').createTableTechnicsHistory;
const objWithMaxProperty = require('../api/other/HTMLCreators').objWithMaxProperty;
const createTableSpares = require('../api/other/HTMLCreators').createTableSpares;
const createOptionsSparesRep = require('../api/other/HTMLCreators').createOptionsSparesRep;

router.get('/', (req, res) => {
    res.render('repairs', {
        title: 'Ремонтная мастерская'
    });
});

router.get('/employees', (req, res) => {
    axios.get('http://localhost:5000/api/repairs/employees')
        .then((response) => {
            console.log(response.data.rows);
            console.log('repairs employees is shown');
            fs.appendFileSync(__dirname + '/../logs.txt', 'repairs employees is shown\n');
            res.render('employees', {
                title: 'Сотрудники ремонтной мастерской',
                link: '/repairs/employees/add',
                table: createTableEmployees(response.data.rows, req.params.id)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/employees/add', (req, res) => {
    res.render('add_employees_repairs', {
        title: 'Добавить сотрудника',
    });
});

router.post('/employees/add', (req, res) => {
    axios.post('http://localhost:5000/api/repairs/employees/add', req.body, axiosPOSTconfig)
        .then((response) => {
            console.log('respones data: ', response.data);
            console.log('body data: ', req.body);
            if(response.data.status){
                console.log('employees is added');
                fs.appendFileSync(__dirname + '/../logs.txt', 'employees is added\n');
                res.redirect('/repairs/employees');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/spares', (req, res) => {
    axios.get('http://localhost:5000/api/repairs/spares')
        .then((response) => {
            console.log(response.data.rows);
            console.log('spares is shown');
            fs.appendFileSync(__dirname + '/../logs.txt', 'spares is shown\n');
            res.render('spares', {
                title: 'Запчасти',
                table: createTableSpares(response.data.rows)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/spares/add', (req, res) => {
    axios.get('http://localhost:5000/api/repairs/spares/add')
        .then((response) => {
            console.log('spares/add', response.data.rows);
            res.render('add_spare', {
                title: 'Добавить запчасть',
                repairs: createOptionsSparesRep(response.data.rows)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.post('/spares/add', (req, res) => {
    axios.post('http://localhost:5000/api/repairs/spares/add', req.body, axiosPOSTconfig)
        .then((response) => {
            console.log('respones data: ', response.data);
            console.log('body data: ', req.body);
            if(response.data.status){
                console.log('spare is added');
                fs.appendFileSync(__dirname + '/../logs.txt', 'spare is added\n');
                res.redirect('/repairs/spares');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/technics', (req, res) => {
    axios.get('http://localhost:5000/api/repairs/technics')
        .then((response) => {
            console.log('spares/add', response.data.result.rows);
            res.render('repairs_technics', {
                title: 'Техника в ремонте',
                subdivision_name: objWithMaxProperty(response.data.result_max.rows),
                table: createTableTechnicsRep(response.data.result.rows)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/technics/:id/history', (req, res) => {
    axios.get('http://localhost:5000/api/repairs/technics/' + req.params.id + '/history')
        .then((response) => {
            console.log('history of moves is shown');
            fs.appendFileSync(__dirname + '/../logs.txt', 'history of moves is shown\n');
            res.render('technics_history', {
                title: 'История перемещений',
                table: createTableTechnicsHistory(response.data.rows)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/technics/:id/done', (req, res) => {
    axios.get('http://localhost:5000/api/repairs/technics/' + req.params.id + '/done')
        .then((response) => {
            if(response.data.status){
                res.redirect('/repairs/technics');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

module.exports = router;