import { Router } from "express";
import passport from "passport";
import { rolesAuth } from "../middleware/authRoles.js";
import { EventsController } from "../controller/eventsController.js";
import { eventOwnership } from "../middleware/eventOwnership.js";

export const router = Router();

const requireAuth = passport.authenticate("current", {
    session: false,
    failureRedirect: "/api/sessions/error",
});

router.post(
    "/",
    requireAuth,
    rolesAuth("admin", "organizer"),
    EventsController.create,
);

router.get("/", EventsController.getAll);

router.put(
    "/:id",
    requireAuth,
    rolesAuth("admin", "organizer"),
    eventOwnership,
    EventsController.update,
);

router.delete(
    "/:id",
    requireAuth,
    rolesAuth("admin", "organizer"),
    eventOwnership,
    EventsController.remove,
);
