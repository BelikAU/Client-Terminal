import { api, defineStore, BaseModel } from 'src/store/';

class PlaylistService extends BaseModel {
  constructor(data, options = {}) {
    super(data, options);
  }

  static instanceDefaults(data, store) {
    return {
      name: '',
    };
  }
}
const servicePath = 'playlist';
export const usePlaylist = defineStore({
  servicePath,
  Model: PlaylistService,
});

api.service(servicePath).hooks({});
