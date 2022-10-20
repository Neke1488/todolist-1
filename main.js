(() => {
  const { _ } = window;
  const mainInput = document.querySelector('.main-input');
  const addButton = document.querySelector('.add-button');
  const mainList = document.querySelector('.main-list');
  const checkAll = document.querySelector('.check-all');
  const deleteCompleted = document.querySelector('.btn-delete-completed');
  const listContainer = document.querySelector('.list-container');
  const tabs = document.querySelector('.tabs');
  const buttonSelectionAll = document.querySelector('.btn-all');
  const buttonSelectionActive = document.querySelector('.btn-active');
  const buttonSelectionCompleted = document.querySelector('.btn-completed');
  const counterAll = document.querySelector('.counter-all');
  const counterActive = document.querySelector('.counter-active');
  const counterCompleted = document.querySelector('.counter-completed');
  const pageStorage = document.querySelector('.page-storage');
  const Escape = 'Escape';
  const Enter = 'Enter';
  const nTaskPerPage = 5;
  let arrTask = [];
  let selectedButtonValue = 'btn btn-secondary btn-all';
  let nChoicePage = 1;

  function correctText(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  function render(tempArray) {
    let outputArray = tempArray;
    if (!outputArray)outputArray = arrTask;
    const valuePages = Math.ceil(outputArray.length / nTaskPerPage);
    let page = '';
    let index = 0;
    while (index < valuePages) {
      if ((index + 1) === Number(nChoicePage))page += `<button class="btn btn-secondary pages-task active">${index + 1} </button>`;
      else page += `<button class="btn btn-secondary pages-task">${index + 1} </button>`;
      index += 1;
    }
    pageStorage.innerHTML = page;

    if (Number(nChoicePage) > valuePages || !nChoicePage) nChoicePage = valuePages;
    outputArray = outputArray.slice((nChoicePage - 1) * nTaskPerPage, nChoicePage * nTaskPerPage);

    let li = '';
    outputArray.forEach((item) => {
      const checked = item.completed ? 'checked' : '';
      li += `
        <li class="main-li" id='${item.id}'>
          <input type="checkbox" id='${item.id}' class="checkbox" ${checked}>
          <span id='${item.id}' class="span-text" type="visibility" >${_.escape(item.text)}</span>
          <textarea hidden class="text-area"></textarea>
          <button id='${item.id}' class="btn btn-outline-danger delete-button">X</button>
        </li>
        `;
    });
    mainList.innerHTML = li;
    checkAll.checked = !arrTask.find((item) => item.completed === false) && arrTask.length;

    counterAll.textContent = arrTask.length;
    counterActive.textContent = (arrTask.filter((item) => item.completed !== true)).length;
    counterCompleted.textContent = (arrTask.filter((item) => item.completed === true)).length;
  }

  function tabSelection(event) {
    let selectedButton = '';
    if (event) {
      selectedButton = event.target.classList;
      if (selectedButton.value.indexOf('counter') !== -1)selectedButton = event.target.parentNode.classList;
      if (selectedButton.value.indexOf(selectedButtonValue, 0) !== -1)selectedButton.remove('active');
      selectedButtonValue = selectedButton.value;
    }
    let tempArray = [];
    switch (selectedButtonValue) {
      case 'btn btn-secondary btn-all':
        tempArray = arrTask;
        break;

      case 'btn btn-secondary btn-active':
        tempArray = arrTask.filter((item) => item.completed === false);
        break;

      case 'btn btn-secondary btn-completed':
        tempArray = arrTask.filter((item) => item.completed === true);
        break;
      default:
        break;
    }

    if (tempArray && event) {
      buttonSelectionActive.classList.remove('active');
      buttonSelectionAll.classList.remove('active');
      buttonSelectionCompleted.classList.remove('active');
      selectedButton.add('active');
    }
    render(tempArray);
  }

  function addTask() {
    addButton.blur();
    const inputValue = mainInput.value.trim();
    if (inputValue) {
      const text = correctText(mainInput.value);
      const task = {
        id: Date.now(),
        completed: false,
        text,
      };

      arrTask.push(task);
      nChoicePage = Number(Math.ceil(arrTask.length / nTaskPerPage));
      mainInput.value = '';
      tabSelection();
    }
  }

  function addTaskByEnter(event) {
    if (event.key === Enter) addTask();
  }

  function deleteORCheckTask(event) {
    const foundTaskId = Number(event.target.id);
    if (event.target.classList.contains('delete-button')) {
      arrTask = arrTask.filter((item) => item.id !== foundTaskId);
      tabSelection();
    }

    if (event.target.classList.contains('checkbox')) {
      const foundTask = arrTask.find((item) => item.id === foundTaskId);
      foundTask.completed = event.target.checked;
      tabSelection();
    }
  }

  function checkAllTask(event) {
    arrTask.forEach((item) => { item.completed = event.target.checked; });
    tabSelection();
  }

  function deleteCompletedTask() {
    arrTask = arrTask.filter((item) => item.completed !== true);
    deleteCompleted.blur();
    tabSelection();
  }

  function editTaskText(event) {
    const foundTaskId = Number(event.target.id);
    const foundTask = arrTask.find((item) => item.id === foundTaskId);
    const firstText = event.target;
    const secondText = firstText.nextSibling.nextSibling;

    function saveChanges() {
      if (secondText.value.trim()) {
        foundTask.text = correctText(secondText.value);
      }
      tabSelection();
    }

    function saveByBlur() {
      saveChanges();
    }

    function saveOrDeleteChanges(event) {
      if (event.key === Enter)saveChanges();
      if (event.key === Escape) {
        secondText.removeEventListener('blur', saveByBlur);
        tabSelection();
      }
    }

    if (event.target.classList.contains('span-text')) {
      firstText.hidden = true;
      secondText.hidden = false;
      secondText.textContent = firstText.textContent;
      secondText.focus();
      secondText.selectionStart = secondText.value.length;
      secondText.addEventListener('keyup', saveOrDeleteChanges);
      secondText.addEventListener('blur', saveByBlur);
    }
  }

  function pageSelection(event) {
    nChoicePage = Number(event.target.textContent);
    tabSelection();
  }

  listContainer.addEventListener('dblclick', editTaskText);
  addButton.addEventListener('click', addTask);
  mainList.addEventListener('click', deleteORCheckTask);
  mainInput.addEventListener('keyup', addTaskByEnter);
  checkAll.addEventListener('click', checkAllTask);
  deleteCompleted.addEventListener('click', deleteCompletedTask);
  pageStorage.addEventListener('click', pageSelection);
  tabs.addEventListener('click', tabSelection);
})();
