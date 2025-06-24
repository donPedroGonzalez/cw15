var sentences, currentSelections, mode;
window.onload = onPageLoad();

function onPageLoad() {
    document.getElementById("button").disabled = false;
    var reloadButton = document.getElementById("reloadPage");
    reloadButton.addEventListener("click", clearForm);
    
    // Hide keyboard buttons for this exercise type
    document.getElementById("reset-keyboard").style.display = "none";
    document.getElementById("activate-keyboard").style.display = "none";
    
    var exerciceBody = document.getElementById("exercice-wrapper");
    
    // Exercise data
    sentences = [
        {
                        scrambled: ["Marcin", "m'", "Je", "appelle"],
                        correct: ["Je", "m'", "appelle", "Marcin"],
                        hint: "Nazywam się Marcin"
                    },
        {
                        scrambled: ["35", "J'", "ai", "ans"],
                        correct: ["J'", "ai", "35", "ans"],
                        hint: "Mam 35 lat"
                    },
        {
                        scrambled: ["Cracovie", "J'", "à", "habite"],
                        correct: ["J'", "habite", "à", "Cracovie"],
                        hint: "Mieszkam w Krakowie"
                    },
        {
                        scrambled: ["Je", "anglais", "parle"],
                        correct: ["Je", "parle", "anglais"],
                        hint: "Mówię po angielsku"
                    },
        {
                        scrambled: ["allemand", "parle", "Je", "pas", "ne"],
                        correct: ["Je", "ne", "parle", "pas", "allemand"],
                        hint: "Nie mówię po niemiecku"
                    },
        {
                        scrambled: ["suis", "polonais", "Je"],
                        correct: ["Je", "suis", "polonais"],
                        hint: "Jestem Polakiem"
                    },
        {
                        scrambled: ["marié", "suis", "Je"],
                        correct: ["Je", "suis", "marié"],
                        hint: "Jestem żonaty"
                    },
        {
                        scrambled: ["deux", "J'", "enfants", "ai"],
                        correct: ["J'", "ai", "deux", "enfants"],
                        hint: "Mam dwoje dzieci"
                    }
    ];;
    
    mode = 'click'; // Default to click mode for simplicity
    currentSelections = [];
    
    // Set up exercise title and instructions
    document.getElementById("premiere-consigne").innerText = "Ułóż wyrazy w odpowiedniej kolejności";
    document.getElementById("deuxieme-consigne").innerText = "Arrangez les mots dans le bon ordre";
    document.getElementById("footer-cat-info").innerText = "Przedstawianie się";
    
    // Create the exercise
    var myForm = document.createElement("div");
    myForm.setAttribute("id", "myExercice");
    
    // Add CSS styles specific to this exercise
    addWordOrderStyles();
    
    // Initialize current selections
    sentences.forEach(function(sentence, index) {
        currentSelections[index] = { 
            pool: [...sentence.scrambled], 
            construction: [] 
        };
    });
    
    // Create sentence items
    sentences.forEach(function(sentence, index) {
        var sentenceDiv = createSentenceItem(sentence, index);
        myForm.appendChild(sentenceDiv);
    });
    
    exerciceBody.appendChild(myForm);
    
    // Update word blocks for all sentences after DOM is ready
    sentences.forEach(function(sentence, index) {
        updateWordBlocks(index);
    });
    
    // Set up check button
    document.getElementById("button").onclick = checkAllAnswers;
}

function addWordOrderStyles() {
    var style = document.createElement('style');
    style.textContent = `
        .sentence-container {
            background-color: #f8f8f8;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .sentence-number {
            color: #6c5b7c;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .hint-text {
            color: #888;
            font-style: italic;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .words-pool, .construction-area {
            border-radius: 8px;
            padding: 15px;
            min-height: 50px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 10px;
            position: relative;
        }
        
        .words-pool {
            background-color: #fff;
            border: 2px dashed #d0d0d0;
        }
        
        .construction-area {
            background-color: #f0f8ff;
            border: 2px solid #b0d4ff;
        }
        
        .construction-area.empty::after {
            content: "Cliquez sur les mots pour les placer ici";
            position: absolute;
            color: #999;
            font-style: italic;
            pointer-events: none;
        }
        
        .word-block {
            background-color: #6c5b7c;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            user-select: none;
            font-size: 16px;
            transition: all 0.2s ease;
            display: inline-block;
        }
        
        .word-block:hover {
            background-color: #867298;
            transform: translateY(-2px);
        }
        
        .word-block.in-construction {
            background-color: #5a9e5a;
        }
        
        .word-block.in-construction:hover {
            background-color: #6ab06a;
        }
        
        .sentence-result {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
            display: none;
        }
        
        .sentence-result.correct {
            background-color: #d4f4d4;
            color: #2a7a2a;
        }
        
        .sentence-result.incorrect {
            background-color: #ffd4d4;
            color: #aa2a2a;
        }
    `;
    document.head.appendChild(style);
}

