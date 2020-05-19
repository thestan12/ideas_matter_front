var storage = window.localStorage;

export default class StorageService {

  static backendHost() {
    return process.env.API;
  }

  static setUser(user) {
    console.log('setting user');
    storage.setItem('user', JSON.stringify(user));
  }

  static getUser() {
    let user = storage.getItem('user');
    console.log('getting user :', user);
    return JSON.parse(user);
  }

  static removeUser() {
    storage.removeItem('user');
  }


  static setToken(token) {
    storage.setItem('token', token);
  }

  static getToken() {
    return storage.getItem('token');
  }

  static removeToken() {
    storage.removeItem('token');
    this.removeUser();
    this.removeConnection();
  }

  static setFirstConnection(statut) {
    storage.setItem('connection', statut);
  }

  static getFirstConnection() {
    return storage.getItem('connection');
  }

  static removeConnection () {
    storage.removeItem('connection');
  }

}
