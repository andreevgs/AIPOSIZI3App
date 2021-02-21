let express = require('express');
let router = express();
const axios = require('axios').default;
const fs = require('fs');
const axiosPOSTconfig = {headers: {'Content-Type': 'application/json'}};

const createTableSubdivisions = require('../api/other/HTMLCreators').createTableSubdivisions;
const createLinkSubdivision = require('../api/other/HTMLCreators').createLinkSubdivision;
const createTableTechnics = require('../api/other/HTMLCreators').createTableTechnics;
const createOptionsSubdivisions = require('../api/other/HTMLCreators').createOptionsSubdivisions;
const createTableEmployees = require('../api/other/HTMLCreators').createTableEmployees;
const createOptionsEmployees = require('../api/other/HTMLCreators').createOptionsEmployees;
const createTableDecoms = require('../api/other/HTMLCreators').createTableDecoms;

router.get('/', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions')
        .then((response) => {
            res.render('subdivisions', {
                title: 'Подразделения',
                subdivisions: createTableSubdivisions(response.data.rows)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
}); 

router.get('/add', (req, res) => {
    res.render('add_subdivision', {
        title: 'Добавить подразделение',
    });
});

router.post('/add', (req, res) => {
    axios.post('http://localhost:5000/api/subdivisions/add', req.body, axiosPOSTconfig)
        .then((response) => {
            if(response.data.status){
                console.log('subdivision is added');
                fs.appendFileSync(__dirname + '/../logs.txt', 'subdivision is added\n');
                res.redirect('/subdivisions');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/employees', (req, res) => {
    if(req.query.sex && req.query.age){
        axios.get('http://localhost:5000/api/subdivisions/employees?sex=' + req.query.sex + '&age=' + req.query.age)
        .then((response) => {
            res.render('all_employees', {
                title: 'Сотрудники',
                link: '/subdivisions/employees/add',
                table: createTableEmployees(response.data.rows, null)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
    }
    else if(!req.query.sex && req.query.age){
        axios.get('http://localhost:5000/api/subdivisions/employees?age=' + req.query.age)
        .then((response) => {
            res.render('all_employees', {
                title: 'Сотрудники',
                link: '/subdivisions/employees/add',
                table: createTableEmployees(response.data.rows, null)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
    }
    else if(req.query.sex && !req.query.age){
        axios.get('http://localhost:5000/api/subdivisions/employees?sex=' + req.query.sex)
        .then((response) => {
            res.render('all_employees', {
                title: 'Сотрудники',
                link: '/subdivisions/employees/add',
                table: createTableEmployees(response.data.rows, null)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
    }
    else if(!req.query.sex && !req.query.age){
        axios.get('http://localhost:5000/api/subdivisions/employees')
        .then((response) => {
            res.render('all_employees', {
                title: 'Сотрудники',
                link: '/subdivisions/employees/add',
                table: createTableEmployees(response.data.rows, null)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
    }
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
    axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics/add', req.body, axiosPOSTconfig)
        .then((response) => {
            if(response.data.status){
                console.log('technics is added');
                fs.appendFileSync(__dirname + '/../logs.txt', 'technics is added\n');
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id/technics', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics')
        .then((response) => {
            res.render('technics', {
                title: 'Техника подразделения',
                link: createLinkSubdivision(req.params.id) + '/technics/add',
                table: createTableTechnics(response.data.rows, req.params.id)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id/technics/:technics_id/edit', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics/' + req.params.technics_id + '/edit')
        .then((response) => {
            res.render('edit_technics', {
                title: 'Редактировать технику',
                name: response.data.result_tech.rows[0].name,
                model: response.data.result_tech.rows[0].model,
                year: response.data.result_tech.rows[0].year,
                subdivisions: createOptionsSubdivisions(response.data.result_subdivisions.rows, req.params.id)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id/decom', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/decom')
        .then((response) => {
            res.render('decom', {
                title: 'Списанная техника',
                table: createTableDecoms(response.data.rows)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id/technics/:technics_id/decom', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics/' + req.params.technics_id + '/decom')
        .then((response) => {
            if(response.data.status) {
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id/technics/:technics_id/torepair', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics/' + req.params.technics_id + '/torepair')
        .then((response) => {
            res.render('add_repairs', {
                title: 'Отправить в ремонт',
                employee_who_gave: createOptionsEmployees(response.data.result_emp.rows),
                employee_who_accepted: createOptionsEmployees(response.data.result_rep_emp.rows),
                employee_who_repair: createOptionsEmployees(response.data.result_rep_emp.rows),
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.post('/:id/technics/:technics_id/torepair', (req, res) => {
    axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics/' + req.params.technics_id + '/torepair', req.body, axiosPOSTconfig)
        .then((response) => {
            console.log('respones data: ', response.data);
            console.log('body data: ', req.body);
            if(response.data.status){
                console.log('technics is replaced to repair');
                fs.appendFileSync(__dirname + '/../logs.txt', 'technics is replaced to repair\n');
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.post('/:id/technics/:technics_id/edit', (req, res) => {
    axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/technics/' + req.params.technics_id + '/edit', req.body, axiosPOSTconfig)
        .then((response) => {
            if(response.data.status){
                res.redirect('/subdivisions/' + req.params.id + '/technics');
            }
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id/employees', (req, res) => {
    axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees')
        .then((response) => {
            res.render('employees', {
                title: 'Сотрудники подразделения',
                link: createLinkSubdivision(req.params.id) + '/employees/add',
                table: createTableEmployees(response.data.rows, req.params.id)
            });
        })
        .catch((error) => {
            console.log('This error has occured: ', error);
        });
});

router.get('/:id*?/employees/add', (req, res) => {
    if(req.params.id){
        axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/add')
            .then((response) => {
                res.render('add_employees', {
                    title: 'Добавить сотрудника',
                    subdivisions: createOptionsSubdivisions(response.data.rows, null)
                });
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
    else {
        axios.get('http://localhost:5000/api/subdivisions/employees/add')
            .then((response) => {
                res.render('add_employees', {
                    title: 'Добавить сотрудника',
                    subdivisions: createOptionsSubdivisions(response.data.rows, null)
                });
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
});

router.post('/:id*?/employees/add', (req, res) => {
    if(req.params.id){
        axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/add', req.body, axiosPOSTconfig)
            .then((response) => {
                if(response.data.status){
                    console.log('employee is added');
                    fs.appendFileSync(__dirname + '/../logs.txt', 'employee is added\n');
                    res.redirect('/subdivisions/' + req.params.id + '/employees');
                }
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
    else {
        axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/add', req.body, axiosPOSTconfig)
            .then((response) => {
                if(response.data.status){
                    console.log('employee is added');
                    fs.appendFileSync(__dirname + '/../logs.txt', 'employee is added\n');
                    res.redirect('/subdivisions/employees');
                }
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
});

router.get('/:id*?/employees/:employee_id/edit', (req, res) => {
    if(req.params.id){
        axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/' + req.params.employee_id + '/edit')
            .then((response) => {
                res.render('edit_employees', {
                    title: 'Добавить сотрудника',
                    subdivisions: createOptionsSubdivisions(response.data.result_sub.rows, response.data.result_emp.rows[0].subdivision_id),
                    name: response.data.result_emp.rows[0].full_name,
                    age: response.data.result_emp.rows[0].age,
                    sex: response.data.result_emp.rows[0].sex,
                    position: response.data.result_emp.rows[0].position
                });
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
    else {
        axios.get('http://localhost:5000/api/subdivisions/employees/' + req.params.employee_id + '/edit')
            .then((response) => {
                res.render('edit_employees', {
                    title: 'Добавить сотрудника',
                    subdivisions: createOptionsSubdivisions(response.data.result_sub.rows, response.data.result_emp.rows[0].subdivision_id),
                    name: response.data.result_emp.rows[0].full_name,
                    age: response.data.result_emp.rows[0].age,
                    sex: response.data.result_emp.rows[0].sex,
                    position: response.data.result_emp.rows[0].position
                });
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
});

router.get('/:id*?/employees/:employee_id/del', (req, res) => {
    if(req.params.id){
        axios.get('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/' + req.params.employee_id + '/del')
            .then((response) => {
                if(response.data.status){
                    res.redirect('/subdivisions/' + req.params.id + '/employees');
                }
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
    else {
        axios.get('http://localhost:5000/api/subdivisions/employees/' + req.params.employee_id + '/del')
            .then((response) => {
                if(response.data.status){
                    res.redirect('/subdivisions/employees');
                }
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
});

router.post('/:id*?/employees/:employee_id/edit', (req, res) => {
    if(req.params.id){
        axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/' + req.params.employee_id + '/edit', req.body, axiosPOSTconfig)
            .then((response) => {
                if(response.data.status){
                    console.log('employee is edited');
                    fs.appendFileSync(__dirname + '/../logs.txt', 'employee is edited\n');
                    res.redirect('/subdivisions/' + req.params.id + '/employees');
                }
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
    else {
        axios.post('http://localhost:5000/api/subdivisions/' + req.params.id + '/employees/' + req.params.employee_id + '/edit', req.body, axiosPOSTconfig)
            .then((response) => {
                if(response.data.status){
                    console.log('employee is edited');
                    fs.appendFileSync(__dirname + '/../logs.txt', 'employee is edited\n');
                    res.redirect('/subdivisions/employees');
                }
            })
            .catch((error) => {
                console.log('This error has occured: ', error);
            });
    }
});

module.exports = router;