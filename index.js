import api from "./api.js";

const { NOTION_PAGE } = process.env


async function exportPage() {

    let exportRequest = await getEnqueueRequest();

    const responseEnqueueTask = await api.post("/api/v3/enqueueTask", exportRequest);
    let taskId = responseEnqueueTask.data.taskId;

    console.log(`Enqueued taskID:\n\n${taskId}\n\n`)

    let taskIdsRequest = { "taskIds": [taskId] };

    let enqueueTaskState = ""

    do {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(2000) /// waiting 2 seconds.

        const responseGetTasks = await api.post("/api/v3/getTasks", taskIdsRequest);

        enqueueTaskState = responseGetTasks.data.results[0].state;

        if (enqueueTaskState == "success") {

            let exportUrl = responseGetTasks.data.results[0].status.exportURL;
            console.log(`Uoww =) here is your download URL:\n\n${exportUrl}\n\n`);
            break;
        }

    } while (enqueueTaskState !== "success");
}

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


exportPage()