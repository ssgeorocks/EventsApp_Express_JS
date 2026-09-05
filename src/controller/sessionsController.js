import { config } from "../config/config.js";
import { userModel } from "../models/userModels.js";
import { generaHash, validaPass } from "../utils/hash.js"
import jwt from 'jsonwebtoken'

export class SessionsController{

    static async register(req, res){
        try{

            let {firstName, lastName, email, password}=req.body
            if(!firstName || !lastName || !email || !password){

                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({error: `Faltan datos requeridos`})
            }

            // Normlizacion
            email = email.trim().toLowerCase()

            // Validaciones
            password = generaHash(password)
            let newUser = await userModel.create({firstName, lastName, email, password})
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json({message: "User registered succesfully", newUser})

        } catch (error) {
            
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error: `Internal error: ${error.message}`})
        }
    }

    static async registerV2(req, res){
        try{

            let {firstName, lastName, email, password}=req.body

            // Si el authenticate sale bien
            // passport deja un properoty user en la req
            // con los datos del usuario
            let user = req.user
            
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json({message: "User registered succesfully", user})

        } catch (error) {
            
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error: `Internal error: ${error.message}`})
        }
    }

    static async login(req, res){
            
        let {email, password} = req.body
        email = email.toLowerCase()

        if (!email || !password){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error: `Faltan campos de inicio de sesion.`})
        }

        try{

            let user = await userModel.findOne({email}).lean()
            console.log(user.password)
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({error: `Credenciales invalidas.`})
            }

            const validPassword = await validaPass(password, user.password)

            if (!validPassword){
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({error: `Credenciales invalidas.`})
            }

            // user sin datos sensibles
            // objetc js plano
            // dto transforma/limpieza de la informacion
            // Creacion de token de inicio de sesion
            let tokenUser = {
                id: user._id,
                email: user.email,
                role: user.role
            }
            let token = jwt.sign(tokenUser, config.general.SECRET, {expiresIn:"1h", noTimestamp: true})

            // Inicio de sesion correcta
            res.cookie("cookietoken", token, {httpOnly: true, maxAge: 1000*60*60})
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({payload: `Login exitoso de ${req.user.firstName}`, user});

        } catch (error) {
            
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error: `Internal error: ${error.message}`})
        }
    }

    static async loginV2(req, res){
            
        let {email, password} = req.body

        try{

            let user = req.user

            // Inicio de sesion correcta
            let tokenUser = {
                id: user._id,
                email: user.email,
                role: user.role
            }
            let token = jwt.sign(tokenUser, config.general.SECRET, {expiresIn:"1h", noTimestamp: true})

            // Inicio de sesion correcta
            res.cookie("cookietoken", token, {httpOnly: true, maxAge: 1000*60*60})
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({payload: `Login exitoso de ${req.user.firstName}`, user});

        } catch (error) {
            
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error: `Internal error: ${error.message}`})
            
        }
    }

    static async logout(req,res){
        res.clearCookie("cookietoken")
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({payload: "Logout exitoso."})

    }
}