import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';

export const rolesAuth = (...permisos) => {

    return (req, res, next) => {

        permisos = permisos.map(p => p.toLowerCase())

        if (permisos.includes("public")){
            
            return next()
        }

        if (!req.user){
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({error: `No hay usuario autenticado`})
        }
        if (!permisos.includes(req.user.role)){
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({error: `Usuario sin privilegios`})
        }

        next()

    }
}