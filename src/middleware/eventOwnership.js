import mongoose from "mongoose";
import { EventsDAO } from "../dao/EventsDAO.js";

const eventsDAO = new EventsDAO();

export const eventOwnership = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Invalid event id` });
        }

        const event = await eventsDAO.getBy({ _id: id });

        if (!event) {
            res.setHeader("Content-Type", "application/json");
            return res.status(404).json({ error: `Event not found` });
        }

        const organizerId = event.organizer?._id ?? event.organizer;
        const isAdmin = req.user.role === "admin";
        const isOwner = organizerId?.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            res.setHeader("Content-Type", "application/json");
            return res
                .status(403)
                .json({ error: `You can only modify your own events` });
        }

        req.event = event;
        return next();
    } catch (error) {
        return next(error);
    }
};
