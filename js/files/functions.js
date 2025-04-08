export function menuOpen() {
  document.addEventListener("click", function (e) {
    const targetElement = e.target;

    if (!targetElement.closest(".icon-menu")) return;

    if (targetElement.closest(".icon-menu")) {
      document.documentElement.classList.toggle("menu-open");
    }
  });
}