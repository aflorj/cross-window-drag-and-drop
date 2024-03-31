// Function to allow dropping
function allowDrop(event) {
  event.preventDefault();
}

// Function to handle dropping
function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData('text');
  var draggedElement = document.getElementById(data);
  var targetElement = event.target;

  // if dragged is null we are dragging the element in from another tab
  if (draggedElement == null) {
    draggedElement = document.createElement('li');
    draggedElement.classList.add('draggable');
    draggedElement.classList.add('list-group-item');
    draggedElement.setAttribute('draggable', 'true');
    draggedElement.id = window.localStorage.id;
    draggedElement.innerText = window.localStorage.id;
    draggedElement.style.backgroundColor = window.localStorage.backgroundColor;

    draggedElement.addEventListener('dragstart', function (event) {
      console.log('vsebina: ', event.target.style.backgroundColor);
      localStorage.setItem('id', event.target.id);
      localStorage.setItem(
        'backgroundColor',
        event.target.style.backgroundColor
      );
      event.dataTransfer.setData('text', event.target.id);
    });

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
  else if (targetElement.id === 'draggableList') {
    targetElement.appendChild(draggedElement);
  }

  localStorage.removeItem('id');
  localStorage.removeItem('backgroundColor');
  localStorage.removeItem('droppedId');
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
  var input = document.getElementById('addItemInput');
  var itemText = input.value.trim();
  if (itemText !== '') {
    var newListElement = document.createElement('li');
    newListElement.className = 'draggable list-group-item';
    newListElement.draggable = true;
    newListElement.id = itemText;
    newListElement.textContent = itemText;
    newListElement.style.backgroundColor = randomColor();
    document.getElementById('draggableList').appendChild(newListElement);
    input.value = '';

    // Add event listener to the newly created draggable element
    newListElement.addEventListener('dragstart', function (event) {
      console.log('vsebina: ', event.target.style.backgroundColor);
      localStorage.setItem('id', event.target.id);
      localStorage.setItem(
        'backgroundColor',
        event.target.style.backgroundColor
      );
      event.dataTransfer.setData('text', event.target.id);
    });
  } else {
    alert('Please enter an item.');
  }
}

const handleStorageChange = (event) => {
  console.log('storage event: ', event);

  if (event.key === 'droppedId') {
    document.getElementById(event?.newValue)?.remove();
  }
};
// Add event listener to Add Item button
document.getElementById('addItemBtn').addEventListener('click', addItem);
window.addEventListener('storage', handleStorageChange);
