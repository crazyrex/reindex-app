import {
    UPLOAD_REQUEST,
} from './constants';

export function uploadRequest(data) {
    console.log('data',data)
    return {
        type: UPLOAD_REQUEST,
        data,
    }
}
