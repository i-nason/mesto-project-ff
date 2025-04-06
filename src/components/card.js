import { likeCard, unlikeCard } from './api.js';

export function createCard(cardItems, currentUserId, deleteCallback, likeCallback, imageClickCallback, cardTemplate) {
  const cardElement = cardTemplate.cloneNode(true).querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const likesArray = cardItems.likes || [];
  
  likeCount.textContent = likesArray.length;

  if (likesArray.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  cardImage.src = cardItems.link;
  cardImage.alt = cardItems.name;
  cardTitle.textContent = cardItems.name;

  cardElement.dataset.cardId = cardItems._id;

  if (cardItems.owner && cardItems.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      deleteCallback(cardItems._id, cardElement);
    });
  } else {
    deleteButton.style.display = 'none';
  }

  likeButton.addEventListener('click', likeCallback);
  cardImage.addEventListener('click', imageClickCallback);

  return cardElement;
}

export function handleLikeCard(evt) {
  const likeButton = evt.target;
  const cardElement = likeButton.closest('.card');
  const likeCountElement = cardElement.querySelector('.card__like-count');
  const cardId = cardElement.dataset.cardId;

  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  const request = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  request
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch(err => {
      console.error('Ошибка при обновлении лайка:', err);
    });
}