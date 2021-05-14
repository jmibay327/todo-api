const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'test'
})

app.get('/tasks', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from tasks order by sort', (err, rows) => {
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('The data from task table are: \n', rows)
        })
    })
})

app.get('/tasks/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from task table are: \n', rows)
        })
    })
});

app.delete('/tasks/remove/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if (!err) {
                res.send(`task with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from task table are: \n', rows)
        })
    })
});

app.post('/tasks/add', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO tasks SET ?', params, (err, rows) => {
        connection.release()
        if (!err) {
            res.send(`task with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from task table are: \n', rows)

        })
    })
});

app.post('/tasks/sort', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, sort } = req.body

        connection.query('UPDATE tasks SET sort = ? WHERE id = ?', [sort, id] , (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`task with the id: ${id} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
});

app.put('/tasks/update', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, title, description } = req.body

        connection.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, id] , (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`task with the title: ${title} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


app.listen(port, () => console.log(`Listening on port ${port}`))
