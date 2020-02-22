const closeModalButtons = document.querySelectorAll("[data-close-button]");
const gameRulesModal = document.querySelector("#gameRulesModal");
const aboutModal = document.querySelector("#aboutModal");

[
  document.getElementById("gameRulesLink"),
  document.getElementById("rulesBtn")
].forEach(item => {
  item.addEventListener("click", () => {
    const activeModal = aboutModal.classList.contains("active");
    if (activeModal) {
      aboutModal.classList.remove("active");
    }
    gameRulesModal.classList.toggle("active");
  });
});

document.getElementById("aboutLink").addEventListener("click", () => {
  const activeModal = gameRulesModal.classList.contains("active");
  if (activeModal) {
    gameRulesModal.classList.remove(`active`);
  }
  aboutModal.classList.toggle("active");
});

closeModalButtons.forEach(button => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
}
