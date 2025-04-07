import { initialCards } from './scripts/cards.js';
import { createCard, handleLikeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  addNewCard,
  deleteCard as apiDeleteCard,
  updateAvatar
} from './components/api.js';

import './images/logo.svg';
import './images/avatar.jpg';
import './images/add-icon.svg';
import './images/edit-icon.svg';
import './images/like-active.svg';
import './images/like-inactive.svg';
import './images/delete-icon.svg';
import './images/close.svg';

import './pages/index.css';

// DOM элементы
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupAvatar = document.querySelector('.popup_type_avatar');

const popupImg = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const avatarEditButton = document.querySelector('.profile__image');

// Формы и их элементы
const editProfileForm = popupEdit.querySelector('.popup__form');
const editProfileNameInput = editProfileForm.querySelector('.popup__input_type_name');
const editProfileJobInput = editProfileForm.querySelector('.popup__input_type_description');
const editButtonSubmit = editProfileForm.querySelector('.popup__button');

const formAddCard = popupAddCard.querySelector('.popup__form');
const placeNameInput = formAddCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = formAddCard.querySelector('.popup__input_type_url');
const addCardButton = formAddCard.querySelector('.popup__button');

const formAvatar = popupAvatar.querySelector('.popup__form');
const avatarInput = formAvatar.querySelector('.popup__input_type_avatar');
const avatarSubmitButton = formAvatar.querySelector('.popup__button');

let currentUserId = null;

// Функция для отображения текста загрузки
function renderLoading(isLoading, buttonElement, defaultText = 'Сохранить') {
  buttonElement.textContent = isLoading ? 'Сохранение...' : defaultText;
}

// Получаем данные пользователя и карточки с сервера
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((card) => {
      const cardElement = createCard(
        card,
        currentUserId,
        handleDeleteCard,
        handleLikeCard,
        () => openImagePopup(card.link, card.name),
        cardTemplate
      );
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log('Ошибка при загрузке данных:', err);
  });

// Обработка локальных карточек
initialCards.forEach((cardItems) => {
  const cardElement = createCard(
    cardItems,
    currentUserId,
    handleDeleteCard,
    handleLikeCard,
    () => openImagePopup(cardItems.link, cardItems.name),
    cardTemplate
  );
  placesList.append(cardElement);
});

// Обработчики событий
editButton.addEventListener('click', () => {
  editProfileNameInput.value = profileName.textContent;
  editProfileJobInput.value = profileJob.textContent;
  clearValidation(editProfileForm, validationConfig);
  openModal(popupEdit);
});

addButton.addEventListener('click', () => {
  formAddCard.reset();
  clearValidation(formAddCard, validationConfig);
  openModal(popupAddCard);
});

avatarEditButton.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openModal(popupAvatar);
});

closeButtons();

function closeButtons() {
  document.querySelectorAll('.popup__close').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.closest('.popup')));
  });
  document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target === popup) {
        closeModal(popup);
      }
    });
  });
}

function openImagePopup(imageLink, imageName) {
  popupImg.src = imageLink;
  popupImg.alt = imageName;
  popupCaption.textContent = imageName;
  openModal(popupImage);
}

// Обработка форм
editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  renderLoading(true, editButtonSubmit);

  updateUserInfo(editProfileNameInput.value, editProfileJobInput.value)
    .then((userData) => {
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      closeModal(popupEdit);
      editProfileForm.reset();
    })
    .catch((err) => console.log('Ошибка при обновлении профиля:', err))
    .finally(() => renderLoading(false, editButtonSubmit));
});

formAddCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  renderLoading(true, addCardButton);

  addNewCard(placeNameInput.value, placeLinkInput.value)
    .then((cardData) => {
      const newCard = createCard(
        cardData,
        currentUserId,
        handleDeleteCard,
        handleLikeCard,
        () => openImagePopup(cardData.link, cardData.name),
        cardTemplate
      );
      placesList.prepend(newCard);
      closeModal(popupAddCard);
      formAddCard.reset();
      clearValidation(formAddCard, validationConfig);
    })
    .catch((err) => console.log('Ошибка при добавлении карточки:', err))
    .finally(() => renderLoading(false, addCardButton));
});

formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton);

  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupAvatar);
      formAvatar.reset();
    })
    .catch((err) => console.error('Ошибка при обновлении аватара:', err))
    .finally(() => renderLoading(false, avatarSubmitButton));
});

// Удаление карточки
function handleDeleteCard(cardId, cardElement) {
  apiDeleteCard(cardId)
    .then(() => cardElement.remove())
    .catch((err) => console.error('Ошибка при удалении карточки:', err));
}

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);
