import { Loading } from 'quasar'
class Api {
  login (mail, mdp) {
    return window.axios.post('/user/login', {}, {
      auth: {
        username: mail,
        password: mdp
      }
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

  sendPost(category, content, subject, mail) {
    return window.axios.post(`/forum/post/${mail}`, {
      subject: subject,
      content: content,
      category: category
    });
  }

  getPosts(category) {
    return window.axios.get('/forum/posts');
  }

  getPostsOfCurrentUser(idUser) {
    return axios.get(`/forum/posts/${idUser}`);
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

  fetshCategories() {
    return window.axios.get('forum/categories');
  }

}

export default new Api();
