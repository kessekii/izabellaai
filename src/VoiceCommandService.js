import React, { useState } from 'react';

export function voiceRecognition(textsetter, lang) {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = lang;
    let state = "no command";
    let lasttranscript = "";
    recognition.onstart = function() {
        textsetter('Voice recognition activated.');
    }

    recognition.onspeechend = function() {
        if (state == "command active") {
            textsetter("let's be friends");
        } else if (lasttranscript !== "") {
            textsetter(lasttranscript);
        } else {
            textsetter('You were quiet for a while so voice recognition turned itself off.');
        }
    }

    recognition.onerror = function(event) {
        if(event.error == 'no-speech') {
            textsetter('No speech was detected. Try again.');  
        }
    }

    recognition.onresult = function(event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript;
        var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
        
        if(!mobileRepeatBug) {
            lasttranscript = transcript;
            if (transcript === "let's be friends") {
                state = "command active";
                textsetter("let's be friends");
                
                setTimeout(() => {
                    state = "no command";
                }, 5000);
            }
        }
    };

    recognition.start();
}