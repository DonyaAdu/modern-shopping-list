const items = [];
let printAnimation = null;

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
  if (printAnimation) {
    printAnimation.cancel();
    printAnimation = null;
  }
  printButton.disabled = false;
  items.length = 0;

  renderList();

  paper.classList.remove("printed");

  input.focus();
});

printButton.addEventListener("click", async function () {
  if (printAnimation) return;

  renderList();
  paper.classList.add("printed");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  printButton.disabled = true;
  const animation = paper.animate([
    { transform: "translateY(calc(100% - 12px))" },
    { transform: "translateY(0)" }
  ], {
    duration: Math.min(2400, Math.max(1200, paper.offsetHeight * 2)),
    easing: "cubic-bezier(0.45, 0, 0.2, 1)"
  });
  printAnimation = animation;

  try {
    await animation.finished;
  } catch {
    // Clearing the list cancels an in-progress print.
  } finally {
    if (printAnimation === animation) {
      printAnimation = null;
      printButton.disabled = false;
    }
  }
});

renderList();
