import mongoose, { Schema } from "mongoose";

class MongoConnect {
    feedsSchema: Schema;
    sourcesSchema: Schema;

    constructor() {
        mongoose.connect(
            `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_KEY}@${process.env.MONGO_DB_URI}/?retryWrites=true&w=majority`,
            {
                dbName: "start-page",
            }
        );

        this.feedsSchema = new Schema({
            _uuid: String,
            data: [
                {
                    id: Number,
                    originName: String,
                    originLink: String,
                    lastFeedsLength: Number,
                    latestFeedTitle: String,
                    feeds: [
                        {
                            id: String,
                            title: {
                                type: String,
                                required: true,
                            },
                            description: {
                                type: String,
                                required: true,
                            },
                            link: {
                                type: String,
                                required: true,
                            },
                            pubDate: {
                                type: String,
                                required: true,
                            },
                            origin: {
                                type: String,
                                required: true,
                            },
                            isRead: Boolean,
                            isFavorite: Boolean,
                        },
                    ],
                },
            ],
        });

        this.sourcesSchema = new Schema({
            _uuid: String,
            sources: [
                {
                    id: Number,
                    name: String,
                    url: String,
                },
            ],
        });
    }

    getFeedsModel = () => mongoose.models.Feeds || mongoose.model("Feeds", this.feedsSchema);

    getSourcesModel = () => mongoose.models.Sources || mongoose.model("Sources", this.sourcesSchema);
}

export default new MongoConnect();
