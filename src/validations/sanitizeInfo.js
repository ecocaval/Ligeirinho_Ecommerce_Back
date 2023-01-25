//* Libraries
import { stripHtml } from "string-strip-html";

export default function sanitizeInfo(info) {    
    if(!info) return info;

    for(let [key, value] of Object.entries(info)) {
        if(typeof info[key] === "string") info[key] = stripHtml(value).result.trim()
    }
    return info
}