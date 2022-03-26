const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./data/agentes.js');
const app = express();
const palabraSecreta = 'SuperKey';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send(__dirname + 'index.html');
});

app.get("/SignIn", (req,res) => {
    const { email, password } = req.query;
    const user = users.results.find((u) => u.email == email && u.password == password);

    if (user) {
    
        const token = jwt.sign(
            {
            exp: Math.floor(Date.now() / 1000) + 120,
            data: user,
            },
            palabraSecreta
        );
        
        res.send(`
            <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
            Bienvenido, ${email}.

            <script>
                localStorage.setItem('token', JSON.stringify("${token}"))
            </script>
        `);
        } else {
            res.send('Credenciales de acceso incorrectas')
        }
    });

//middleware AUTH:
const requireAuth = (req, res, next) => {
    const {token} = req.query;
    if(!token) return res.status(403).json({msg: 'no existe token'})

    try {
        jwt.verify(token, palabraSecreta);
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
    //return res.json({ingresa: 'https://www.cbs.com/shows/fbi/'});
    return res.redirect('https://www.cbs.com/shows/fbi/');
    
});

app.listen(5000, console.log('Servidor OK...'));
