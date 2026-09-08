targetSelect.value = temp;
    }

    function searchWord() {
        const query = document.getElementById('wordInput').value.trim();
        const resultContainer = document.getElementById('resultContainer');
        const sourceLang = document.getElementById('sourceLang').value;
        const targetLang = document.getElementById('targetLang').value;

        if (!query) {
            resultContainer.innerHTML = `<p style="color: var(--subtext-color); text-align: center; font-size: 12px;">অনুগ্রহ করে একটি শব্দ বা বাক্য লিখুন</p>`;
            return;
        }

        const lowerQuery = query.toLowerCase();
        let translation = "";

        if (banglishDict[lowerQuery]) {
            translation = banglishDict[lowerQuery];
        } else {
            translation = query;
        }

        resultContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--primary-accent);">${query}</h3>
                <button class="speak-btn-icon" onclick="speakText('${query.replace(/'/g, "\\'")}', 'en-US')">🔊</button>
            </div>
            <p style="font-size: 14px; font-weight: 700; color: var(--text-color); margin-bottom: 10px;">
                <strong>অনুবাদ (Translation):</strong> ${translation}
            </p>
            <button class="copy-btn" onclick="copyToClipboard('${translation.replace(/'/g, "\\'")}')">📋 কপি করুন</button>
        `;
    }

    function speakText(text, lang = 'en-US') {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } else {
            showToast("আপনার ব্রাউজারে স্পিচ সাপোর্ট নেই");
        }
    }

    function startVoiceSearch() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast("আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        const micBtn = document.getElementById('micBtn');
        if (micBtn) micBtn.innerText = "🎙️ শুনছি...";

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('wordInput').value = transcript;
            if (micBtn) micBtn.innerText = "🎙️ কথা বলুন";
            searchWord();
        };

        recognition.onerror = function() {
            if (micBtn) micBtn.innerText = "🎙️ কথা বলুন";
            showToast("ভয়েস রেকগনিশন ব্যর্থ হয়েছে");
        };
    }

    function processImageSearch(event) {
        const file = event.target.files[0];
        if (!file) return;

        showToast("ছবি প্রসেস হচ্ছে...");
        Tesseract.recognize(
            file,
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            const cleanedText = text.trim();
            document.getElementById('wordInput').value = cleanedText;
            searchWord();
        }).catch(() => {
            showToast("ছবি স্ক্যান ব্যর্থ হয়েছে");
        });
    }

    function openIeltsInteractive(type) {
        const display = document.getElementById('ieltsToolDisplay');
        if (type === 'speaking') {
            display.innerHTML = `
                <h4 style="color: var(--ielts-primary); font-size: 14px; margin-bottom: 6px;">🗣️ IELTS Speaking Practice</h4>
                <p style="font-size: 12px; margin-bottom: 8px;"><strong>Part 1 Topic:</strong> Describe your hometown.</p>
                <p style="font-size: 12px; color: var(--subtext-color);">নমুনা ব্যান্ড ৮ উত্তর এবং মূল কিওয়ার্ড সহ আপনার উত্তর প্রদান করুন।</p>
            `;
        } else if (type === 'writing') {
            display.innerHTML = `
                <h4 style="color: var(--ielts-primary); font-size: 14px; margin-bottom: 6px;">✍️ IELTS Writing Assistant</h4>
                <p style="font-size: 12px;">আপনার Task 1 বা Task 2 রচনা নিচে পেস্ট করুন এবং AI ফিডব্যাক গ্রহণ করুন।</p>
            `;
        } else if (type === 'vocab') {
            let vocabHtml = `<h4 style="color: var(--ielts-primary); font-size: 14px; margin-bottom: 8px;">📚 Band 8+ IELTS Vocabulary</h4>`;
            ieltsVocabList.forEach(item => {
                vocabHtml += `
                    <div style="background: var(--input-bg); padding: 8px; border-radius: 8px; margin-bottom: 6px; font-size: 12px;">
                        <strong>${item.word}</strong> - ${item.meaning}<br>
                        <small><em>Synonyms:</em> ${item.syn}</small>
                    </div>
                `;
            });
            display.innerHTML = vocabHtml;
        } else if (type === 'reading') {
            display.innerHTML = `<h4 style="color: var(--ielts-primary); font-size: 14px;">📖 IELTS Reading Tips</h4><p style="font-size: 12px; margin-top: 6px;">Skimming ও Scanning কৌশল ব্যবহার করে সময় বাঁচান।</p>`;
        } else if (type === 'calc') {
            display.innerHTML = `<h4 style="color: var(--ielts-primary); font-size: 14px;">🎯 Band Score Calculator</h4><p style="font-size: 12px; margin-top: 6px;">Listening/Reading প্রাপ্ত সঠিক উত্তরের সংখ্যা থেকে ব্যান্ড স্কোর হিসেব করুন।</p>`;
        } else if (type === 'plan') {
            display.innerHTML = `<h4 style="color: var(--ielts-primary); font-size: 14px;">📅 Study Plan</h4><p style="font-size: 12px; margin-top: 6px;">প্রতিদিনের ৪টি মডিউল অনুশীলনের সময়সূচি সাজান।</p>`;
        }
    }

    function processAiWriting(mode) {
        const input = document.getElementById('aiWriteInput').value.trim();
        const resultCard = document.getElementById('aiWritingResult');
        if (!input) {
            resultCard.innerHTML = `<p style="color: var(--subtext-color); text-align: center; font-size: 12px;">অনুগ্রহ করে একটি বাক্য লিখুন</p>`;
            return;
        }

        let outputText = input;
        if (mode === 'grammar') {
            outputText = "Corrected: " + input.toUpperCase();
        } else if (mode === 'professional') {
            outputText = "Professional: " + input;
        } else if (mode === 'simple') {
            outputText = "Simplified: " + input;
        } else if (mode === 'shorten') {
            outputText = "Shortened: " + input.slice(0, 30);
        } else if (mode === 'translate') {
            outputText = banglishDict[input.toLowerCase()] || ("Translation: " + input);
        }

        resultCard.innerHTML = `
            <p style="font-size: 13px; font-weight: 700; color: var(--text-color);">${outputText}</p>
            <button class="copy-btn" onclick="copyToClipboard('${outputText.replace(/'/g, "\\'")}')">📋 কপি করুন</button>
        `;
    }

    function loadNextAiQuestion() {
        currentAiQIndex = (currentAiQIndex + 1) % aiQuestionsList.length;
        document.getElementById('aiQuestionText').innerText = aiQuestionsList[currentAiQIndex];
        document.getElementById('userSpeakingResult').innerText = "";
    }

    function startSpeakingAnswer() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast("আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        const speakBtn = document.getElementById('speakAnswerBtn');
        if (speakBtn) speakBtn.innerText = "🎙️ বলুন, শুনছি...";

        recognition.onresult = function(event) {
            const text = event.results[0][0].transcript;
            document.getElementById('userSpeakingResult').innerText = "আপনার উত্তর: " + text;
            if (speakBtn) speakBtn.innerText = "🎙️ Tap & Speak Answer";
            rewardPoints += 5;
            updatePointsUI();
        };

        recognition.onerror = function() {
            if (speakBtn) speakBtn.innerText = "🎙️ Tap & Speak Answer";
            showToast("ভয়েস রেকর্ড ব্যর্থ হয়েছে");
        };
    }

    function setPracticeType(type) {
        currentPracticeMode = type;
        document.querySelectorAll('.practice-chip').forEach(c => c.classList.remove('active'));
        if (type === 'vocab') document.getElementById('typeVocabBtn').classList.add('active');
        if (type === 'speaking') document.getElementById('typeSpeakingBtn').classList.add('active');
        if (type === 'grammar') document.getElementById('typeGrammarBtn').classList.add('active');
        initStepLearning();
    }

    function initStepLearning() {
        const category = document.getElementById('categorySelect').value;
        const listContainer = document.getElementById('wordCardList');
        document.getElementById('learningContainer').style.display = 'block';
        document.getElementById('quizContainer').style.display = 'none';

        if (currentPracticeMode === 'vocab') {
            currentStepWords = wordDatabase.filter(w => category === 'All' || w.category === category);
            if (currentStepWords.length === 0) currentStepWords = wordDatabase;

            let html = "";
            currentStepWords.forEach(w => {
                html += `
                    <div class="word-card">
                        <div>
                            <div class="word-card-title">${w.word}</div>
                            <div class="word-card-sub">${w.meaning}</div>
                        </div>
                        <button class="speak-btn-icon" onclick="speakText('${w.word}', 'en-US')">🔊</button>
                    </div>
                `;
            });
            listContainer.innerHTML = html;
        } else if (currentPracticeMode === 'grammar') {
            listContainer.innerHTML = grammarDatabase.map(g => `
                <div class="word-card">
                    <div>
                        <div class="word-card-title">${g.q}</div>
                        <div class="word-card-sub">Correct Answer: ${g.correct}</div>
                    </div>
                </div>
            `).join('');
        } else if (currentPracticeMode === 'speaking') {
            listContainer.innerHTML = speakingDatabase.map(s => `
                <div class="word-card">
                    <div>
                        <div class="word-card-title">${s.audioText}</div>
                        <div class="word-card-sub">${s.correct}</div>
                    </div>
                    <button class="speak-btn-icon" onclick="speakText('${s.audioText}', 'en-US')">🔊</button>
                </div>
            `).join('');
        }
    }

    function startStepQuiz() {
        document.getElementById('learningContainer').style.display = 'none';
        const quizContainer = document.getElementById('quizContainer');
        quizContainer.style.display = 'block';

        if (currentPracticeMode === 'vocab') {
            currentQuizQuestions = currentStepWords.map(item => {
                const wrongOptions = wordDatabase.filter(w => w.word !== item.word).map(w => w.meaning);
                const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
                const options = [...shuffledWrong, item.meaning].sort(() => 0.5 - Math.random());
                return { q: `"${item.word}"-এর বাংলা অর্থ কি?`, correct: item.meaning, options: options };
            });
        } else if (currentPracticeMode === 'grammar') {
            currentQuizQuestions = grammarDatabase;
        } else if (currentPracticeMode === 'speaking') {
            currentQuizQuestions = speakingDatabase.map(s => ({
                q: s.title,
                audio: s.audioText,
                correct: s.correct,
                options: s.options
            }));
        }

        currentQuizIndex = 0;
        renderQuizCard();
    }

    function renderQuizCard() {
        const quizContainer = document.getElementById('quizContainer');
        if (currentQuizIndex >= currentQuizQuestions.length) {
            rewardPoints += 20;
            updatePointsUI();
            stepCount++;
            document.getElementById('currentStepLevel').innerText = `Step ${stepCount}`;
            quizContainer.innerHTML = `
                <div class="quiz-card">
                    <h3>🎉 অভিনন্দনের সাথে ধাপটি সম্পন্ন হয়েছে!</h3>
                    <p style="margin: 10px 0;">আপনি ২০টি রিওয়ার্ড পয়েন্ট পেয়েছেন!</p>
                    <button class="action-btn" onclick="initStepLearning()">পরবর্তী ধাপে যান ➔</button>
                </div>
            `;
            return;
        }

        const qData = currentQuizQuestions[currentQuizIndex];
        let optionsHtml = "";
        qData.options.forEach(opt => {
            optionsHtml += `<button class="opt-btn" onclick="checkQuizAnswer('${opt.replace(/'/g, "\\'")}', '${qData.correct.replace(/'/g, "\\'")}')">${opt}</button>`;
        });

        quizContainer.innerHTML = `
            <div class="quiz-card">
                <h4>প্রশ্ন ${currentQuizIndex + 1} / ${currentQuizQuestions.length}</h4>
                <p style="font-size: 14px; font-weight: 700; margin: 10px 0;">${qData.q}</p>
                ${qData.audio ? `<button class="speak-btn-icon" style="margin: 0 auto 10px auto;" onclick="speakText('${qData.audio}', 'en-US')">🔊 শুনুন</button>` : ''}
                <div class="options-grid">${optionsHtml}</div>
            </div>
        `;
    }

    function checkQuizAnswer(selected, correct) {
        if (selected === correct) {
            showToast("সঠিক উত্তর! 🎯");
            rewardPoints += 2;
            updatePointsUI();
        } else {
            showToast("ভুল উত্তর! সঠিক: " + correct);
        }
        currentQuizIndex++;
        renderQuizCard();
    }
</script>
</body>
</html>
