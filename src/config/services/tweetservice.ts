import axios from "axios";
import {ResponseDto} from "../dtos/ResponseDto";

const api = axios.create({
  baseURL: 'https://growtweeter.vercel.app',
}); 

class ApiService {
  public handleError(error: any): ResponseDto {
    const result = {
        ok: false
    }
    if (error.response?.data) {
        return {
            ...result,
            message:error.response.data.message
        };
    }
    return {
        ...result,
        message: error.toString()
    }
  }
}
export default new ApiService();