import {
    UPLOAD_IMAGE,
} from './constants';

export function uploadImage(data) {
    console.log('data',data)
    return {
        type: UPLOAD_IMAGE,
        data,
    }
}
