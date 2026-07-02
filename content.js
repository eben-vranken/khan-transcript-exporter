chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractTranscript") {
    const transcriptContainer = document.querySelector('ul[itemprop="transcript"]');
    
    if (!transcriptContainer) {
      sendResponse({ status: "error", message: "Transcript container not found. Make sure the transcript tab is visible on the page!" });
      return;
    }

    // Scrape and clean text
    const cleanText = Array.from(transcriptContainer.querySelectorAll('span:not(.sr-only):not(._37mcb4i):not(._1lhrm9j)'))
      .map(span => span.textContent.trim())
      .filter(text => text && !text.match(/^\d+:\d+$/))
      .join(' ')
      .replace(/\s+/g, ' ');

    sendResponse({ status: "success", text: cleanText });
  }
});