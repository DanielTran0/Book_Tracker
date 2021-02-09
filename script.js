let userLibrary = [
    {title: 'book1', author: 'person1', pages:'100', read: true},
    {title: 'book2', author: 'person2', pages:'421', read: true},
    {title: 'book3', author: 'person3', pages:'1234', read: false},
    {title: 'book4', author: 'person4', pages:'12', read: false},
    {title: 'book5', author: 'person5', pages:'44', read: true},
];

getLocalStorage();
const bookForm = document.querySelector('#bookForm');
bookForm.addEventListener("submit", addBookToUserLibrary);

// Take modal form book data
function addBookToUserLibrary(e) {
    e.preventDefault();
    const newBook = Array.from(document.querySelectorAll('#bookForm input')).reduce((bookObject, input) => {
        if (input.type == 'checkbox') {
            bookObject[input.id] = input.checked ? true : false;
            return bookObject;
        }

        bookObject[input.id] = input.value;
        return bookObject;
    }, {});
    
    userLibrary.push(newBook);
    displayUserLibrary();
    clearModalForm();
}

// Uses bootstrap containers to order books
function displayUserLibrary() {
    clearBookDisplay()
    const bookDisplay = document.querySelector('.bookDisplay');
    
    for (let i = 0; i < Math.ceil(userLibrary.length / 4); i++) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        bookDisplay.appendChild(newRow);
        let booksInRow;

        if (Math.ceil(userLibrary.length / ((i + 1) * 4 )) == 1 && (userLibrary.length / ((i + 1) * 4 )) != 1) {
            booksInRow = userLibrary.length % 4;
        } else {
            booksInRow = 4;
        }
        
        for (let j = 0; j < booksInRow; j++) {
            const bookCard = createBookCard(userLibrary[j + 4 * i], (j + 4 * i));
            newRow.appendChild(bookCard);
        }
    }
    displayBookStats();
    saveLocalStorage();
}

// Uses bootstrap cards to display book details
function createBookCard(book, dataAttribute) {
    const cardColumn = document.createElement('div');
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const cardTitle = document.createElement('h5');
    const cardSubtitle = document.createElement('h6');
    const cardTextPages = document.createElement('p');
    const buttonGroup = document.createElement('div');
    const cardCompleteButton = document.createElement('button');
    const cardDeleteButton = document.createElement('button');

    cardColumn.classList.add('col-md-3');
    cardColumn.setAttribute('data-attribute', `${dataAttribute}`);
    card.classList.add('card');
    cardBody.classList.add('card-body', 'text-center');
    cardTitle.classList.add('card-title');
    cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-muted');
    cardTextPages.classList.add('card-text');
    buttonGroup.classList.add('btn-group');
    cardCompleteButton.type = 'button';
    cardCompleteButton.addEventListener('click', function() {toggleUserBookReadStatus(dataAttribute)});
    cardDeleteButton.classList.add('btn', 'btn-danger');
    cardDeleteButton.type = 'button';
    cardDeleteButton.addEventListener('click', function() {deleteUserBookFromLibrary(dataAttribute)});

    cardTitle.textContent = book.title;
    cardSubtitle.textContent = book.author;
    cardTextPages.textContent = book.pages;
    cardDeleteButton.textContent ='Delete';
    
    if (book.read === true) {
        cardCompleteButton.classList.add('btn', 'btn-success');
        cardCompleteButton.textContent = 'Completed';
    } else {
        cardCompleteButton.classList.add('btn', 'btn-warning');
        cardCompleteButton.textContent = 'Unfinished';
    }

    cardColumn.appendChild(card);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(cardTextPages);
    cardBody.appendChild(buttonGroup);
    buttonGroup.appendChild(cardCompleteButton);
    buttonGroup.appendChild(cardDeleteButton);
    return cardColumn;
}

function clearBookDisplay() {
    const bookDisplay = document.querySelector('.bookDisplay');
    Array.from(document.querySelectorAll('.bookDisplay .row')).forEach(row => bookDisplay.removeChild(row));
}

function deleteUserBookFromLibrary(dataAttribute) {
    userLibrary.splice(dataAttribute, 1);
    displayUserLibrary();
}

function toggleUserBookReadStatus(dataAttribute) {
    userLibrary[dataAttribute].read = userLibrary[dataAttribute].read ? false : true;
    displayUserLibrary();
}

function displayBookStats() {
    const bookStats = document.querySelector('.bookStats');
    const bookStatsNumber = document.createElement('div');
    const bookStatsCompleted = document.createElement('div');
    const numberCompleted = userLibrary.reduce((counter, book) => {
        if (book.read) counter++;
        return counter;
    }, 0);

    bookStatsNumber.textContent = `Books: ${userLibrary.length}`;
    bookStatsCompleted.textContent = `Completed: ${numberCompleted}`;

    Array.from(document.querySelectorAll('.bookStats div')).forEach(stat => bookStats.removeChild(stat));

    bookStats.appendChild(bookStatsNumber);
    bookStats.appendChild(bookStatsCompleted);
}

function clearModalForm() {
    Array.from(document.querySelectorAll('#bookForm input')).forEach(input => {
        if (input.type == 'checkbox') {
            input.checked = false;
        }
        input.value = '';
    });
}

function saveLocalStorage() {
    localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
}

function getLocalStorage() {
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
    if (userLibrary === null) userLibrary = []
    displayUserLibrary();
}