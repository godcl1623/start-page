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
    if (!dataToCheck || typeof dataToCheck !== "object") {
        return false;
    }
    if (
        Object.values(dataToCheck).length < valuesCount ||
        Object.values(dataToCheck).some(
            (objectValue: unknown) =>
                typeof objectValue !== typeStandard || objectValue === ""
        )
    ) {
        return false;
    }
    return true;
};

export const checkIfDataExists = (
    storedList: unknown[],
    dataToCheck: unknown
) => {
    if (storedList.includes(dataToCheck)) return true;
    return false;
};
