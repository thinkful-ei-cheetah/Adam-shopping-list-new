'use strict';

const STORE = {
items:[
  {id: cuid(), name: "apples", checked: false},
  {id: cuid(), name: "oranges", checked: false},
  {id: cuid(), name: "milk", checked: true},
  {id: cuid(), name: "bread", checked: false}
  ],
  hideCompleted: false
};


function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  //console.log("Generating shopping list element");

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  //console.log('`renderShoppingList` ran');
  //const shoppingListItemsString = generateShoppingItemsString(STORE);

  let filteredItems = STORE.items;

  if(STORE.hideCompleted){
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log("Toggling checked property for item with id " + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}


function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function deleteListItem(itemId){
  console.log("delete item with id: " + itemId);
  
  // seems to delete items starting at index 0. 
  // const item = STORE.find(item => item.id === itemId);
  //   console.log(item);
  //   STORE.splice(item, 1);
  // could not find what I was doing wrong so I broke down and looked at solution
  // I needed .findIndex not .find
  const itemIndex = STORE.items.findIndex(item => item.id === itemId);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
$('.js-shopping-list').on('click', `.js-item-delete`, event =>{
    //console.log('`handleDeleteItemClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    deleteListItem(id);
    renderShoppingList();
  });
}

//toggle the STORE.hideCompleted prop
function toggleHideFilter(){
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleToggleHideFilter(){
  $('.js-hide-completed-toggle').on('click', () =>{
    toggleHideFilter();
    renderShoppingList();
  });
}

// function filteredItemsList(itemName){
//   const item = STORE.items.findIndex(item => item.Name === itemName);
//   console.log(item);

// }

// function handleFilteredItemsList(){
//   let itemName = STORE.items.name;
//   $(`#js-shopping-list-entry:contains('${itemName}')`), event => {
//   const id = getItemIdFromElement(event.currentTarget);
//   filteredItemsList(id);
//   renderShoppingList();
//   };
// }

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleFilteredItemsList();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);