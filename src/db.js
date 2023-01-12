import { Schema, model, connect, connection, models } from "mongoose";

if (connection.readyState != 1) {
    const login =
        "mongodb+srv://pasty:<password>@eventplanner.cil6rdw.mongodb.net/?retryWrites=true&w=majority".replace(
            "<password>",
            import.meta.env.DB_PASS
        );

    connect(login);
}


const ShortURLSchema = new Schema({
    title: String,
    description: String,
    url: String,
    isImage: Boolean,
    shorten: String
});

export const ShortURLModel = models.ShortURL || model("ShortURL", ShortURLSchema);