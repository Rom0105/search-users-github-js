import './sass/main.scss';
import usersList from './templates/search-users.hbs';
import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import axios from 'axios';
import { result } from 'lodash';

const refs = {
  form: document.querySelector('#form'),
  input: document.querySelector('.input-form'),
  btn: document.querySelector('.btn'),
  container: document.querySelector('.js-container'),
  btnLoad: document.querySelector('.btn-load'),
};

refs.form.addEventListener('submit', gitHandlerSubmit);
refs.btn.addEventListener('click', clearBtn);
refs.input.addEventListener('input', clearBtn);
refs.btnLoad.addEventListener('click', gitHandlerSubmit);

let currentPage = 1;

function gitHandlerSubmit(e) {
  e.preventDefault();
  const value = refs.input.value;

  clearBtn();

  axios
    .get(
      `https://api.github.com/search/users?q=${value}&client_id=6a927e9749baf5170662&client_secret=5181dc33b7d4e79a04eb08a72ef4afca511c808a&page=${currentPage}`,
    )
    .then(users => errorUsers(users))
    .then(() => currentPage++)
    .catch(err => console.log(err));
}

function markup(users) {
  refs.container.insertAdjacentHTML('beforeend', usersList(users));
}

function clearBtn() {
  if (refs.input.value === '') {
    refs.btn.setAttribute('disabled', 'disabled');
    refs.btnLoad.setAttribute('disabled', 'disabled');
    refs.container.innerHTML = '';
  }
  if (refs.input.value !== '') {
    refs.btn.removeAttribute('disabled');
    refs.btnLoad.removeAttribute('disabled');
  }
}

function errorUsers(users) {
  if (users.data.items) {
    markup(users.data.items);
  }
  if (users.data.total_count === 0) {
    error({
      text: 'Users not found!',
      delay: 2000,
    });
  }
}
