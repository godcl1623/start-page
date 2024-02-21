import { Model } from "mongoose";
import { NextApiRequest } from "next";
import { ParseResultType } from "app/main";
import MongoDB from "./mongodb";
import { SourceData } from "./sources/helpers";
import { parseCookie } from "./utils";
import { NextRequest } from "next/server";
import { SearchEnginesData } from "./searchEngines";

export const extractUserIdFrom = (request: NextApiRequest) => {
    const { userId } = request.query;
    return [parseCookie(userId), userId];
};

export const newExtractUserIdFrom = (request: NextRequest) => {
    const userId = request.nextUrl.searchParams
        .get("userId")
        ?.replace(/\s/g, "+");
    return [parseCookie(userId), userId];
};

interface InitializeMongoDBWithReturn<RemoteDataType> {
    remoteData: RemoteDataType;
    Schema: Model<any>;
}

type InitializeMongoDBWith = {
    (userId: string, schema: "feeds"): Promise<
        InitializeMongoDBWithReturn<ParseResultType[]>
    >;
    (userId: string, schema: "sources"): Promise<
        InitializeMongoDBWithReturn<SourceData[]>
    >;
    (userId: string, schema: "searchEngines"): Promise<
        InitializeMongoDBWithReturn<SearchEnginesData[]>
    >;
};

export const initializeMongoDBWith: InitializeMongoDBWith = async (
    userId: any,
    schema: any
): Promise<any> => {
    if (userId == null) return { remoteData: [], Schema: undefined };
    let remoteData: ParseResultType[] | SourceData[] = [];
    let Schema;
    if (schema === "feeds") {
        Schema = MongoDB.getFeedsModel();
        remoteData = (await Schema.find({ _uuid: userId }).lean())[0]?.data;
    } else if (schema === "sources") {
        Schema = MongoDB.getSourcesModel();
        remoteData = (await Schema.find({ _uuid: userId }).lean())[0]?.sources;
    } else if (schema === "searchEngines") {
        Schema = MongoDB.getSearchEnginesModel();
        remoteData = (await Schema.find({ _uuid: userId }).lean())[0]
            ?.engines_list;
    }
    return { remoteData, Schema };
};

interface DefendDataEmptyExceptionParameters {
    condition: boolean;
    userId: string;
    customProperty: string;
    Schema: Model<any>;
}

export const defendDataEmptyException = ({
    condition,
    userId,
    Schema,
    customProperty,
}: DefendDataEmptyExceptionParameters) => {
    if (condition) Schema.insertMany({ _uuid: userId, [customProperty]: [] });
};
