async function searchWord() {
    const inputField = document.getElementById('wordInput');
    const query = inputField.value.trim();
    const resultBox = document.getElementById('resultContainer');

    if (!query) {
        resultBox.innerHTML = `<p style="text-align: center; color: var(--subtext-color);">অনুগ্রহ করে কোনো শব্দ বা বাক্য লিখুন</p>`;
        return;
    }

    resultBox.innerHTML = `<p style="text-align: center; color: var(--subtext-color);">খোঁজা হচ্ছে...</p>`;

    try {
        const sourceLang = document.getElementById('sourceLang').value;
        const targetLang = document.getElementById('targetLang').value;

        // Use a free translation API endpoint (e.g., MyMemory or Google Translate API Endpoint)
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${sourceLang === 'auto' ? 'autodetect' : sourceLang}|${targetLang}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.responseData) {
            const translatedText = data.responseData.translatedText;

            resultBox.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color: #27ae60; font-size: 16px;">${query}</h3>
                    <button class="speak-btn" onclick="speakText('${query}', 'en-US')">🔊</button>
                </div>
                <p style="margin-top: 6px; font-weight: bold; font-size: 14px;">অর্থ: ${translatedText}</p>
                <hr style="margin: 10px 0; border: none; border-top: 1px solid var(--border-color);">
                <p style="font-size: 12px; opacity: 0.9;">🎯 <b>IELTS Usage:</b> Writing Task 1/2 and Speaking Topic Context</p>
                <button class="copy-btn" style="margin-top: 10px; padding: 6px 12px;" onclick="copyToClipboard('${query} - ${translatedText}')">📋 Copy Word & Meaning</button>
            `;
        }
    } catch (error) {
        resultBox.innerHTML = `<p style="color: red; text-align: center;">অনুবাদ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>`;
    }
}
