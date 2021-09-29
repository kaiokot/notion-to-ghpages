import api from "./api.js";
import https from "https";
import fs from "fs";
import path from "path";

const { NOTION_PAGE } = process.env


async function exportPage() {

    let exportRequest = await getTaskRequest();

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

            var parsedFileName = exportUrl.split('/').pop().split('#')[0].split('?')[0];

            console.log(`Uoww =) here is your download URL:\n\n${exportUrl}\n\n`);

            await downloadFromUri(exportUrl, path.join(path.resolve(), `tmp/${parsedFileName}`));
            break;
        }

    } while (enqueueTaskState !== "success");
}

async function getTaskRequest() {
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

async function downloadFromUri(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    }).on('error', function (err) {
        fs.unlink(dest);
        if (cb) cb(err.message);
    });
};


exportPage()