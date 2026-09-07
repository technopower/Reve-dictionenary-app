function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById('themeToggleBtn');
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        btn.innerText = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        btn.innerText = '☀️';
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast("কপি করা হয়েছে! 📋");
}

function swapLanguages() {
    const sourceSelect = document.getElementById('sourceLang');
    const targetSelect = document.getElementById('targetLang');
    if (sourceSelect.value === 'auto') sourceSelect.value = 'en';
    const temp = sourceSelect.value;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = temp;
}

function speakText(text, langCode = 'en-US') {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
}

/* SMART BANGLISH & TRANSLATION ENGINE */
async function searchWord() {
    let word = document.getElementById('wordInput').value.trim();
    const sourceLang = document.getElementById('sourceLang').value;
    const targetLang = document.getElementById('targetLang').value;
    const resCard = document.getElementById('resultContainer');

    if (!word) {
        alert('একটি শব্দ বা বাক্য লিখুন!');
        return;
    }

    resCard.innerHTML = '<p style="text-align: center; color: #16a085;">🔍 অনুবাদ ও অর্থ অনুসন্ধান করা হচ্ছে...</p>';

    try {
        let translatedText = "";

        // বাংলিশ টেক্সট ডিটেকশন লজিক
        const isBanglish = /^[a-zA-Z0-9\s.,?!]+$/.test(word) && (
            /\b(ami|tumi|she|amra|tara|jabo|khabo|korbo|koro|kore|jacchi|kothay|bhalo|feni|dhaka|koto|theke|jonno|keno|ki|kon|kokhon)\b/i.test(word)
        );

        if (isBanglish) {
            // ১. বাংলিশ থেকে ইংরেজি
            const enRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=bn-BD&tl=en&dt=t&q=${encodeURIComponent(word)}`);
            const enData = await enRes.json();
            let englishText = (enData && enData[0] && enData[0][0][0]) ? enData[0][0][0] : word;

            // ২. ইংরেজি থেকে বাংলা
            const bnRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(englishText)}`);
            const bnData = await bnRes.json();
            let banglaText = (bnData && bnData[0] && bnData[0][0][0]) ? bnData[0][0][0] : "";

            if (banglaText && englishText !== word) {
                translatedText = `${englishText} (${banglaText})`;
            } else if (englishText !== word) {
                translatedText = englishText;
            }
        }

        // সাধারণ অনুবাদ
        if (!translatedText) {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(word)}`);
            const data = await res.json();
            if (data && data[0]) {
                data[0].forEach(item => {
                    if (item[0]) translatedText += item[0];
                });
            }
        }

        const targetSpeakLang = targetLang === 'bn' ? 'bn-BD' : 'en-US';

        resCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="color:#16a085; font-size:16px;">${word}</h3>
                <button class="speak-btn-speaker" onclick="speakText('${word.replace(/'/g, "\\'")}', 'en-US')">🔊</button>
            </div>
            <p style="font-size: 14px; font-weight: bold; margin-top: 8px; color: var(--text-color);">
                <b>অর্থ / অনুবাদ:</b> ${translatedText}
            </p>
            <div style="margin-top: 6px;">
                <button class="speak-btn" style="border-radius:6px; padding:4px 10px;" onclick="speakText('${translatedText.replace(/'/g, "\\'")}', '${targetSpeakLang}')">🔊 অনুবাদ শুনুন</button>
            </div>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid var(--border-color);">
            <p>🎯 <b>IELTS Usage:</b> Daily conversation and writing context</p>
            <button class="icon-btn" style="margin-top:8px; font-size:11px;" onclick="copyToClipboard('${word} : ${translatedText}')">📋 Copy Word & Meaning</button>
        `;
    } catch(e) {
        resCard.innerHTML = '<p style="color:red; text-align:center;">অনুবাদ ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।</p>';
    }
}

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই!');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function(event) {
        document.getElementById('wordInput').value = event.results[0][0].transcript;
        searchWord();
    };
}

function processImageSearch(event) {
    const file = event.target.files[0];
    if (!file) return;
    const resCard = document.getElementById('resultContainer');
    resCard.innerHTML = '<p style="text-align: center; color: #16a085;">🖼️ ছবি থেকে লেখা স্ক্যান করা হচ্ছে...</p>';

    Tesseract.recognize(file, 'eng')
        .then(({ data: { text } }) => {
            const cleanedText = text.trim().replace(/\n/g, ' ');
            if (cleanedText) {
                document.getElementById('wordInput').value = cleanedText;
                searchWord();
            } else {
                resCard.innerHTML = '<p style="color:red; text-align:center;">ছবি থেকে কোনো লেখা পড়া যায়নি।</p>';
            }
        })
        .catch(() => {
            resCard.innerHTML = '<p style="color:red; text-align:center;">ছবি প্রসেস করতে সমস্যা হয়েছে।</p>';
        });
}
