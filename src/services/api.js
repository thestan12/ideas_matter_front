import { Loading } from 'quasar'
import StorageService from './storage-service';

var token = StorageService.getToken();
window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

  loading(message, delay) {
    Loading.show({
      message, messageColor: 'white', spinnerSize: 250, spinnerColor: 'white', delay: delay || 400
    });
  }

  finishedLoading() {
    // console.log('finish loading');
    Loading.hide();
  }

  sendPost(category, content, subject) {
    return window.axios.post(`/forum/post`, {
      subject: subject,
      content: content,
      category: category
    });
  }

  getPosts(category) {
    return window.axios.get('/forum/posts');
  }

  getPostsOfCurrentUser() {
    return axios.get(`/forum/posts/creator`);
  }

  commentPost(idPost, content) {
    console.log("sending comment with post id =", idPost);
    return window.axios.put(`/forum/post/${idPost}/comment`, {
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

  findPostByCategory(category) {
    return window.axios.get(`forum/posts/category/${category}`);
  }

  fetshCategories() {
    return window.axios.get('forum/categories');
  }

  updateUser(data) {
    return window.axios.post(`/user/update`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    });
  }

  updatePassword(password) {
    return axios.post(`user/update-password`, {
      password: password
    });
  }
}

export default new Api();
