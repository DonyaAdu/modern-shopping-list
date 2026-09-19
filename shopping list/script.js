const items = [];

const form = document.getElementById("itemForm");
const input = document.getElementById("itemInput");
const paper = document.getElementById("paper");
const list = document.getElementById("shoppingList");
const printButton = document.getElementById("printButton");
const clearButton = document.getElementById("clearButton");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const value = input.value.trim();

  if (!value) {
    input.focus();
    return;
  }

  items.push({
    name: value,
    completed: false
  });

  input.value = "";
  input.focus();
});

function renderList() {
  list.replaceChildren();

  items.forEach(function (item, index) {
    const li = document.createElement("li");

    li.textContent = item.name;
    li.dataset.index = index;

    if (item.completed) {
      li.classList.add("completed");
    }

    list.appendChild(li);
  });
}

list.addEventListener("click", function (event) {
  const itemElement = event.target.closest("li");

  if (!itemElement) {
    return;
  }

  const index = Number(itemElement.dataset.index);

  items[index].completed = !items[index].completed;

  itemElement.classList.toggle(
    "completed",
    items[index].completed
  );
});

clearButton.addEventListener("click", function () {
  items.length = 0;

  renderList();

  paper.classList.remove("printed");

  input.focus();
});

printButton.addEventListener("click", function () {
  renderList();

  paper.classList.remove("printed");

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      paper.classList.add("printed");
    });
  });
});

renderList();