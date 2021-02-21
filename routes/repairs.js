const express = require('express');
const router = express();
const pg = require('pg');
const fs = require('fs');
const DB_ACCESS = require('../config').DB_ACCESS;
const createTableEmployees = require('../api/other/HTMLCreators').createTableEmployees;
const createTableTechnicsRep = require('../api/other/HTMLCreators').createTableTechnicsRep;
const createTableTechnicsHistory = require('../api/other/HTMLCreators').createTableTechnicsHistory;
const objWithMaxProperty = require('../api/other/HTMLCreators').objWithMaxProperty;
const createTableSpares = require('../api/other/HTMLCreators').createTableSpares;
const createOptionsSparesRep = require('../api/other/HTMLCreators').createOptionsSparesRep;

const pool = new pg.Pool(DB_ACCESS);

router.get('/', (req, res) => {
    res.render('repairs', {
        title: 'Ремонтная мастерская'
    });
});

router.get('/employees', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Employees_repair_shop', [], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            console.log('repairs employees is shown');
            fs.appendFileSync(__dirname + '/../logs.txt', 'repairs employees is shown\n');
            res.render('employees', {
                title: 'Сотрудники ремонтной мастерской',
                link: '/repairs/employees/add',
                table: createTableEmployees(result.rows, req.params.id)
            });
        });
    });
});

router.get('/employees/add', (req, res) => {
    res.render('add_employees_repairs', {
        title: 'Добавить сотрудника',
    });
});

router.post('/employees/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO Employees_repair_shop (full_name, age, sex, position) VALUES ($1, $2, $3, $4) RETURNING id', [req.body.name, req.body.age, req.body.sex, req.body.position], function (err, result_emp) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            console.log('employee is added');
            fs.appendFileSync(__dirname + '/../logs.txt', 'employee is added\n');
            res.redirect('/repairs/employees');
        });
    });
});

router.get('/spares', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT name, cost, date, repairs_id FROM Spares', [], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            console.log('spares is shown');
            fs.appendFileSync(__dirname + '/../logs.txt', 'spares is shown\n');
            
            res.render('spares', {
                title: 'Запчасти',
                table: createTableSpares(result.rows)
            });
        });
    });
});

router.get('/spares/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT id FROM Repairs WHERE is_done=0', [], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            
            res.render('add_spare', {
                title: 'Добавить запчасть',
                repairs: createOptionsSparesRep(result.rows)
            });
        });
    });
});

router.post('/spares/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO Spares (name, cost, repairs_id, date) VALUES ($1, $2, $3, NOW())', [req.body.name, req.body.cost, req.body.repairs_id], function (err, result_spare) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            console.log('spare is added');
            fs.appendFileSync(__dirname + '/../logs.txt', 'spare is added\n');
            res.redirect('/repairs/spares');

        });
    });
});

router.get('/technics', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT MAX(Subdivisions.name) AS Name, MAX(Repairs.subdivision_id) AS Subdivision_id, COUNT(Repairs.subdivision_id) AS Count FROM Repairs JOIN Subdivisions ON Subdivisions.id = Repairs.subdivision_id GROUP BY (Repairs.subdivision_id)', [], function (err, result_max) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('SELECT Technics.name, Technics.model, Repairs.id, Repairs.date_of_hand_over_for_repair, Repairs.type_of_repair, Repairs.repair_time, Repairs.technics_id FROM Technics JOIN Repairs ON Repairs.technics_id = Technics.id WHERE Repairs.is_done=0', [], function (err, result) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }
                res.render('repairs_technics', {
                    title: 'Техника в ремонте',
                    subdivision_name: objWithMaxProperty(result_max.rows),
                    table: createTableTechnicsRep(result.rows)
                });
            });
        });
    });
});

router.get('/technics/:id/history', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT Technics.name, Technics.model, Subdivisions.name AS subdivision_name, Affilation_of_technics.date FROM Affilation_of_technics JOIN Technics ON Affilation_of_technics.technics_id = Technics.id JOIN Subdivisions ON Affilation_of_technics.subdivision_id = Subdivisions.id WHERE Affilation_of_technics.technics_id=$1 ORDER BY (Affilation_of_technics.date)', [req.params.id], function (err, result_techs) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }

            console.log('history of moves is shown');
            fs.appendFileSync(__dirname + '/../logs.txt', 'history of moves is shown\n');
            res.render('technics_history', {
                title: 'История перемещений',
                table: createTableTechnicsHistory(result_techs.rows)
            });
        });
    });
});

router.get('/technics/:id/done', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('UPDATE Repairs SET is_done=1 WHERE technics_id=$1', [req.params.id], function (err, result_techs) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            res.redirect('/repairs/technics');
        });
    });
});

module.exports = router;