
let axios = require("axios")

let api = axios.create({
    baseURL: "https://www.notion.so"
});

api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0";
api.defaults.headers.common["Accept-Language"] = "en-US,en;q=0.5";
api.defaults.headers.common["Cookie"] = "token_v2=TOKEN;";
api.defaults.headers.common["x-notion-active-user-header"] = "USER";

async function exportPage() {

    let exportRequest = {
        task: {
            eventName: "exportBlock",
            request: {
                block: {
                    id: "c942ea9aae494524b51cb22c5cbfd179",
                    spaceId: "c24b230d-7445-4d06-bf61-6a96f9b3cb02"
                },
                exportOptions: {
                    exportType: "html",
                    locale: "en",
                    timeZone: "America/Sao_Paulo"
                },
                recursive: false
            }
        }
    }

    const responseEnqueueTask = await api.post("/api/v3/enqueueTask", exportRequest);
    let taskId = responseEnqueueTask.data.taskId;
    console.log("taskID", taskId)

    let taskIdsRequest = { "taskIds": [taskId] };

    let enqueueTaskState = ""

    do {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(5000) /// waiting 1 second.

        const responseGetTasks = await api.post("/api/v3/getTasks", taskIdsRequest);

        enqueueTaskState = responseGetTasks.data.results[0].state;

        console.log(responseGetTasks.data);

        if (enqueueTaskState == "success") {

            let exportUrl = responseGetTasks.data.results[0].status.exportURL;

            console.log("uow here is your url ", exportUrl);
        }

    } while (enqueueTaskState !== "success");

}


exportPage()