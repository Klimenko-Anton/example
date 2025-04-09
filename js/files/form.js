export function feedbackForm() {

  document.addEventListener("focusin", function (e) {
    const targetElement = e.target;

    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      removeErrorInput(targetElement);
      removeErrorBlock(targetElement);
    }
  });

  document.addEventListener('click', function (e) {
    const target = e.target;

    if (target.closest('.form-feedback__delete')) {
      target.closest(".file-feedback__preview").remove();
    }
  })

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
  const MAX_FILES = 5;
  inputFile.addEventListener("change", function () {
    const files = inputFile.files;
    if (files.length > 0) {
      // filePreview.innerHTML = ''; // Очищаем превью перед загрузкой новых файлов
      uploadFiles(files);
    }
  });

  function uploadFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        filePreview.parentElement.insertAdjacentHTML("beforeend", `<div class="form-feedback__warning">Разрешены только изображения</div>`);
        return;
      } else {
        if (filePreview.parentElement.querySelector(".form-feedback__warning")) {
          filePreview.parentElement.removeChild(filePreview.parentElement.querySelector(".form-feedback__warning"));
        }
      }

      const currentCount = filePreview.querySelectorAll('.file-feedback__preview').length;

      if (currentCount + files.length > MAX_FILES) {
        const availableSlots = MAX_FILES - currentCount;
        filePreview.parentElement.insertAdjacentHTML("beforeend", `<div class="form-feedback__warning">Лимит файлов превышен (максимум ${MAX_FILES})</div>`);
        setTimeout(function () {
          if (filePreview.parentElement.querySelector(".form-feedback__warning")) {
            filePreview.parentElement.removeChild(filePreview.parentElement.querySelector(".form-feedback__warning"));
          }
        }, 3000)
        return;
      }

      const reader = new FileReader();
      reader.fileName = file.name;
      reader.fileSize = file.size;

      reader.onload = function (e) {
        const preview = document.createElement('div');
        preview.className = 'file-feedback__preview';

        const deleteImage = document.createElement("button");
        deleteImage.classList.add("form-feedback__delete", "btn-reset");

        const infoPreview = document.createElement("div");
        infoPreview.classList.add("file-feedback__info");

        const filesName = document.createElement("div");
        filesName.classList.add("file-feedback__file-name");
        filesName.textContent = `${this.fileName}`;

        const filesSize = document.createElement("div");
        filesSize.classList.add("file-feedback__file-size");
        filesSize.textContent = `${formatBytes(this.fileSize)}`;

        const img = document.createElement('img');
        img.className = 'file-feedback__image';
        img.src = e.target.result;

        infoPreview.append(filesName, filesSize);
        preview.appendChild(img);
        preview.appendChild(deleteImage);
        preview.appendChild(infoPreview);
        filePreview.appendChild(preview);
      };

      reader.onerror = function () {
        console.error(`Ошибка при чтении файла ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0';
    } else {
      var k = 1024;
      var dm = decimals < 0 ? 0 : decimals;
      var sizes = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  }

  form.addEventListener("submit", formSend);
};