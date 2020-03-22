import { Loading } from 'quasar'
class Api {
  login (data) {
    return window.axios.post('/login', data)
  }

  createUser (data) {
    return window.axios.post('/users', data)
  }

  listClientRequests () {
    return window.axios.get(`/client-requests`)
  }

  getClientRequest (id) {
    return window.axios.get(`/client-requests/${id}`)
  }

  respondRequest(id, content) {
    return window.axios.post(`/client-requests/${id}/respond`, { content })
  }

  loading(message, delay) {
    console.log('start le loading');
    Loading.show({
      message, messageColor: 'white', spinnerSize: 250, spinnerColor: 'white', delay: delay || 400
    });
  }

  finishedLoading() {
    console.log('finish loading');
    Loading.hide();
  }

  submitCLientFeed(productId, rate) {
    console.log('submitting rate  :', rate);
    return window.axios.post(`/products/${productId}/rate`, rate);
  }
}

export default new Api();
