import { IHandlingResponseError } from "../config/http-response";
import { HandlingErrorType } from "../enum/error-types";
import { HttpStatusCode } from "../enum/http-status-code";

export async function checkUniqueField(repositoryMethod: (sqlCon: any, value: string) => Promise<any>, sqlCon: any, value: string, property: string, rep: any): Promise<boolean> {
    const exists = await repositoryMethod(sqlCon, value);
    if (exists) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Unique, property };
        rep.code(HttpStatusCode.CONFLICT).send(info);
        return false;
    }
    return true;
}
