
export function createCard(cardItems, deleteCallback, likeCallback, imageClickCallback, cardTemplate) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
  
    cardImage.src = cardItems.link;
    cardImage.alt = cardItems.name;
    cardTitle.textContent = cardItems.name;
  
    deleteButton.addEventListener('click', deleteCallback);
    likeButton.addEventListener('click', likeCallback);
    cardImage.addEventListener('click', imageClickCallback);
  
    return cardElement;
  }
  
  // Удаление карточки
  export function deleteCard(evt) {
    evt.target.closest('.card').remove();
  }
  
  // Лайк карточки
  export function handleLikeCard(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
  }