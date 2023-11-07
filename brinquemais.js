const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");


//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/brinquemais',
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

//configurando os roteamentos


app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

    if(  email == null || senha == null){
        return res.status(400).json({error : "preencha todos os campos"})
    }

    const emailexiste= await Usuario.findOne({email:email})
    if(emailexiste){
        return res.status(400).json({error:"o email cadastrado ja existe "})
    }

    const usuario = new Usuario({
        email : email,
        senha : senha,
    })


    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", UsuarioId : newUsuario._id});
    } 
    catch(error){
        res.status(400).json((error));
    }


});



//CADASTRO DO PRODUTO
const ProdutobrinquedoSchema = new mongoose.Schema({
    id_produtobrinquedo : {type : String, required : true},
    descricao : { type : String},
    marca : { type : String},
    idadelimite : {type : Number},
    datafabricacao : {type : Date}

});

const Produtobrinquedo = mongoose.model("Produtobrinquedo", ProdutobrinquedoSchema);

app.post("/cadastroproduto", async(req, res)=>{
    const id_produtobrinquedo = req.body.id_produtobrinquedo;
    const descricao = req.body.descricao;
    const marca = req.body.marca;
    const idadelimite = req.body.idadelimite;
    const datafabricacao = req.body.datafabricacao;
    


    const produtobrinquedo = new Produtobrinquedo({
        id_produtobrinquedo : id_produtobrinquedo,
        descricao : descricao,
        marca : marca,
        idadelimite : idadelimite,
        datafabricacao : datafabricacao,
    })

    const idadelimitetotal = idadelimite

     if(idadelimitetotal>35){
        return res.status(400).json({error : "A idade limite é maior do que é possível"})
    }

    else if (idadelimitetotal<=0){
        return res.status(400).json({error : "Coloque um valor positivo que seja menor que 35"})
    }

    
    //testando se todos os campos foram preenchidos
    if(  id_produtobrinquedo == null || descricao == null || marca == null || idadelimite == null || datafabricacao == null ){
        return res.status(400).json({error : "preencha todos os campos"})
    }


   
    
    try{
        const newprodutobrinquedo = await produtobrinquedo.save();
        res.json({error : null, msg : "Cadastro ok", produtobrinquedoId : newprodutobrinquedo._id});
    } catch(error){
        res.status(400).json({error : "preencha todos os campos"});
    }


});

//rota para o ge de cadastro
app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/cadastroproduto", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroproduto.html");
})


app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})