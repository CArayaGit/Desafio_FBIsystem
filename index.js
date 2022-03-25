const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./data/agentes.js');
const app = express();
const palabraSecreta = 'SuperKey';

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.post("/login", (req,res) => {
    //req.query lee body params también
    const { email, pasword } = req.query;
    const user = users.results.find((u) => u.email == email && u.pasword == pasword);

    if (user) {

    const token = jwt.sign(playload, "palabraSecreta", {expiresIn: 120});

    res.send(`
        <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
        Bienvenido, ${email}.

        <script>
            localStorage.setItem('token', JSON.stringify("${token}"))
        </script>
    `);
    } else {
        res.send('Credenciales de acceso incorrectas')
;    }

});

//middleware AUTH:
const requireAuth = (req, res, next) => {
    const {token} = req.query;
    if(!token) return res.status(403).json({msg: 'no existe token'})

    try {
        jwt.verify(token, "palabraSecreta");
        next();
    } catch (error){
        console.log(error);
        if(error.message === 'jwt expired') {
            return res.status(403).json({msg: 'Token expirado'})
        }
        return res.status(401).json({msg: 'Token no válido'});
    }
};

app.get("/Dashboard", requireAuth, (req, res) => {
    
    return res.json({ingresa: 'https://www.cbs.com/shows/fbi/'});
    
});


app.get("/ruta-protegida", (req, res) => {
    //console.log(req.header);
    const {authorization} = req.headers;

    if(!autorization) {
        return res.status(403).json({msg: 'No existe el header'});
    }

    const token = autorization.split(" ")[1];
    //console.log(token);

    if(!token) return res.status(403).json({msg: 'no existe token'})

    try {
        const payload = jwt.verify(token, "palabraSecreta");
        return res.json({playload});
    } catch (error){
        console.log(error);
        if(error.message === 'jwt expired') {
            return res.status(403).json({msg: 'Token expirado'})
        }
        return res.status(401).json({msg: 'Token no válido'});
    }

})

app.listen(5000, console.log('Servidor OK...'));
