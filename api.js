import axios from "axios"

const { NOTION_URL, NOTION_TOKEN } = process.env

const api = axios.create({
    baseURL: NOTION_URL
});

api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0";
api.defaults.headers.common["Accept-Language"] = "en-US,en;q=0.5";
api.defaults.headers.common["Cookie"] = `token_v2=${NOTION_TOKEN};`;

export default api;