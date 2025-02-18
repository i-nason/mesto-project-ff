// @todo: Темплейт карточки

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы


// @todo: Функция создания карточки

function createCard(cardItems) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardItems.link;
    cardImage.alt = cardItems.name;
    cardTitle.textContent = cardItems.name;

    deleteButton.addEventListener('click', deleteCard); 

    return cardElement;
}

function addCards() {
    initialCards.forEach((cardItems) => {
        const cardElement = createCard(cardItems);
        placesList.appendChild(cardElement);
    });
}

// @todo: Функция удаления карточки

function deleteCard(evt) {
    const deleteButton = evt.target; 
    const cardElement = deleteButton.closest('.card');
    cardElement.remove(); 
}

// @todo: Вывести карточки на страницу

addCards();