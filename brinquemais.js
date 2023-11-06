const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");


//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/AC',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});


//criando a model do seu projeto
const UsuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : { type : String},
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);



const ProdutoBrinquedoSchema = new mongoose.Schema({
    id_produtobrinquedo : {type : String, required : true},
    descricao : { type : String},
    marca : { type : String},
    idadelimite : {type : Number},
    datafrabricacao : {type : Date}

});

const ProdutoBrinquedo = mongoose.model("ProdutoBrinquedo", ProdutoBrinquedoSchema);


//configurando os roteamentos
app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;


    //testando se todos os campos foram preenchidos
    if(  email == null || senha == null){
        return res.status(400).json({error : "preencha todos os campos"})
    }


    const usuario = new Usuario({
        email : email,
        senha : senha
    })


    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }


});

app.post("/cadastroproduto", async(req, res)=>{
    const id_produtobrinquedo = req.body.id_produtobrinquedo;
    const descricao = req.body.descricao;
    const marca = req.body.marca;
    const idadelimite = req.body.idadelimite;
    const datafrabricacao = req.body.datafrabricacao;
    

    //testando se todos os campos foram preenchidos
    if(  id_produtobrinquedo == null || descricao == null || marca == null || idadelimite == null || datafrabricacao == null ){
        return res.status(400).json({error : "preencha todos os campos"})
    }


    const ProdutoBrinquedo = new ProdutoBrinquedo({
        id_produtobrinquedo : id_produtobrinquedo,
        descricao : descricao,
        marca : marca,
        idadelimite : idadelimite,
        datafrabricacao : datafrabricacao
    })


    try{
        const newProdutoBrinquedo = await ProdutoBrinquedo.save();
        res.json({error : null, msg : "Cadastro ok", pessoaId : newProdutoBrinquedo._id});
    } catch(error){
        res.status(400).json({error});
    }


});



//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})