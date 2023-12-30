export type Mp3State = "loadeddata" | "playing" | "play" | "pause" | "error" | "ended" | "";

export const MEDIA_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}size-720/`;
export const MP3_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}mp3/`;
