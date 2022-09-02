import { api, defineStore, BaseModel } from 'src/store/';
import { LocalStorage } from 'quasar';

class WarningService extends BaseModel {
  constructor(data, options = {}) {
    super(data, options);
  }

  static instanceDefaults(data, store) {
    return {
      name: LocalStorage.getItem('setup').id,
    };
  }
}
const servicePath = 'warning';
export const useWarning = defineStore({
  servicePath,
  Model: WarningService,
});

api.service(servicePath).hooks({});
