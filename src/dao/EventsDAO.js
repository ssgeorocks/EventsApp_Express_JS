import { eventModel } from "../models/eventModels.js";

export class EventsDAO {
    async create(event) {
        let newEvent = await eventModel.create(event);
        return newEvent.toJSON();
    }

    async getBy(filtro) {
        return await eventModel
            .findOne(filtro)
            .populate("organizer", "firstName lastName email")
            .lean();
    }

    async getAll(filtro) {
        return await eventModel
            .find(filtro)
            .populate("organizer", "firstName lastName email")
            .sort({ date: 1 })
            .lean();
    }

    async update(id, datos) {
        return await eventModel
            .findByIdAndUpdate(id, datos, {
                new: true,
                runValidators: true,
            })
            .lean();
    }

    async remove(id) {
        return await eventModel.findByIdAndDelete(id).lean();
    }
}
