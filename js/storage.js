export default function populateStorage(pointsSum) {
  const bestResult = document.getElementById("bestResult");
  if (
    localStorage.getItem("score") === null ||
    localStorage.getItem("score") === "0"
  ) {
    localStorage.setItem("score", "0");
    bestResult.textContent = "0";
  } else {
    bestResult.textContent = localStorage.getItem("score");
  }
  const bestScore = parseInt(localStorage.getItem("score"), 10);
  if (pointsSum > bestScore) {
    bestResult.textContent = pointsSum;
    const newBestScore = pointsSum.toString();
    localStorage.setItem("score", newBestScore);
  }
}