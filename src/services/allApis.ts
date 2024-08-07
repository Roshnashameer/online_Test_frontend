import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

// register
export const registerApi = async (body: any) => {
    return await commonApi('POST', `${BASE_URL}/register`, body, "");
}
// get questions
export const questionsApi = async (headers: any) => {
    return await commonApi('GET', `${BASE_URL}/questions`, "", headers);
}

export const answerSubmitApi = async (headers: any, body: any, id: string | any) => {
    return await commonApi('POST', `${BASE_URL}/${id}/submit`, body, headers);
}

export const resultApi = async ( id: string | any) => {
    return await commonApi('GET', `${BASE_URL}/${id}/result`, "", "");
}
