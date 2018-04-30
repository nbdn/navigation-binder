// 39: RIGHT
// 40: DOWN
// 37: LEFT
// 38: UP

const DIRECTIONS = {
  39: 'RIGHT',
  40: 'DOWN',
  37: 'LEFT',
  38: 'UP'
}

const BinderContextEngine = (binderRef, height, width, selector, focusedClassName) => {
  let _binderRef = binderRef && binderRef.current,
    _focusedItem = '',
    _focusedIndex = 0,
    _focusedClassName = focusedClassName,
    _items,
    _itemsCoordinates = [],
    _listener = undefined,
    _wrapperHeight = height,
    _selector = selector,
    _wrapperWidth = width,
    _wrapperElemDOM;

  const addListeners = () => {
    _listener = window.document.addEventListener('keydown', navigate)
  }

  const ensureBinderRef = (binderRef) => {
    if (!binderRef) {
      throw new Error('Binder ref is missing.');
    }
  }

  const ensureValidItem = (item) => {
    if (!item) {
      throw new Error('Binder item is missing.');
    }
    else if (!item.id) {
      throw new Error('All binder items must have a valid ID.');
    }
  }

  const buildItemsCoordinates = (items) => {
    items.forEach((item, index) => {
      _itemsCoordinates.push({ index, x: item.offsetLeft, y: item.offsetTop });
    })
    console.log('=> COrds', _itemsCoordinates);
  }

  function closestDown(itemIndex) {
    const focusedItemCoordinates = _itemsCoordinates[itemIndex];
    const itemsOnDown = _itemsCoordinates.filter((itemCoord) => itemCoord.y > focusedItemCoordinates.y)
    itemsOnDown.sort((a, b) => (focusedItemCoordinates.y - b.y) - (focusedItemCoordinates.y - a.y));
    const nearestItemOnY = itemsOnDown.shift();
    const otherYItems = itemsOnDown.filter((item) => item.y === nearestItemOnY.y);
    otherYItems.push(nearestItemOnY);
    const nearestItem = otherYItems.sort((a, b) => {
      if(Math.abs(focusedItemCoordinates.x - a.x) < Math.abs(focusedItemCoordinates.x - b.x)) {
        return -1
      }
      else if(Math.abs(focusedItemCoordinates.x - a.x) > Math.abs(focusedItemCoordinates.x - b.x)){
        return 1
      }
      return 0
    })[0]
    return nearestItem && nearestItem.index;
  }

  function closestUp(itemIndex) {
    const focusedItemCoordinates = _itemsCoordinates[itemIndex];
    const itemsOnUp = _itemsCoordinates.filter((itemCoord) => itemCoord.y < focusedItemCoordinates.y)
    itemsOnUp.sort((a, b) => (focusedItemCoordinates.y - a.y) - (focusedItemCoordinates.y - b.y));
    const nearestItemOnY = itemsOnUp.shift();
    const otherYItems = itemsOnUp.filter((item) => item.y === nearestItemOnY.y);
    otherYItems.push(nearestItemOnY);
    const nearestItem = otherYItems.sort((a, b) => {
      if(Math.abs(focusedItemCoordinates.x - a.x) < Math.abs(focusedItemCoordinates.x - b.x)) {
        return -1
      }
      else if(Math.abs(focusedItemCoordinates.x - a.x) > Math.abs(focusedItemCoordinates.x - b.x)){
        return 1
      }
      return 0
    })[0]
    return nearestItem && nearestItem.index;
  }

  function closestLeft(itemIndex) {
    const focusedItemCoordinates = _itemsCoordinates[itemIndex];
    const itemsOnLeft = _itemsCoordinates.filter((itemCoord) => itemCoord.x < focusedItemCoordinates.x)
    itemsOnLeft.sort((a, b) =>  (focusedItemCoordinates.x - a.x) - (focusedItemCoordinates.x - b.x));
    const nearestItemOnX = itemsOnLeft.shift();
    const otherXItems = itemsOnLeft.filter((item) => item.x === nearestItemOnX.x);
    otherXItems.push(nearestItemOnX);
    const nearestItem = otherXItems.sort((a, b) => {
      if(Math.abs(focusedItemCoordinates.y - a.y) < Math.abs(focusedItemCoordinates.y - b.y)) {
        return -1
      }
      else if(Math.abs(focusedItemCoordinates.y - a.y) > Math.abs(focusedItemCoordinates.y - b.y)){
        return 1
      }
      return 0
    })[0]
    return nearestItem && nearestItem.index;
  }

  function closestRight(itemIndex) {
    const focusedItemCoordinates = _itemsCoordinates[itemIndex];
    const itemsOnRight = _itemsCoordinates.filter((itemCoord) => itemCoord.x > focusedItemCoordinates.x)
    itemsOnRight.sort((a, b) => (focusedItemCoordinates.x - b.x) - (focusedItemCoordinates.x - a.x));
    const nearestItemOnX = itemsOnRight.shift();
    const otherXItems = itemsOnRight.filter((item) => item.x === nearestItemOnX.x);
    otherXItems.push(nearestItemOnX);
    const nearestItem = otherXItems.sort((a, b) => {
      if(Math.abs(focusedItemCoordinates.y - a.y) < Math.abs(focusedItemCoordinates.y - b.y)) {
        return -1
      }
      else if(Math.abs(focusedItemCoordinates.y - a.y) > Math.abs(focusedItemCoordinates.y - b.y)){
        return 1
      }
      return 0
    })[0]
    return nearestItem && nearestItem.index;
  }

  const findNearestItem = (focusedItemIndex, direction) => {
    let newFocusedItemIndex = undefined;

    if (direction === 'RIGHT') {
      newFocusedItemIndex = closestRight(focusedItemIndex)
    }
    else if(direction === 'LEFT'){ 
      newFocusedItemIndex = closestLeft(focusedItemIndex)
    }
    else if(direction === 'DOWN'){ 
      newFocusedItemIndex = closestDown(focusedItemIndex)
    }
    else if(direction === 'UP'){ 
      newFocusedItemIndex = closestUp(focusedItemIndex)
    }


    if (!isNaN(newFocusedItemIndex)) {
      reach(newFocusedItemIndex);
      focus(newFocusedItemIndex);
    }
  }

  const focus = (itemIndex) => {
    const item = _items[itemIndex];
    ensureValidItem(item);
    _items[_focusedIndex].classList.remove(_focusedClassName);
    _focusedIndex = itemIndex;
    item.classList.add(_focusedClassName)
  }

  const reach = (itemIndex) => {
    const item = _items[itemIndex];
    const itemCoords = _itemsCoordinates[itemIndex];
    console.log('=> Reach item', item, itemCoords);
    // if(item.x + item.offset )

  }

  const navigate = ({ keyCode }) => {
    findNearestItem(_focusedIndex, DIRECTIONS[keyCode]);
  }

  const init = () => {
    ensureBinderRef(_binderRef);
    addListeners();
    _wrapperElemDOM = _binderRef.querySelector('.Binder-Wrapper');
    _items = _binderRef.querySelectorAll(selector);
    buildItemsCoordinates(_items);
    focus(_focusedIndex);
  }

  const remove = () => {
    window.document.removeEventListener('keydown');
  }

  init();

  return {
    remove
  }
}



export default BinderContextEngine;