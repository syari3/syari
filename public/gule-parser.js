function tokenize(sentence) {
    return sentence
        .replace(/([.,!?])/g, " $1 ")
        .trim()
        .split(/\s+/);
}

const auxiliaries = [
    "uhu",
    "newa",
    "soso",
    "tsero",
    "hus",
    "nyola",
    "ula",
    "hona"
];

/**
 * グレイシア語 簡易構文解析器
 * 対応文法:
 * A gu B
 * A gu B sha C
 * 
 * processLa() を先に実行することを前提
 */

function parse(sentence) {

    const tokens = processLa(
        tokenize(sentence)
    );

    const guIndex = tokens.findIndex(t => t.text === "gu");

    if (guIndex === -1) {
        throw new Error("gu がありません。");
    }

    const shaIndex = tokens.findIndex(t => t.text === "sha");

    const subject = tokens.slice(0, guIndex);

    // -----------------------
    // A gu B
    // -----------------------
    if (shaIndex === -1) {

        const predicateWords = tokens.slice(guIndex + 1);
        const predicate = parsePredicate(predicateWords);

        // 助動詞があるか？
        const hasAux = predicate.auxiliaries.length > 0;

        return {
            type: "Sentence",

            subject: {
                type: "NounPhrase",
                words: subject
            },

            predicate: hasAux
                ? {
                    type: "Predicate",
                    possibilities: [
                        {
                            role: "Verb",
                            auxiliaries: predicate.auxiliaries,
                            verbPhrase: predicate.verbPhrase
                        }
                    ]
                }
                : {
                    type: "Predicate",
                    possibilities: [
                        {
                            role: "Verb",
                            auxiliaries: [],
                            verbPhrase: predicate.verbPhrase
                        },
                        {
                            role: "NounPredicate",
                            words: predicate.verbPhrase
                        },
                        {
                            role: "AdjectivePredicate",
                            words: predicate.verbPhrase
                        }
                    ]
                }
        };
    }

    // -----------------------
    // A gu B sha C
    // -----------------------

    const predicate = parsePredicate(
        tokens.slice(guIndex + 1, shaIndex)
    );

    const object = tokens.slice(shaIndex + 1);

    return {
        type: "Sentence",

        subject: {
            type: "NounPhrase",
            words: subject
        },

        predicate: {
            type: "Predicate",
            possibilities: [
                {
                    role: "Verb",
                    auxiliaries: predicate.auxiliaries,
                    verbPhrase: predicate.verbPhrase
                }
            ]
        },

        object: {
            type: "NounPhrase",
            words: object
        }
    };
}

/**
 * la を処理する
 * ・区切り直後なら「0」として扱う
 * ・それ以外なら直前の単語を否定する
 */
function processLa(tokens) {
    const result = [];

    for (const token of tokens) {
        if (token !== "la") {
            result.push({
                text: token,
                negated: false
            });
            continue;
        }

        // 文頭、gu直後、sha直後なら「0」
        if (
            result.length === 0 ||
            result[result.length - 1].text === "gu" ||
            result[result.length - 1].text === "sha"
        ) {
            result.push({
                text: "la",
                negated: false,
                meaning: "zero"
            });
        } else {
            // 直前を否定
            result[result.length - 1].negated = true;
        }
    }

    return result;
}

//助動詞判定
function parsePredicate(words) {

    // 単語が無い
    if (words.length === 0) {
        throw new Error("述語がありません。");
    }

    let verbStart = 0;

    // 先頭から助動詞を探す
    while (
        verbStart < words.length - 1 &&
        auxiliaries.includes(words[verbStart].text)
    ) {
        verbStart++;
    }

    return {
        type: "Predicate",

        auxiliaries: words.slice(0, verbStart),

        // 今はPhraseとして持つ
        verbPhrase: words.slice(verbStart)
    };
}