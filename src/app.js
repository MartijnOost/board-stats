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
    if (type == element.type) {
      switch (type) {
        case "stencil":
        case "tag":
        case "rallycard":
        case "image":
        case "preview":
        case "card":
        case "app_card":
        case "usm":
        case "mindmap":
        case "kanban":
        case "document":
        case "mockup":
        case "webscreen":
        case "table":
        case "svg":
        case "emoji":
        case "embed":
        case "unsupported":
          ;
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
    }
  });

  if (Object.keys(colorIds).length > 0) {
    // Create don't track button
    const dontTrackButton = document.createElement("button");
    dontTrackButton.textContent = "Don't Track:" + type + "s";
    dontTrackButton.classList.add("track-button");
    dontTrackButton.addEventListener("click", () => {
      itemTypesToTrack.splice(itemTypesToTrack.indexOf(type), 1)
      refresh();
    })

    const row = document.createElement("div");
    row.classList.add("row");
    rowsContainer.appendChild(row);
    row.appendChild(dontTrackButton);

    for (var color in itemCount) {
      addRow(colorIds[color][Symbol.iterator](), type, itemCount[color], color);
    }
  }
}

let itemTypesToTrack = ["text","sticky_note","shape","image","frame","preview","card","app_card","usm","mindmap","kanban","document","mockup","curve","webscreen","table","svg","emoji","embed","connector","unsupported","table_text","rallycard","stencil","tag"]

refresh();

document
  .getElementById("submit")
  .addEventListener("click", () => refresh());

function refresh(){
  rowsContainer.replaceChildren()
  for (const type of itemTypesToTrack){
    getItems(type)
  }
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
  row.textContent = qty + ' ' + type + ' ' + color;
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