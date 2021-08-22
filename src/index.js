import './sass/main.scss';
import usersList from './templates/search-users.hbs';
import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  form: document.querySelector('#form'),
  input: document.querySelector('.input-form'),
  btn: document.querySelector('.btn'),
  container: document.querySelector('.js-container'),
};

refs.form.addEventListener('submit', handlerSubmit);
refs.btn.addEventListener('click', clearBtn);
refs.input.addEventListener('input', clearBtn);

function handlerSubmit(e) {
  e.preventDefault();
  const value = refs.input.value;

  clearMarkup();
  clear();

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${value}`)
    .then(response => response.json())
    .then(users => errorCocktail(users))
    .catch(err => console.log(err));
}

function clear() {
  refs.input.value = '';
}

function markup(users) {
  refs.container.insertAdjacentHTML('beforeend', usersList(users));
}

function clearMarkup() {
  refs.container.innerHTML = '';
}

function clearBtn() {
  if (refs.input.value === '') {
    refs.btn.setAttribute('disabled', 'disabled');
  }
  if (refs.input.value !== '') {
    refs.btn.removeAttribute('disabled');
  }
  return;
}

function errorCocktail(users) {
  if (users.drinks) {
    markup(users.drinks);
  } else {
    error({
      text: 'Users not found!',
      delay: 2000,
    });
  }
}
