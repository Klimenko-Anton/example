export function feedbackForm() {

  document.addEventListener("focusin", function (e) {
    const targetElement = e.target;

    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      removeErrorInput(targetElement);
      removeErrorBlock(targetElement);
    }
  });

  const form = document.getElementById('form-feedback');
  const formSend = async (e) => {
    e.preventDefault();
    let isCheck = validateInput(form);
  }
  function validateInput(form) {
    let isCheck = false;
    const isReq = form.querySelectorAll('[data-required]');
    isReq.forEach(input => {
      if (input.dataset.required === "email") {
        if (emailTest(input)) {
          addErrorInput(input);
          addErrorBlock(input, "Введите корректный email");
          isCheck = true;
        };
      }
      if (input.dataset.required === "name") {
        if (input.value.length < 6) {
          addErrorInput(input);
          addErrorBlock(input, "Минимум 6 символов");
          isCheck = true;
        }
      }
      if (input.value == "") {
        addErrorInput(input);
        addErrorBlock(input, "Поле обязательно для заполнения");
        isCheck = true;
      }
    })

    return isCheck;
  }
  function addErrorBlock(input, text) {
    const errorBlock = input.parentElement.querySelector(".error-block");
    if (errorBlock) input.parentElement.removeChild(errorBlock);
    input.parentElement.insertAdjacentHTML("beforeend", `<div class="error-block">${text}</div>`);
  }
  function removeErrorBlock(input) {
    if (input.parentElement.querySelector(".error-block")) {
      input.parentElement.removeChild(input.parentElement.querySelector(".error-block"));
    }
  }
  function addErrorInput(input) {
    input.parentElement.classList.add("_input-error");
    input.classList.add("_input-error");
  }
  function removeErrorInput(input) {
    input.parentElement.classList.remove("_input-error");
    input.classList.remove("_input-error");
  }
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }

  const inputFile = document.querySelector(".file-feedback__input");
  const filePreview = document.querySelector(".file-feedback__previews");

  inputFile.addEventListener("change", function () {
    const files = inputFile.files;
    if (files.length > 0) {
      // filePreview.innerHTML = ''; // Очищаем превью перед загрузкой новых файлов
      uploadFiles(files);
    }
  });

  // function uploadFile(files) {
  //   let reader = new FileReader();

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     reader.onload = function (e) {
  //       console.log(e);
  //       filePreview.innerHTML = `<img class="file-feedback__image" src="${e.target.result}" alt="" />`;
  //     }
  //   }

  //   reader.readAsDataURL(files);

  // }

  function uploadFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Проверяем, что файл является изображением
      if (!file.type.match('image.*')) {
        filePreview.parentElement.insertAdjacentHTML("beforeend", `<div class="form-feedback__warning">Разрешены только изображения</div>`);
        return;
      } else {
        if (filePreview.parentElement.querySelector(".form-feedback__warning")) {
          filePreview.parentElement.removeChild(filePreview.parentElement.querySelector(".form-feedback__warning"));
        }
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        // Создаем элемент для превью
        const preview = document.createElement('div');
        preview.className = 'file-feedback__preview';

        const deleteImage = document.createElement("button");
        deleteImage.classList.add("form-feedback__delete", "btn-reset");

        // Создаем изображение
        const img = document.createElement('img');
        img.className = 'file-feedback__image';
        img.src = e.target.result;

        // Добавляем изображение в превью
        preview.appendChild(img);
        preview.appendChild(deleteImage);

        // Добавляем превью в контейнер (не перезаписывая существующие)
        filePreview.appendChild(preview);
      };

      reader.onerror = function () {
        console.error(`Ошибка при чтении файла ${file.name}`);
      };

      reader.readAsDataURL(file);
    }
  }

  form.addEventListener("submit", formSend);
};