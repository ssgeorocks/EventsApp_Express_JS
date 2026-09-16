import crypto from "node:crypto";
import passport from "passport";
import passportJWT from "passport-jwt";
import github from "passport-github2";
import local from "passport-local";
import { config } from "../config/config.js";
// import { userModel } from "../models/userModels.js";
import { UsersDAO } from "../dao/UsersDAO.js";
import { generaHash, validaPass } from "../utils/hash.js";

let usersDAO = new UsersDAO();

const buscarToken = (req) => {
    let token = null;

    if (req.cookies.cookietoken) {
        token = req.cookies.cookietoken;
    }

    return token;
};

export const initPassport = () => {
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: "email",
                // passwordField: "clave",
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                try {
                    let { firstName, lastName } = req.body;
                    let email = username.trim().toLocaleLowerCase();
                    if (!firstName || !lastName) {
                        // res.setHeader('Content-Type', 'application/json');
                        // return res.status(401).json({error: `FirstName/LastName son requeridos`})
                        console.log("Fallo por falta de firstName o lastName");
                        return done(null, false);
                    }

                    // Validaciones pertinentes
                    let existe = await usersDAO.getBy({ email: username });
                    if (existe) {
                        console.log("Fallo por usuario ya registrado");
                        return done(null, false);
                    }

                    password = generaHash(password);

                    let user = await usersDAO.create({
                        firstName,
                        lastName,
                        email: email,
                        password,
                    });

                    return done(null, user);
                } catch (error) {
                    console.log(`Fallo por error interno: ${error}`);
                    return done(error); // done(error, user)
                }
            },
        ),
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    if (!username || !password) {
                        console.log("Crendeciales no proporcionadas");
                        return done(null, false, {
                            message: `Campos de registro no proporcionados`,
                        });
                    }

                    username = username.toLowerCase();
                    let user = await usersDAO.getBy({ email: username });

                    if (!user) {
                        console.log("Usuario no validado");
                        return done(null, false, {
                            message: `Usuario no registrado`,
                        });
                    }

                    if (await !validaPass(password, user.password)) {
                        console.log("Usuario no validado");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            },
        ),
    );

    passport.use(
        "current",
        new passportJWT.Strategy(
            {
                secretOrKey: config.general.SECRET,
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
                    buscarToken,
                ]),
            },
            async (payload, done) => {
                try {
                    return done(null, payload);
                } catch (error) {
                    return done(error);
                }
            },
        ),
    );

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: config.github.CLIENTID,
                clientSecret: config.github.CLIENTSECRET,
                callbackURL: config.github.CALLBACKURL,
            },
            async (t1, t2, profile, done) => {
                try {
                    // done(null, false) // fallo de autenticacion
                    // done(null, user) // autenticacion correcta

                    // GitHub puede no exponer el email publico -> usamos un fallback
                    let email =
                        profile._json.email ||
                        profile.emails?.[0]?.value ||
                        `${profile.username}@github.com`;

                    let user = await usersDAO.getBy({ email });
                    if (!user) {
                        // profile._json.name puede venir null si el usuario no tiene nombre configurado
                        let fullName =
                            profile._json.name ||
                            profile.username ||
                            "GitHub User";
                        let [firstName, ...resto] = fullName.trim().split(" ");
                        let lastName = resto.join(" ") || firstName;

                        user = await usersDAO.create({
                            firstName,
                            lastName,
                            email,
                            // usuario de OAuth: no tiene clave propia, generamos una aleatoria
                            password: generaHash(crypto.randomUUID()),
                            profile,
                        });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error); // ocurrio un error
                }
            },
        ),
    );

    // // paso 1 ' solo si uso express-sessions
    // passport.serializeUser((user, done)=>{
    //     return done(null, user._id)
    // })

    // passport.deserializeUser(async(id, done)=>{
    //     // let user={id, name:"Juan"}   // findOne a collection
    //     console.log(id)
    //     let user=await usuariosModelo.findOne({_id: id})
    //     return done(user)
    // })
};

// const cookieExtractor = (req) => {
//     req?.cookies?.[config.general.COOKIE_NAME] || null;
// };

// const bearerOrCookie = (req) => {
//     ExtractJwt.fromAuthHeaderAsBearerToken()(req) || cookieExtractor(req)
// };

// const jwtOptions = {
//     jwtFromRequest: bearerOrCookie,
//     secretOrKey: config.general.SECRET,
// }

// const jwtVerify = async (payload, done) => {
//     try {
//         const user = await UserModel.findById(payload.id); //         let {email, password} = req.body, email = email.toLowerCase()
//         if (!user) {
//             return done(null, false, {message: "User not found"});
//         }
//         return done(null, user);
//     } catch (error) {
//         return done(error);
//     }
// }

// // Definimos una nueva estratejia
// export const initPassport = () => {
//     passport.use(
//         "jwt",
//         new JwtStrategy(
//             {
//                 /* jwtFromRequest: bearerOrCookie,
//                    secretOrKey: env.jwtSecret,
//                 */
//                 usernameField: "email",
//                 passwordField: "password",
//                 passReqToCallback: true,

//             },
//             async (payload, done) => {
//                 try {
//                     const user = await UserModel.findById({emial: payload.email.toLowerCase()});
//                     if (!user) {
//                         return done(null, false, { message: "User not found or invalid credentails"});
//                     }

//                     const isMatch = await bcrypt.compare(password, user.password);
//                     if (!isMatch) {
//                         return done(null, false, { message:"User not found or invalid credentails"});
//                     };

//                     return done(null, user);
//                 } catch (error) {
//                     return done(error);
//                 }
//             },
//         )
//     )
// }

// passport.use("jwt", new JwtStrategy(jwtOptions, jwtVerify))

// passport.use("current", new JwtStrategy(jwtOptions, jwtVerify));

// export const authenticate = passport.authenticate("jwt", { session: false});
