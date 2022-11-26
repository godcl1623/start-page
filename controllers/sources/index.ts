import { promises as fs } from "fs";
import { JSON_DIRECTORY } from 'common/constants';

export interface SourceDataInput {
    name: string;
    url: string;
}

export interface SourceData extends SourceDataInput {
    id: number;
}

export type SourceDataToModify = Partial<SourceDataInput>;

export interface FileContentsInterface {
    sources: SourceData[];
}

export interface UpdateDataOptions {
    originalId?: number;
}

export class CustomError {
    code: number;
    message: string;
    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}

export const checkIfDataValid = (
    dataToCheck: unknown,
    valuesCount: number,
    typeStandard: string
) => {
    if (dataToCheck && typeof dataToCheck === "object") {
        if (
            Object.values(dataToCheck).length < valuesCount ||
            Object.values(dataToCheck).some(
                (objectValue: unknown) =>
                    typeof objectValue !== typeStandard || objectValue === ""
            )
        ) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

export const checkIfDataExists = (
    storedList: unknown[],
    dataToCheck: unknown
) => {
    if (storedList.includes(dataToCheck)) return true;
    return false;
};

export const updateData = <T extends object>(
    storedList: T[],
    dataToAdd: T, 
    options?: UpdateDataOptions,
) => {
    const { originalId } = options || {};
    const sourceId = originalId ?? storedList.length;
    const newSource = {
        id: sourceId,
        ...dataToAdd,
    };
    const updatedSources = [...storedList, newSource];
    const body = {
        sources: updatedSources,
    };
    try {
        fs.writeFile(`${JSON_DIRECTORY}/sources.json`, JSON.stringify(body));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
