import { EventsDAO } from "../dao/EventsDAO.js";

const eventsDAO = new EventsDAO();

export class EventsController {
    static async create(req, res) {
        try {
            const {
                title,
                description,
                category,
                date,
                location,
                capacity,
                price,
            } = req.body;

            if (!title || !description || !category || !date || !location) {
                res.setHeader("Content-Type", "application/json");
                return res
                    .status(400)
                    .json({ error: `Missing fields in your request.` });
            }

            const newEvent = await eventsDAO.create({
                title,
                description,
                category,
                date,
                location,
                capacity,
                price,
                organizer: req.user.id,
            });

            res.setHeader("Content-Type", "application/json");
            return res
                .status(201)
                .json({ message: "An event was created", event: newEvent });
        } catch (error) {
            return EventsController.errorHandler(res, error);
        }
    }

    static async getAll(req, res) {
        try {
            const { category } = req.query;

            const filtro = { status: "published" };

            if (category) filtro.category = category.toLowerCase();

            const events = await eventsDAO.getAll(filtro);

            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ payload: events });
        } catch (error) {
            return EventsController.errorHandler(res, error);
        }
    }

    static async update(req, res) {
        try {
            const isAdmin = req.user.role === "admin";

            const allowedFields = isAdmin
                ? [
                      "title",
                      "description",
                      "category",
                      "date",
                      "location",
                      "capacity",
                      "price",
                      "status",
                      "organizer",
                  ]
                : [
                      "title",
                      "description",
                      "category",
                      "date",
                      "location",
                      "capacity",
                      "price",
                      "status",
                  ];

            const updates = {};

            for (let field of allowedFields) {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            }

            if (Object.keys(updates).length === 0) {
                res.setHeader("Content-Type", "application/json");
                return res
                    .status(400)
                    .json({ error: `No valid fields to update` });
            }

            const updated = await eventsDAO.update(req.params.id, updates);

            res.setHeader("Content-Type", "application/json");
            return res
                .status(200)
                .json({ message: `Event updated`, event: updated });
        } catch (error) {
            return EventsController.errorHandler(res, error);
        }
    }

    static async remove(req, res) {
        try {
            const deleted = await eventsDAO.remove(req.params.id);

            if (!deleted) {
                res.setHeader("Content-Type", "application/json");
                return res.status(404).json({ error: `Event not found` });
            }

            res.setHeader("Content-Type", "application/json");
            return res
                .status(200)
                .json({ message: `Event deleted`, event: deleted });
        } catch (error) {
            return EventsController.errorHandler(res, error);
        }
    }

    static errorHandler(res, error) {
        res.setHeader("Content-Type", "application/json");

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ error: error.message });
        }

        return res
            .status(500)
            .json({ error: `Internal error: ${error.message}` });
    }
}
