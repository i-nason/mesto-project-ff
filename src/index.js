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

// DOM узлы
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const popupImg = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

// Форма редактирования профиля
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const editProfileNameInput = editProfileForm.querySelector('.popup__input_type_name');
const editProfileJobInput = editProfileForm.querySelector('.popup__input_type_description');

const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

// Форма добавления новой карточки
const formAddCard = document.querySelector('.popup_type_new-card .popup__form');
const placeNameInput = formAddCard.querySelector('.popup__input_type_card-name');
const placeLinkInput = formAddCard.querySelector('.popup__input_type_url');

// Открытие попапа редактирования профиля с текущими значениями
function openEditPopup() {
  editProfileNameInput.value = profileName.textContent;
  editProfileJobInput.value = profileJob.textContent;
  openModal(popupEdit);
}

// Обработчик отправки формы редактирования профиля
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = editProfileNameInput.value;
  profileJob.textContent = editProfileJobInput.value;

  closeModal(popupEdit);
  editProfileForm.reset();
}

// Открытие модального окна просмотра изображения
function openImagePopup(imageLink, imageName) {
  popupImg.src = imageLink;
  popupImg.alt = imageName;
  popupCaption.textContent = imageName;
  openModal(popupImage);
}

// Добавление начальных карточек
initialCards.forEach((cardItems) => {
  const cardElement = createCard(
    cardItems,
    deleteCard,
    handleLikeCard,
    () => openImagePopup(cardItems.link, cardItems.name),
    cardTemplate
  );
  placesList.append(cardElement);
});

// Обработчики событий
editButton.addEventListener('click', openEditPopup);
addButton.addEventListener('click', () => openModal(popupAddCard));

// Закрытие модальных окон (крестик)
const closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.popup')));
});

// Закрытие по клику на оверлей
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

// Отправка формы редактирования профиля
editProfileForm.addEventListener('submit', handleEditProfileFormSubmit);

// Отправка формы добавления новой карточки
formAddCard.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const cardData = { name: placeNameInput.value, link: placeLinkInput.value };
  const newCard = createCard(
    cardData,
    deleteCard,
    handleLikeCard,
    () => openImagePopup(cardData.link, cardData.name),
    cardTemplate
  );

  placesList.prepend(newCard);
  closeModal(popupAddCard);
  formAddCard.reset();
});