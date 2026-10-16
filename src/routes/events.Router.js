import { Router } from "express";
import passport from "passport";
// import { config } from "../config/config.js";
import { rolesAuth } from "../middleware/authRoles.js";
// import { eventOwnership } from "../middleware/eventOwnership.js";
// import { EventsController } from "../controller/eventsController.js";

export const router = Router();

router.put(
    "/:id",
    passport.authenticate("current", {
        session: false,
        failureRedirect: "/api/sessions/error",
    }),
    rolesAuth("admin", "organizer"),
    // eventOwnershio,
    // EventsController.update
);
