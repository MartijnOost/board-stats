const { board } = window.miro;

const rowsContainer = document.getElementById("rows");

async function getItems(type) {
  let items = await board.get({
    type: [type]
  });

// Seperate colors
  const itemCount = {};
  const colorIds = {};
  let itemColor = ''

  items.forEach(element => {
    switch (type){
      case "card": case "image": case "preview": case "embed":
        itemColor = "";
        break;
      case "connector":
        itemColor = element.style.strokeColor;
        break;
      default:
        itemColor = element.style.fillColor;
    }

    itemCount[itemColor] = (itemCount[itemColor] || 0) + 1;
    
    if (!colorIds[itemColor]) {
      colorIds[itemColor] = []
    }
    colorIds[itemColor].push(element.id);
  });

  for (var color in itemCount) {
    addRow(colorIds[color][Symbol.iterator](), type, itemCount[color], color);
  }
}

refresh();

document
  .getElementById("submit")
  .addEventListener("click", () => refresh());

function refresh(){
  rowsContainer.replaceChildren()
  getItems('connector')
  getItems('sticky_note')
  getItems('shape')
  getItems('text')
  getItems('image')
  getItems('frame')
  getItems('preview')
  getItems('card')
}

function addRow(idsIterator, type, qty, color) {
  const row = document.createElement("div");
  row.classList.add("row");
  let colorStyle = color
  if (color == 'transparent' || color == '#ffffff'){
    colorStyle = "#000000"
  }
  row.style.color = colorStyle;

  if (color){
    color = " (" + color + ")"
  }
  if (qty > 1){
    type = type + "s"
  }
  row.textContent = qty + ' ' + type + color;
  rowsContainer.appendChild(row);

  // Create find button
  const button = document.createElement("button");
  button.textContent = "Find";
  button.classList.add("find-button");
  button.addEventListener("click", () => {
    findNext(idsIterator, button)
  });
  row.appendChild(button);
}

async function findNext(iteratorIds, button) {
  let next = iteratorIds.next()
  if (next.done) {
    refresh();
    button.textContent = "Find";
  }
  let x = await board.getById(next.value);
  button.textContent = "Find Next";
  await board.viewport.zoomTo(x);
}