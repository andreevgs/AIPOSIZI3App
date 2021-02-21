let express = require('express');
let router = express();
const pg = require('pg');
const fs = require('fs');

const DB_ACCESS = require('../config').DB_ACCESS;
const createTableSubdivisions = require('../api/other/HTMLCreators').createTableSubdivisions;
const createLinkSubdivision = require('../api/other/HTMLCreators').createLinkSubdivision;
const createTableTechnics = require('../api/other/HTMLCreators').createTableTechnics;
const createOptionsSubdivisions = require('../api/other/HTMLCreators').createOptionsSubdivisions;
const createTableEmployees = require('../api/other/HTMLCreators').createTableEmployees;
const createOptionsEmployees = require('../api/other/HTMLCreators').createOptionsEmployees;
const createTableDecoms = require('../api/other/HTMLCreators').createTableDecoms;
const createOptionsNum = require('../api/other/HTMLCreators').createOptionsNum;

const pool = new pg.Pool(DB_ACCESS);

router.get('/', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Subdivisions', [], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            res.render('subdivisions', {
                title: 'Подразделения',
                subdivisions: createTableSubdivisions(result.rows)
            });          
        });
    });
}); 

router.get('/add', (req, res) => {
    res.render('add_subdivision', {
        title: 'Добавить подразделение',
    });
});

router.post('/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO Subdivisions (name) VALUES ($1)', [req.body.name], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            console.log('subdivision is added');
            fs.appendFileSync(__dirname + '/../logs.txt', 'subdivision is added\n');
            res.redirect('/subdivisions'); 
        });
    });
});

router.get('/employees', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        let query;
        if(req.query.sex && req.query.age){
            if(req.query.sex == 'male'){
                query = 'SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id WHERE Employees.sex=\'МУЖ\' AND Employees.age=$1';
                client.query(query, [req.query.age], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    res.render('all_employees', {
                        title: 'Сотрудники',
                        link: '/subdivisions/employees/add',
                        table: createTableEmployees(result.rows, null)
                    });
                });
            }
            if(req.query.sex == 'female'){
                query = 'SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id WHERE Employees.sex=\'ЖЕН\' AND Employees.age=$1';
                client.query(query, [req.query.age], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    res.render('all_employees', {
                        title: 'Сотрудники',
                        link: '/subdivisions/employees/add',
                        table: createTableEmployees(result.rows, null)
                    });
                });
            }
        }
        else if(req.query.sex){
            if(req.query.sex == 'male'){
                query = 'SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id WHERE Employees.sex=\'МУЖ\'';
                client.query(query, [], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    res.render('all_employees', {
                        title: 'Сотрудники',
                        link: '/subdivisions/employees/add',
                        table: createTableEmployees(result.rows, null)
                    });
                });
            }
            if(req.query.sex == 'female'){
                query = 'SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id WHERE Employees.sex=\'ЖЕН\'';
                client.query(query, [], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    res.render('all_employees', {
                        title: 'Сотрудники',
                        link: '/subdivisions/employees/add',
                        table: createTableEmployees(result.rows, null)
                    });
                });
            }
        }
        else if(req.query.age){
            query = 'SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id WHERE Employees.age=$1';
            client.query(query, [req.query.age], function (err, result) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }
                console.log(result.rows);
                res.render('all_employees', {
                    title: 'Сотрудники',
                    link: '/subdivisions/employees/add',
                    table: createTableEmployees(result.rows, null)
                });
            });
        }
        else {
            query = 'SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id';
            client.query(query, [], function (err, result) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }
                res.render('all_employees', {
                    title: 'Сотрудники',
                    link: '/subdivisions/employees/add',
                    table: createTableEmployees(result.rows, null)
                });
            });
        }
    });
});

router.get('/:id', (req, res) => {
    res.render('subdivision', {
        title: 'Подразделение',
        link: createLinkSubdivision(req.params.id)
    }); 
});

router.get('/:id/technics/add', (req, res) => {
    res.render('add_technics', {
        title: 'Добавить технику',
    });
});

router.post('/:id/technics/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO Technics (name, model, year, subdivision_id, is_decom) VALUES ($1, $2, $3, $4, 0) RETURNING id', [req.body.name, req.body.model, req.body.year, req.params.id], function (err, result) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('INSERT INTO Affilation_of_technics (technics_id, subdivision_id, date) VALUES ($1, $2, NOW())', [result.rows[0].id, req.params.id], function(err, result) {
                done();
                console.log('technics is added');
                fs.appendFileSync(__dirname + '/../logs.txt', 'technics is added\n');
                if (err) {
                    return console.error('error happened during query', err);
                }
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            });
        });
    });
});

router.get('/:id/technics', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Technics WHERE subdivision_id=$1 AND is_decom=0', [req.params.id], function (err, result) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('SELECT technics_id FROM Repairs WHERE is_done=0', [], function (err, result_technics) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }
                result.rows.forEach((item) => {
                    result_technics.rows.forEach((item_techs) => {
                        if(item.id == item_techs.technics_id){
                            item.is_in_repair = true;
                        }
                    });
                });
                res.render('technics', {
                    title: 'Техника подразделения',
                    link: createLinkSubdivision(req.params.id) + '/technics/add',
                    table: createTableTechnics(result.rows, req.params.id)
                });
            });
        });
    });
});

