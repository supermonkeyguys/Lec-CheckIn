import { desktopCapturer } from "electron";




async function getScreenStream() {
    const sources = await desktopCapturer.getSources({ types:['screen','window'] })

    const screenSource = sources[0]

}