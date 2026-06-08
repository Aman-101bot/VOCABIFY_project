chrome.storage.local.get(["history"], (res) => {
  const list = document.getElementById("list");
  const history = res.history || [];

  history.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  });
});