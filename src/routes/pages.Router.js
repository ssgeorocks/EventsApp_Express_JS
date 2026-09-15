import { Router } from "express";
import path from "node:path";
import jwt from "jsonwebtoken"
import passport from "passport";
import { config } from "../config/config.js"

export const router = Router();

const getAuthUser = (req) => {
    try {
        return jwt.verify(req.cookies.cookietoken, config.general.SECRET);
    } catch {
        return null;
    }
};

router.get("/", (req, res) => {
    const user = getAuthUser(req)
    if (user) {
        return res.redirect(`/profile/${user.id}`);
    }
    res.redirect("/login.html");


});

router.get("/login.html", (req, res) => {
    const user = getAuthUser(req);
    if (user) {
        return res.redirect(`/profile/${user.id}`);
    }
    res.sendFile(path.join(process.cwd(), "public", "login.html"));
});

router.get(
    "/profile/:id",
    passport.authenticate("current", {
        session: false,
        failureRedirect: "/login.html",
    }),
    (req, res) => {
        res.sendFile(path.join(process.cwd(), "public", "profile.html"));
    },
);

router.get("/health", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("OK");
});