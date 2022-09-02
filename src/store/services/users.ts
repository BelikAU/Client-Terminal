import { api, defineStore, BaseModel } from 'src/store/';
import { syncWithStorage } from 'feathers-pinia';

export class User extends BaseModel {}

const servicePath = 'users';
export const useUsers = defineStore({
  idField: '_id',
  servicePath,
  Model: User,
});

api.service(servicePath).hooks({});

// const userStore = useUsers();
// syncWithStorage(userStore, ['itemsById', 'tempsById']);
