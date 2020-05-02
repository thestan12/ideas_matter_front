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
    // console.log('finish loading');
    Loading.hide();
  }

  sendPost(subject, content) {
    return window.axios.post('/forum/post/creator', {
      subject: subject,
      content: content
    });
  }

  getPosts(category) {
    return window.axios.get('/forum/posts');
  }

  commentPost(idPost, content) {
    return window.axios.put(`/forum/post/${idPost}/comment/serge`, {
      content: content
    });
  }

  getComments(idPost) {
    return window.axios.get(`/forum/post/${idPost}/comments`);
  }

  likePost(idPost) {
    return window.axios.put(`/forum/post/${idPost}/like`);
  }

  dislikePost(idPost) {
    return window.axios.put(`/forum/post/${idPost}/dislike`);
  }

}

export default new Api();
