chrome.action.onClicked.addListener(async (tab) => {
    // Only execute on Khan Academy pages
  if (!tab.url.includes("khanacademy.org")) return;

  try {
    const [activeTab
        ] = await chrome.tabs.query({ active: true, currentWindow: true
        });
    
    // Ask content.js to extract the text
    const response = await chrome.tabs.sendMessage(activeTab.id,
        { action: "extractTranscript"
        });

    if (response && response.status === "success") {
            // Execute clipboard write script contextually inside the tab frame
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id
                },
        func: (textToCopy) => {
          navigator.clipboard.writeText(textToCopy)
            .then(() => alert("🚀 Clean transcript copied to clipboard!"))
            .catch(err => console.error("Could not copy text: ", err));
                },
        args: [response.text
                ]
            });
        } else if (response && response.status === "error") {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id
                },
        func: (msg) => alert(msg),
        args: [response.message
                ]
            });
        }
    } catch (error) {
    console.error("Error executing extension:", error);
    }
});

