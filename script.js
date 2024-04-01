// Function to allow dropping
function allowDrop(event) {
  event.preventDefault();
}

function generateName(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const onDragStart = (event) => {
  document.getElementById('draggable-list').classList.add('drag-active');
  localStorage.setItem('id', event.target.id);
  localStorage.setItem('backgroundColor', event.target.style.backgroundColor);
  event.dataTransfer.setData('text', event.target.id);

  // drag class in the window where drag started
};

// Function to handle dropping
function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData('text');
  var draggedElement = document.getElementById(data);
  var targetElement = event.target;

  // if dragged is null we are dragging the element in from another tab
  if (draggedElement == null) {
    draggedElement = document.createElement('li');
    draggedElement.classList.add('draggable', 'list-group-item');
    draggedElement.setAttribute('draggable', 'true');
    draggedElement.id = window.localStorage.id;
    draggedElement.innerText = window.localStorage.id;
    draggedElement.style.backgroundColor = window.localStorage.backgroundColor;

    draggedElement.addEventListener('dragstart', (e) => onDragStart(e));

    localStorage.setItem('droppedId', window.localStorage.id);
  }

  // If the drop target is a list item, insert the dragged item before or after it
  if (targetElement.className === 'draggable list-group-item') {
    if (
      event.clientY <
      targetElement.getBoundingClientRect().top + targetElement.offsetHeight / 2
    ) {
      targetElement.parentNode.insertBefore(draggedElement, targetElement);
    } else {
      targetElement.parentNode.insertBefore(
        draggedElement,
        targetElement.nextSibling
      );
    }
  }
  // If the drop target is the list itself, append the dragged item to the end
  else if (targetElement.id === 'draggable-list') {
    targetElement.appendChild(draggedElement);
  }

  localStorage.removeItem('id');
  localStorage.removeItem('backgroundColor');
  localStorage.removeItem('droppedId');

  // remove the drag-active class on the target window
  document.getElementById('draggable-list').classList.remove('drag-active');
}

const randomColor = () => {
  return (
    'rgb(' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ')'
  );
};

// Function to add item to the list
function addItem() {
  const itemText = generateName(5);
  var newListElement = document.createElement('li');
  newListElement.className = 'draggable list-group-item';
  newListElement.draggable = true;
  newListElement.id = itemText;
  newListElement.textContent = itemText;
  newListElement.style.backgroundColor = randomColor();
  document.getElementById('draggable-list').appendChild(newListElement);

  // Add event listener to the newly created draggable element
  newListElement.addEventListener('dragstart', (e) => onDragStart(e));
}

const handleStorageChange = (event) => {
  if (event.key === 'droppedId') {
    document.getElementById(event?.newValue)?.remove();
  }

  if (event.key === 'backgroundColor') {
    if (event.newValue) {
      document.getElementById('draggable-list').classList.add('drag-active');
    } else {
      document.getElementById('draggable-list').classList.remove('drag-active');
    }
  }
};

const handleDragEnd = (event) => {
  document.getElementById('draggable-list').classList.remove('drag-active');

  localStorage.removeItem('id');
  localStorage.removeItem('backgroundColor');
  localStorage.removeItem('droppedId');
};

// Add event listener to Add Item button
document.getElementById('add-item-btn').addEventListener('click', addItem);
window.addEventListener('storage', handleStorageChange);
window.addEventListener('dragend', handleDragEnd);
