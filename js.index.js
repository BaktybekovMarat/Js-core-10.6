const enter = document.querySelector('input'); //поля ввода
const repositories = document.querySelector('.repositories'); //контейнер для репозиториев
const selectedRepo = document.querySelector('.selected'); //выбранные данные

async function loadData(query) {//отправляем запрос к гитхаб и получаем данные с помощью фэтч
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`,
  );

  if (!response.ok) {
    //если false выбросим ошибку
    console.error('Error happened:', response.status);
    throw new Error('Could not find repository');
  }

  const getData = await response.json(); //преобразуем объект
  return getData; //возвращаем данные
}

async function search() {
  //функция для поиска репо
  if (enter.value.trim() === '') {
    //убираем пробелы по краям
    repositories.innerHTML = ''; //очищаем репозитории
    selectedRepo.innerHTML = ''; //очищаем всплывающие подсказки
    return; //выходим из функции
  }
  const data = await loadData(enter.value); //передаем параметр в функцию и ждем пока функция закончит работу
  renderRepositories(data); //передаем данные в другую функцию
}

function renderRepositories(data) {
  //получаем данные
  repositories.innerHTML = '';
  for (const repository of data.items) {
    //выводим название репозиториев через цикл
    const li = document.createElement('li');
    li.style.listStyle = 'none'; //убираем точки в списке
    li.textContent = repository.name; //присваиваем к списку имена репозиториев

    repositories.appendChild(li); //добавляем список к контейнеру репозитории

    li.addEventListener('click', () => {
      //при клике на репозитории выводим информацию чуть подробнее
      showRepository(repository);
      enter.value = '';
      repositories.innerHTML = '';
    });
  }
}

function showRepository(repository) {
  // Функция при клике на репозитории выводим информацию чуть подробнее
  const selectedLi = document.createElement('li'); //создается список для выбранных репозиториев
  const buttonX = document.createElement('button'); //кнопка закрыть Х

  selectedLi.style.listStyle = 'none';
  if (selectedLi){
    selectedLi.innerHTML = ` 
    Name: ${repository.name}<br>
    Owner: ${repository.owner.login}<br>
    Stars: ${repository.stargazers_count}
  `;
  }

  buttonX.textContent = 'X';
  selectedLi.appendChild(buttonX);
  selectedRepo.appendChild(selectedLi);
  buttonX.addEventListener('click', () => {
    //при клике кнопка закрыть удаляем один выбранный репо
    selectedLi.remove();
  });
}

const debounce = (fn, debounceTime = 0) => { //замыкание
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, debounceTime);
  };
};

const debounceLoaded = debounce(search, 400);

enter.addEventListener('input', () => {
  debounceLoaded();
});

document.addEventListener('click', () => {
  //фоновая музыка на сайте
  document.querySelector('#bg_audio').play();
});