router.get('/:id/technics/:technics_id/edit', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Technics WHERE id=$1', [req.params.technics_id], function (err, result_tech) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('SELECT * FROM Subdivisions', [], function (err, result_subdivisions) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }
    
                res.render('edit_technics', {
                    title: 'Редактировать технику',
                    name: result_tech.rows[0].name,
                    model: result_tech.rows[0].model,
                    year: result_tech.rows[0].year,
                    subdivisions: createOptionsSubdivisions(result_subdivisions.rows, req.params.id)
                });
            });
        });
    });
});

router.get('/:id/decom', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Technics WHERE subdivision_id=$1 AND is_decom=1', [req.params.id], function (err, result_tech) {
            if (err) {
                return console.error('error happened during query', err);
            }
            res.render('decom', {
                title: 'Списанная техника',
                table: createTableDecoms(result_tech.rows)
            });
        });
    });
});

router.get('/:id/num', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT DISTINCT name FROM Technics WHERE subdivision_id=$1 AND is_decom=0', [req.params.id], function (err, result_tech) {
            if (err) {
                return console.error('error happened during query', err);
            }
            if(req.query.name){
                client.query('SELECT COUNT(Affilation_of_technics.date) AS count FROM Technics JOIN Affilation_of_technics ON Technics.id=Affilation_of_technics.technics_id WHERE Affilation_of_technics.subdivision_id = $1 AND Technics.name=$2 AND Affilation_of_technics.date >= NOW() - interval \'3 years\'', [req.params.id, req.query.name], function (err, result) {
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    res.render('num_of_technics', {
                        title: 'Количество',
                        link_query: '/subdivisions/' + req.params.id + '/num',
                        technics: createOptionsNum(result_tech.rows),
                        result: 'Количество: ' + result.rows[0].count
                    });
                });
            }
            else {
                res.render('num_of_technics', {
                    title: 'Количество',
                    link_query: '/subdivisions/' + req.params.id + '/num',
                    technics: createOptionsNum(result_tech.rows),
                    result: 'Выберите наименование'
                });
            }
        });
    });
});

router.get('/:id/technics/:technics_id/decom', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        
            client.query('UPDATE Technics SET is_decom=1 WHERE id=$1', [req.params.technics_id], function (err, result_subdivisions) {
                if (err) {
                    return console.error('error happened during query', err);
                }
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            });
        });
});

router.get('/:id/technics/:technics_id/torepair', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Employees WHERE subdivision_id=$1', [req.params.id], function (err, result_emp) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('SELECT * FROM Employees_repair_shop', [], function (err, result_rep_emp) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }    
                res.render('add_repairs', {
                    title: 'Отправить в ремонт',
                    employee_who_gave: createOptionsEmployees(result_emp.rows),
                    employee_who_accepted: createOptionsEmployees(result_rep_emp.rows),
                    employee_who_repair: createOptionsEmployees(result_rep_emp.rows),
                });
            });
        });
    });
});

router.post('/:id/technics/:technics_id/torepair', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO Repairs (technics_id, subdivision_id, date_of_hand_over_for_repair, type_of_repair, repair_time, employee_id_who_gave, employee_id_who_accepted, employee_id_who_repair, is_done) VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, 0)', [req.params.technics_id, req.params.id, req.body.type_of_repair, req.body.repair_time, req.body.employee_id_who_gave, req.body.employee_id_who_accepted, req.body.employee_id_who_repair], function (err, result_tech) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            console.log('technics is replaced to repair');
            fs.appendFileSync(__dirname + '/../logs.txt', 'technics is replaced to repair\n');
            res.redirect('/subdivisions/' + req.params.id + '/technics');
        });
    });
});

router.post('/:id/technics/:technics_id/edit', (req, res) => {
    pool.connect((err, client, done) => {
        done();
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('UPDATE Technics SET name=$1, model=$2, year=$3, subdivision_id=$4 WHERE id=$5', [req.body.name, req.body.model, req.body.year, req.body.subdivision_id, req.params.technics_id], function (err, result) {
            if (err) {
                return console.error('error happened during query', err);
            }
            if(req.body.subdivision_id !== req.params.id){
                client.query('INSERT INTO Affilation_of_technics (technics_id, subdivision_id, date) VALUES ($1, $2, NOW())', [req.params.technics_id, req.body.subdivision_id], function (err, result) {
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    console.log('technics is replaced to another subdivision');
                    fs.appendFileSync(__dirname + '/../logs.txt', 'technics is replaced to another subdivision\n');
                    res.redirect('/subdivisions/' + req.params.id + '/technics');
                });
            }
            else {
                console.log('technics is edited');
                fs.appendFileSync(__dirname + '/../logs.txt', 'technics is edited\n');
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            }
        });
    });
});

