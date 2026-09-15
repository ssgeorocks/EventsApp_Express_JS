import { Router } from "express";
import { SessionsController } from "../controller/sessionsController.js";
import passport from "passport";
// import { auth } from "../middleware/auth.js";
import { rolesAuth } from "../middleware/authRoles.js";

export const router = Router();

router.post(
    "/register",
    // PASO 3
    passport.authenticate("registro", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    SessionsController.registerV2,
);
router.post(
    "/login",
    passport.authenticate("login", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    SessionsController.loginV2,
);
router.get("/logout", SessionsController.logout);
router.get("/error", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `Error al autenticar` });
});
router.get(
    "/profile/:id",
    passport.authenticate("current", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    SessionsController.getProfile,
);
router.get(
    "/datosuser",
    passport.authenticate("current", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    rolesAuth("user", "organizer", "admin"),
    SessionsController.getUserData,
);
router.get(
    "/datosadmin",
    passport.authenticate("current", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    rolesAuth("admin"),
    SessionsController.getAdminData,
);
router.get(
    "/logingithub",
    passport.authenticate("github", { scope: ["user:email"] }),
);
router.get(
    "/callbackGithub",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    (req, res) => {
        // En caso de exito, el usuario queda registrado en req.user
        res.setHeader("Content-Type", "application/json");
        return res
            .status(200)
            .json({ payload: "Login exitoso", user: req.user });
    },
);
