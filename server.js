//importando o express
const express = require('express')
const app = express()
const uri = "mongodb+srv://dbUser:dbUser@cluster0.hggis2e.mongodb.net/?retryWrites=true&w=majority"
const {MongoClient, ObjectId }=require('mongodb-legacy')

//para conectar o banco de dados 
const client = new MongoClient(uri);
const db = client.db("teste-db");
const collection = db.collection('crud');

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))

//servidor vai se comunicar com navegador
app.listen(3000,function(){
    console.log('servidor esta na porta 3000')
})

//renderizar o index
app.get('/', (req, res ) => {
    res.render('index.ejs')

app.post("/show", (req, res) => {
    collection.insertOne(req.body, (err,result)=> {
        if(err) return console.log(err)
        console.log("SALVOU COM SUCESSO NO BANCO DE DADOS!!!")
        res.redirect("/show")
        collection.find().toArray((err, results) =>{
            console.log(results)
        })
    })
})

//rederizar e retornar conteudo no nosso banco 
app.get('/', (req, res) => {
    let cursor = db.collection('crud').find()
})

//rederizar e retornar conteudo no nosso banco 
app.get('/show', (req, res) => {
    db.collection('crud').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

//criando a nossa rota e comandos para editar
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id
    console.log(id)
    var id2 =new ObjectId(id)
    console.log(id2)

    db.collection('crud').find({_id:id2}).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    const id2 = new ObjectId(id)
    var name = req.body.name
    var surname = req.body.surname
    const query = {_id: id2}

    db.collection('crud').updateOne(query, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')


    })
})

//criando a nossa rota e comandos para deletar
app.route ('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').deleteOne({_id: new ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletando do nosso banco de dados!')
        res.redirect('/show')
    })
})
app.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    db.collection('userlist').update({ _id: new ObjectId(userToUpdate)}, req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

})