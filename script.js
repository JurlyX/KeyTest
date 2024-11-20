const masterKey = "master123"; // Master key to add new keys
const gistId = "1fd43da5dd9a185676969fe09a692b2d"; // Your GitHub Gist ID
const gistFileName = "keys.txt"; // The name of the file in the Gist

// DOM elements
const keyInput = document.getElementById("key-input");
const submitKeyButton = document.getElementById("submit-key");
const iframeContainer = document.getElementById("iframe-container");
const iframe = document.getElementById("iframe");
const masterKeyInput = document.getElementById("master-key");
const submitMasterKeyButton = document.getElementById("submit-master-key");
const addKeySection = document.getElementById("add-key-section");
const newKeyInput = document.getElementById("new-key");
const addKeyButton = document.getElementById("add-key");

// Load keys from GitHub Gist on page load
let validKeys = [];

document.addEventListener("DOMContentLoaded", loadKeys);

submitKeyButton.addEventListener("click", handleKeySubmit);
submitMasterKeyButton.addEventListener("click", handleMasterKeySubmit);
addKeyButton.addEventListener("click", handleAddKey);

// Fetch keys from the GitHub Gist
async function loadKeys() {
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
        const gist = await response.json();
        const keysFile = gist.files[gistFileName];
        validKeys = keysFile ? keysFile.content.split("\n").filter(Boolean) : [];
    } catch (error) {
        console.error("Error loading keys:", error);
    }
}

function handleKeySubmit() {
    const enteredKey = keyInput.value.trim();

    // Check if entered key is the master key
    if (enteredKey === masterKey) {
        document.getElementById("key-section").style.display = "none"; // Hide key input section
        document.getElementById("master-key-section").style.display = "block"; // Show master key section
    } else if (validKeys.includes(enteredKey)) {
        iframeContainer.style.display = "block"; // Show iframe
        keyInput.disabled = true;
        submitKeyButton.disabled = true;
    } else {
        alert("Incorrect Key. Try again.");
    }
}

function handleMasterKeySubmit() {
    const enteredMasterKey = masterKeyInput.value.trim();
    if (enteredMasterKey === masterKey) {
        document.getElementById("master-key-section").style.display = "none"; // Hide master key input
        addKeySection.style.display = "block"; // Show add key section
    } else {
        alert("Incorrect Master Key.");
    }
}

async function handleAddKey() {
    const newKey = newKeyInput.value.trim();
    if (newKey) {
        // Add new key to the Gist file
        try {
            const updatedKeys = [...validKeys, newKey].join("\n");

            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "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", // Optional if you need authentication
                },
                body: JSON.stringify({
                    files: {
                        [gistFileName]: {
                            content: updatedKeys
                        }
                    }
                })
            });

            if (response.ok) {
                alert(`Key "${newKey}" added successfully.`);
                validKeys.push(newKey);
                newKeyInput.value = ""; // Clear input field
            } else {
                const errorMessage = await response.text();
                alert(`Failed to add key: ${errorMessage}`);
            }
        } catch (error) {
            alert("An error occurred while adding the key.");
        }
    } else {
        alert("Please enter a valid key.");
    }
}
