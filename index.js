const express = require('C:/Users/a1/AppData/Roaming/npm/node_modules/express');
const connectDB = require('./connect')
const cors = require('C:/Users/a1/AppData/Roaming/npm/node_modules/cors');
const bodyParser = require('C:/Users/a1/AppData/Roaming/npm/node_modules/body-parser');
require('C:/Users/a1/AppData/Roaming/npm/node_modules/dotenv').config()
const path = require('path');
const app = express()
const port = 3000


app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/static'));

// Create a connection with mysql database
const con = connectDB();

// Check database connection
con.connect((err) => {
    if (err){
        console.log(err);
    }else{   
        console.log("Conneted to the database!");
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/news', (req, res) => {
    // res.send("all news are here")
    // console.log(req);
    // get data from database and render it on page
    con.query('SELECT * FROM news', (err, result) => {
        if (err) throw err;
        console.log(result);
        // console.log(result.length);
        // console.log(result[0]);
        // console.log(result[0].name);
        res.json(result.rows)
        // res.send(`name : ${see.name} , email : ${see.email} and ${result}`)
    })
})

app.get('/news/:id', (req, res) => {
    const reqId = req.params.id;
    // console.log(req);
    // console.log(req.params);
    // res.send("get news with id : "+reqId)
    // con.query('SELECT * FROM news WHERE news_id=?', [reqId], (err, result) => {
    con.query(`SELECT * FROM news WHERE news_id=${reqId}`, (err, result) => {
        if (err) throw err
        console.log(result.length);
        res.json(result.rows)
    })
})

app.post('/news', (req, res) => {
    let d= new Date()
    console.log(req.body);
    const sql = `INSERT INTO news (title,news_link,image_link,news_host,posted_in) VALUES ('${req.body.title}','${req.body.news_link}','${req.body.image_link}','${req.body.news_host}','${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}')`;
    // const sql = `INSERT INTO news title='${req.body.title}',news_link='${req.body.news_link}',image_link='${req.body.image_link}',news_host='${req.body.news_host}',posted_in='${new Date()}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Given News Created Successfully....")
    })
    // res.json("Post request reseived")

})

app.put('/news', (req, res) => {
    let d=new Date()
    if (req.body.id < 6) {
        res.json()
    } else {
        // const sql = `UPDATE news SET title='${req.body.title}',news_link='${req.body.news_link}',image_link='${req.body.image_link}',news_host='${req.body.news_host}',posted_in='${new Date()}' WHERE news_id=${req.body.id}`; 
        // error: time zone "gmt+0530" not recognized

        const sql = `UPDATE news SET title='${req.body.title}',news_link='${req.body.news_link}',image_link='${req.body.image_link}',news_host='${req.body.news_host}',posted_in='${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}' WHERE news_id=${req.body.id}`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('update ', +result);
            const rsql = `SELECT * FROM news WHERE news_id=${req.body.id}`;
            con.query(rsql, (err, result) => {
                if (err) throw err;
                console.log('return update ', +result.rows);
                res.json(result.rows)
            })
        })
    }
    // res.send(`Update news ${reqId}`)
})

app.delete('/news', (req, res) => {
    if (req.body.id < 6) {
        res.json()
    } else {
        const sql = `DELETE FROM news WHERE news_id=${req.body.id}`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('News successfully deleted....');
            res.send('News successfully deleted....')
        })
    }
})
app.listen(port, () => {
    console.log(`Server currently run on http://localhost:${port}`);
})