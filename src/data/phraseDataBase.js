export const phraseDataBase = {
  en: {
    voice: "en-GB-Wavenet-D",
    drinking: {
      question:
        "Is the person in the last photo actively drinking drinking? Answer with only 'yes' or 'no'.",
      no: ["Don't forget to drink some water!"],
      yes: ["Thank you for taking care of yourself and drinking!"],
    },
    misc: {
      generation:
        "Mode in which the system generates a new sentence based on the last photo taken, reacts to familiar people, has ability to understand and reply to human speech.",
      monotone:
        "Mode in which the system repeats the same sentence verifying the possible actions one by one. (LEGACY mode)",
      scheduler:
        "Mode in which user can generate his own schedule of actions and the system will remind him about them.",
    },
    agitation: {
      question:
        "Is the person in the last photo visibly agitated? Answer with only 'yes' or 'no'.",
      yes: ["Take a deep breath and relax."],
    },
    laughing: {
      question:
        "Is the person in the last photo laughing? Answer with only 'yes' or 'no'.",
      yes: ["Laughter is the best medicine!"],
    },
    smoking: {
      question:
        "Is the person in the last photo currently smoking a cigarette, cigar, or other smoking device? Answer with only 'yes' or 'no'.",
      yes: ["Smoking is harmful to your health, please consider quitting."],
    },
    facerecognition: {
      question: "Are they the same?",
      yes: ["Good to see you ,"],
    },
  },
  ru: {
    voice: "ru-RU-Wavenet-D",
    drinking: {
      question:
        "Is the person in the last photo actively drinking drinking? Answer with only 'yes' or 'no'.",
      no: ["Может, выпьешь немного воды?"],
      yes: ["Спасибо, что выпили воды!"],
    },
    agitation: {
      question:
        "Is the person in the last photo visibly agitated? Answer with only 'yes' or 'no'.",
      yes: ["Попробуйте расслабиться и успокоиться."],
    },
    laughing: {
      question:
        "Is the person in the last photo laughing? Answer with only 'yes' or 'no'.",
      yes: ["Смех - это лучшее лекарство!"],
    },
    smoking: {
      question:
        "Is the person in the last photo currently smoking a cigarette, cigar, or other smoking device? Answer with only 'yes' or 'no'.",
      yes: ["Курение вредит вашему здоровью, давай бросай!"],
    },
    facerecognition: {
      question: "Are they the same?",
      yes: ["Привет,"],
    },
    misc: {
      generation:
        "Режим, в котором система генерирует новое предложение на основе последнего снимка, реагирует на знакомых людей, обладает способностью понимать и отвечать на человеческую речь.",
      monotone:
        "Режим, в котором система повторяет одно и то же предложение, проверяя возможные действия поочередно. ",
      scheduler:
        "Режим, в котором пользователь может создать свое собственное расписание действий, и система будет напоминать ему о них.",
    },
  },
  he: {
    voice: "he-IL-Wavenet-D",
    drinking: {
      question:
        "Is the person in the last photo actively drinking drinking? Answer with only 'yes' or 'no'.",
      no: ["אל תשכח לשתות מים!"],
      yes: ["תודה ששתית מים!"],
    },
    agitation: {
      question:
        "Is the person in the last photo visibly agitated? Answer with only 'yes' or 'no'.",
      yes: ["נשמע שאתה עצבני, נשמע שאתה צריך לנשום עמוק ולהירגע."],
    },
    laughing: {
      question:
        "Is the person in the last photo laughing? Answer with only 'yes' or 'no'.",
      yes: ["צחוק הוא התרופה הכי טובה!"],
    },
    smoking: {
      question:
        "Is the person in the last photo currently smoking a cigarette, cigar, or other smoking device? Answer with only 'yes' or 'no'.",
      yes: ["עישון מזיק לבריאותך, תשקול להפסיק."],
    },
    facerecognition: {
      question: "Are they the same?",
      yes: ["שלום,"],
    },
    misc: {
      generation:
        "מצב בו המערכת יוצרת משפט חדש בהתבסס על התמונה האחרונה, מגיבה לאנשים מוכרים, יש לה את היכולת להבין ולהגיב לדיבור של בני אדם.",
      monotone:
        "מצב בו המערכת חוזרת על אותו משפט ומאמתת את הפעולות האפשריות אחת אחת.",
      scheduler:
        "מצב בו המשתמש יכול ליצור סידור עבודה של פעולות והמערכת תזכיר לו עליהן.",
    },
  },
};
