function fetchData() {
  return fetch("https://data.police.uk/api/crime-categories")
    .then((response) => response.json())
    .then((json) => renderData(json));
}

function renderData(json) {
  const main = document.querySelector("main");

  json.forEach((data) => {
    let crimeNum = Math.floor(Math.random() * 300);

    // had to make the stats random because it was too hard to find an API with crime and stats

    let p = document.createElement("h3");
    typec = data.name + ":";
    typec = typec.padEnd(40, ".");
    p.innerHTML = `${typec} ${crimeNum}`;
    p.style.fontFamily = "Consolas";
    main.appendChild(p);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
