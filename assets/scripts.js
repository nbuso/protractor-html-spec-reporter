function showHide(elementId) {
  const element = document.getElementById(elementId);
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
  } else {
    element.classList.add("hide");
  }
}
