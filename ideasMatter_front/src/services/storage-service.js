var storage = window.localStorage;

export default class StorageService {

  static backendHost() {
    return process.env.API;
  }

}
