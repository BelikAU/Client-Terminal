import { defineStore, BaseModel, api } from "src/store/";

export class Playlist extends BaseModel {}

const servicePath = "playlist";
export const usePlaylist = defineStore({
  idField: "_id",
  servicePath,
  Model: Playlist,
});

api.service(servicePath).hooks({});
