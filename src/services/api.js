import { Loading } from 'quasar'
class Api {
  login (mail, mdp) {
    return window.axios.post('/user/login', {
      email: mail,
      password: mdp
    });
  }

  createUser (nom, prenom, mail , mdp) {
    return window.axios.post('/user/create', {
      firstName : nom,
      lastName: prenom,
      email: mail,
      password: mdp
    });
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
    Loading.show({
      message, messageColor: 'white', spinnerSize: 250, spinnerColor: 'white', delay: delay || 400
    });
  }

  finishedLoading() {
    // console.log('finish loading');
    Loading.hide();
  }

  sendPost(subject, content, ideaName) {
    console.log('ideaName =', ideaName);
    return window.axios.post('/forum/post/creator', {
      subject: subject,
      content: content,
      name: ideaName
    });
  }

  getPosts(category) {
    return window.axios.get('/forum/posts');
  }

  commentPost(idPost, content, mail, lastName) {
    return window.axios.put(`/forum/post/${idPost}/comment/${mail}`, {
      content: content,
      owner: lastName
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

  findPostByCategory(category) {
    console.log('trying to get the next category :', category);
    return window.axios.get(`forum/posts/category/${category}`);
  }

}

export default new Api();
