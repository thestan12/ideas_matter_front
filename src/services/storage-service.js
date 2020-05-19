var storage = window.localStorage;

export default class StorageService {

  static backendHost() {
    return process.env.API;
  }

  static setToken(token) {
    storage.setItem('token', token);
  }

  static getToken() {
    return storage.getItem('token');
  }

  static removeToken() {
    storage.removeItem('token');
    removeUser();
    removeConnection();
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

  static setFirstConnection(statut) {
    storage.setItem('connection', statut);
  }

  static getFirstConnection() {
    let connection = storage.getItem('connection');
    return connection;
  }

  static removeConnection () {
    storage.removeItem('connection');
  }



}