router.get('/:id/employees', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT Employees.id, Employees.full_name, Subdivisions.name AS subdivision, Employees.age, Employees.sex, Employees.position FROM Employees JOIN Subdivisions ON Subdivisions.id=Employees.subdivision_id WHERE Employees.subdivision_id=$1', [req.params.id], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            res.render('employees', {
                title: 'Сотрудники подразделения',
                link: createLinkSubdivision(req.params.id) + '/employees/add',
                table: createTableEmployees(result.rows, req.params.id)
            });
        });
    });
});

router.get('/:id*?/employees/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Subdivisions', [], function (err, result) {
            done();
            if (err) {
                return console.error('error happened during query', err);
            }
            res.render('add_employees', {
                title: 'Добавить сотрудника',
                subdivisions: createOptionsSubdivisions(result.rows, null)
            });
        });
    });
});

router.post('/:id*?/employees/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO Employees (full_name, subdivision_id, age, sex, position) VALUES ($1, $2, $3, $4, $5) RETURNING id', [req.body.name, req.body.subdivision_id, req.body.age, req.body.sex, req.body.position], function (err, result_emp) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('INSERT INTO Staff_relocation (employee_id, date, subdivision_id, position) VALUES ($1, NOW(), $2, $3)', [result_emp.rows[0].id, req.body.subdivision_id, req.body.position], function(err, result_reloc) {
                done();
                if (err) {
                    return console.error('error happened during query', err);
                }
                console.log('employee is added');
                fs.appendFileSync(__dirname + '/../logs.txt', 'employee is added\n');
                if(req.params.id){
                    res.redirect('/subdivisions/' + req.params.id + '/employees');
                }
                else {
                    res.redirect('/subdivisions/employees');
                }
            });
        });
    });
});

router.get('/:id*?/employees/:employee_id/edit', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Subdivisions', [], function (err, result_sub) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('SELECT * FROM Employees WHERE id=$1', [req.params.employee_id], function (err, result_emp) {
                if (err) {
                    return console.error('error happened during query', err);
                }
                res.render('edit_employees', {
                    title: 'Добавить сотрудника',
                    subdivisions: createOptionsSubdivisions(result_sub.rows, result_emp.rows[0].subdivision_id),
                    name: result_emp.rows[0].full_name,
                    age: result_emp.rows[0].age,
                    sex: result_emp.rows[0].sex,
                    position: result_emp.rows[0].position
                });
            });
        });
    });
});

router.get('/:id*?/employees/:employee_id/del', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM Employees WHERE id=$1', [req.params.employee_id], function (err, result_tech) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('INSERT INTO Layoffs (full_name, subdivision_id, age, sex, position, date) VALUES ($1, $2, $3, $4, $5, NOW())', [result_tech.rows[0].full_name, result_tech.rows[0].subdivision_id, result_tech.rows[0].age, result_tech.rows[0].sex, result_tech.rows[0].position], function (err, result_subdivisions) {
                if (err) {
                    return console.error('error happened during query', err);
                }
                client.query('DELETE FROM Employees WHERE id=$1', [req.params.employee_id], function (err, result_subdivisions) {
                    done();
                    if (err) {
                        return console.error('error happened during query', err);
                    }
                    if(req.params.id){
                        res.redirect('/subdivisions/' + req.params.id + '/employees');
                    }
                    else {
                        res.redirect('/subdivisions/employees');
                    }
                });
            });
        });
    });
});

router.post('/:id*?/employees/:employee_id/edit', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT subdivision_id FROM Employees WHERE id=$1', [req.params.employee_id], function (err, result_emp) {
            if (err) {
                return console.error('error happened during query', err);
            }
            client.query('UPDATE Employees SET full_name=$1, subdivision_id=$2, age=$3, sex=$4, position=$5 WHERE id=$6', [req.body.name, req.body.subdivision_id, req.body.age, req.body.sex, req.body.position, req.params.employee_id], function(err, result_emp_upd) {
                if (err) {
                    return console.error('error happened during query', err);
                }
                if(result_emp.rows[0].subdivision_id != req.body.subdivision_id){
                    client.query('INSERT INTO Staff_relocation (employee_id, date, subdivision_id, position) VALUES ($1, NOW(), $2, $3)', [req.params.employee_id, req.body.subdivision_id, req.body.position], function(err, result_reloc) {
                        done();
                        if (err) {
                            return console.error('error happened during query', err);
                        }
                        if(req.params.id){
                            res.redirect('/subdivisions/' + req.params.id + '/employees');
                        }
                        else {
                            res.redirect('/subdivisions/employees');
                        }
                    });
                }
                else {
                    console.log('employee is edited');
                    fs.appendFileSync(__dirname + '/../logs.txt', 'employee is edited\n');
                    done();
                    if(req.params.id){
                        res.redirect('/subdivisions/' + req.params.id + '/employees');
                    }
                    else {
                        res.redirect('/subdivisions/employees');
                    }
                }
            });
        });
    });
});

module.exports = router;