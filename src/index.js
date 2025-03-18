
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard, handleLikeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

import './images/logo.svg';
import './images/avatar.jpg';
import './images/add-icon.svg';
import './images/edit-icon.svg';
import './images/like-active.svg';
import './images/like-inactive.svg';
import './images/delete-icon.svg';
import './images/close.svg';

import './pages/index.css';

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const popupImg = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const formElement = document.querySelector('.popup_type_edit .popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

const formAddCard = document.querySelector('.popup_type_new-card .popup__form');
const placeNameInput = formAddCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = formAddCard.querySelector('.popup__input_type_url');

// Открытие попапа редактирования профиля с текущими значениями
function openEditPopup() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(popupEdit);
}

// Просмотр изображения
function handleImageClick(evt) {
  popupImg.src = evt.target.src;
  popupImg.alt = evt.target.alt;
  popupCaption.textContent = evt.target.alt;
  openModal(popupImage);
}

// Добавление начальных карточек
initialCards.forEach((cardItems) => {
  const cardElement = createCard(cardItems, deleteCard, handleLikeCard, handleImageClick, cardTemplate);
  placesList.append(cardElement);
});

// Обработчики событий
editButton.addEventListener('click', openEditPopup);
addButton.addEventListener('click', () => openModal(popupAddCard));

const closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.popup')));
});

document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(popupEdit);
  formElement.reset();
});

formAddCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardData = { name: placeNameInput.value, link: placeLinkInput.value };
  const newCard = createCard(cardData, deleteCard, handleLikeCard, handleImageClick, cardTemplate);
  placesList.prepend(newCard);
  closeModal(popupAddCard);
  formAddCard.reset();
});