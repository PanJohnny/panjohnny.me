import * as mongoose from "mongoose";
// { Schema, model, connect, connection, models }
if (connection.readyState != 1) {
    const login =
        "mongodb+srv://pasty:<password>@eventplanner.cil6rdw.mongodb.net/?retryWrites=true&w=majority".replace(
            "<password>",
            import.meta.env.DB_PASS
        );

    mongoose.connect(login);
}


const ShortURLSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    isImage: Boolean,
    shorten: String
});

export const ShortURLModel = models.ShortURL || mongoose.model("ShortURL", ShortURLSchema);