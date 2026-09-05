import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';

export const auth = (req, res, next) => {

    // Cuando la validacion es por autoirzacion en token en el header
    // se llama esquema token por portador
    // BEARER TOKEN: BEARER - token enviado por el usuario

    if (!req.cookies.cookietoken){
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({error: `No hay usuario autenticado`})
    }

    // BEARER TOKEN: BEARER - token enviado por el usuario
    // let token = req.headers.authorization.split(" ")[1]
    let token = req.cookies.cookietoken

    try {
        
        let payload = jwt.verify(token, config.general.SECRET)
        req.user = payload
        
    } catch (error) {

        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({error: `Error: ${error.message}`})

    }

    next()

}