function createSentenceItem(sentence, index) {
    var container = document.createElement('div');
    container.className = 'sentence-container';
    container.setAttribute('id', 'sentence' + index);
    
    // Sentence number
    var numberDiv = document.createElement('div');
    numberDiv.className = 'sentence-number';
    numberDiv.textContent = 'Phrase ' + (index + 1);
    container.appendChild(numberDiv);
    
    // Hint
    var hintDiv = document.createElement('div');
    hintDiv.className = 'hint-text';
    hintDiv.textContent = '(' + sentence.hint + ')';
    container.appendChild(hintDiv);
    
    // Words pool
    var poolDiv = document.createElement('div');
    poolDiv.className = 'words-pool';
    poolDiv.setAttribute('id', 'pool' + index);
    container.appendChild(poolDiv);
    
    // Construction area
    var constructionDiv = document.createElement('div');
    constructionDiv.className = 'construction-area empty';
    constructionDiv.setAttribute('id', 'construction' + index);
    container.appendChild(constructionDiv);
    
    // Result div
    var resultDiv = document.createElement('div');
    resultDiv.className = 'sentence-result';
    resultDiv.setAttribute('id', 'result' + index);
    container.appendChild(resultDiv);
    
    return container;
}

function updateWordBlocks(sentenceIndex) {
    var poolDiv = document.getElementById('pool' + sentenceIndex);
    var constructionDiv = document.getElementById('construction' + sentenceIndex);
    
    if (!poolDiv || !constructionDiv) {
        console.error('Elements not found for sentence ' + sentenceIndex);
        return;
    }
    
    var selection = currentSelections[sentenceIndex];
    
    // Clear existing content
    poolDiv.innerHTML = '';
    constructionDiv.innerHTML = '';
    
    // Update empty class for construction area
    if (selection.construction.length === 0) {
        constructionDiv.classList.add('empty');
    } else {
        constructionDiv.classList.remove('empty');
    }
    
    // Add words to pool
    selection.pool.forEach(function(word, wordIndex) {
        var wordBlock = createWordBlock(word, sentenceIndex, 'pool', wordIndex);
        poolDiv.appendChild(wordBlock);
    });
    
    // Add words to construction area
    selection.construction.forEach(function(word, wordIndex) {
        var wordBlock = createWordBlock(word, sentenceIndex, 'construction', wordIndex);
        constructionDiv.appendChild(wordBlock);
    });
}

function createWordBlock(word, sentenceIndex, area, wordIndex) {
    var wordDiv = document.createElement('span');
    wordDiv.className = 'word-block';
    if (area === 'construction') {
        wordDiv.className += ' in-construction';
    }
    wordDiv.textContent = word;
    wordDiv.onclick = function() {
        handleWordClick(word, sentenceIndex, area, wordIndex);
    };
    return wordDiv;
}

function handleWordClick(word, sentenceIndex, area, wordIndex) {
    var selection = currentSelections[sentenceIndex];
    
    if (area === 'pool') {
        // Move from pool to construction
        selection.pool.splice(wordIndex, 1);
        selection.construction.push(word);
    } else {
        // Move from construction back to pool
        selection.construction.splice(wordIndex, 1);
        selection.pool.push(word);
    }
    
    updateWordBlocks(sentenceIndex);
}

function checkAllAnswers() {
    var correctCount = 0;
    
    sentences.forEach(function(sentence, index) {
        var selection = currentSelections[index];
        var isCorrect = JSON.stringify(selection.construction) === JSON.stringify(sentence.correct);
        
        var resultDiv = document.getElementById('result' + index);
        resultDiv.style.display = 'block';
        
        if (isCorrect) {
            correctCount++;
            resultDiv.className = 'sentence-result correct';
            resultDiv.textContent = '✓ C\'est correct, félicitations !';
        } else {
            resultDiv.className = 'sentence-result incorrect';
            resultDiv.textContent = '✗ La réponse correcte : "' + sentence.correct.join(' ') + '"';
        }
    });
    
    // Show overall result
    var resultWrapper = document.getElementById("result-wrapper");
    resultWrapper.innerText = "Ton résultat : " + correctCount + " / " + sentences.length;
    resultWrapper.setAttribute("style", "font-size: larger; color: dark-blue; text-shadow: 0px 0px 3px white;");
}

function clearForm() {
    // Reset all selections
    sentences.forEach(function(sentence, index) {
        currentSelections[index] = {
            pool: [...sentence.scrambled],
            construction: []
        };
        updateWordBlocks(index);
        
        // Hide result
        var resultDiv = document.getElementById('result' + index);
        if (resultDiv) {
            resultDiv.style.display = 'none';
        }
    });
    
    // Clear overall result
    document.getElementById("result-wrapper").innerText = "";
}