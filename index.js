
let axios = require("axios")

let api = axios.create({
    baseURL: "https://www.notion.so"
});


const { NOTION_TOKEN, NOTION_PAGE } = process.env


api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0";
api.defaults.headers.common["Accept-Language"] = "en-US,en;q=0.5";
api.defaults.headers.common["Cookie"] = `token_v2=${NOTION_TOKEN};`;

async function getEnqueueRequest() {
    return {
        "task": {
            "eventName": "exportBlock",
            "request": {
                "blockId": NOTION_PAGE,
                "exportOptions": {
                    "exportType": "html",
                    "locale": "en",
                    "timeZone": "America/Sao_Paulo"
                },
                "recursive": true
            }
        }
    }
}

async function exportPage() {

    let exportRequest = await getEnqueueRequest();

    const responseEnqueueTask = await api.post("/api/v3/enqueueTask", exportRequest);
    let taskId = responseEnqueueTask.data.taskId;

    console.log("Enqueue taskID: \n", taskId)

    let taskIdsRequest = { "taskIds": [taskId] };

    let enqueueTaskState = ""

    do {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(2000) /// waiting 2 seconds.

        const responseGetTasks = await api.post("/api/v3/getTasks", taskIdsRequest);

        enqueueTaskState = responseGetTasks.data.results[0].state;

        if (enqueueTaskState == "success") {

            let exportUrl = responseGetTasks.data.results[0].status.exportURL;
            console.log("Uoww here is your download URL: \n", exportUrl);
            break;
        }

    } while (enqueueTaskState !== "success");
}


exportPage()