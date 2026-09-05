import { config } from '../config/config.js';
import passport from 'passport';


export const authenticateJwt = (req, res, next) => {

    passport.authenticate("jwt", { session: false }, (err, user) =>{
        if (error) {
            return next(error);
        }
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({error: `No hay usuario autenticado`})
        }
        req.user = user;
    }) (req, res, next);

}