console.log("BACKGROUND LOADED");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "lookupWord") {
    fetchWord(request.word)
      .then(sendResponse)
      .catch(() => {
        sendResponse({
          meaning: "Error fetching meaning",
          phonetic: "-",
          audio: ""
        });
      });

    return true;
  }
});

async function fetchWord(word) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
  );

  const data = await res.json();

  let meaning = "Not found";
  let phonetic = "N/A";
  let audio = "";

  if (Array.isArray(data) && data.length > 0) {
    meaning =
      data[0]?.meanings?.[0]?.definitions?.[0]?.definition || "Not found";

    phonetic = data[0]?.phonetic || "N/A";

    const phonetics = data[0]?.phonetics || [];
    const audioObj = phonetics.find(p => p.audio);

    audio = audioObj?.audio || "";
  }

  return { meaning, phonetic, audio };
}