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
 * A gu B sha C提
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

    const subjects = parseSubjectList(
        tokens.slice(0, guIndex)
    );

    // -----------------------
    // A gu B
    // -----------------------

    if (shaIndex === -1) {

        const predicateWords = tokens.slice(guIndex + 1);
        const predicate = parsePredicate(
            predicateWords
        );

        return {
            type: "Sentence",

            subjects: subjects,

            predicate: predicate
        };
    }

    // -----------------------
    // A gu B sha C
    // -----------------------

    const predicate = parsePredicate(
        tokens.slice(guIndex + 1, shaIndex)
    );

    const objects = parseObjectList(
        tokens.slice(shaIndex + 1)
    );

    return {
        type: "Sentence",

        subjects: subjects,

        predicate: predicate,

        objects: objects
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

        // 文頭、gu直後、sha直後なら0
        if (
            result.length === 0 ||
            result[result.length - 1].text === "gu" ||
            result[result.length - 1].text === "sha"
        ) {
            result.push({
                text: "la",
                meaning: "zero"
            });
        } else {
            result.push({
                text: "la"
            });
        }
    }

    return result;
}

//候補生成
function parsePredicate(words) {

    if (words.length === 0) {
        throw new Error("述語がありません。");
    }

    const possibilities = [];

    // --------------------
    // 助動詞として解釈
    // --------------------

    let verbStart = 0;

    while (
        verbStart < words.length - 1 &&
        auxiliaries.includes(words[verbStart].text)
    ) {
        verbStart++;
    }

    if (verbStart > 0) {

        possibilities.push({
            role: "Verb",
            auxiliaries: words.slice(0, verbStart),
            verbPhrase: parseModifier(
                words.slice(verbStart)
            )
        });

    }

    // --------------------
    // 普通の動詞として解釈
    // --------------------

    possibilities.push({
        role: "Verb",
        auxiliaries: [],
        verbPhrase: parseModifier(words)
    });

    // --------------------
    // 名詞述語
    // --------------------

    possibilities.push({
        role: "NounPredicate",
        tree: parseModifier(words)
    });

    // --------------------
    // 形容詞述語
    // --------------------

    possibilities.push({
        role: "AdjectivePredicate",
        tree: parseModifier(words)
    });

    return {
        type: "Predicate",
        possibilities: possibilities
    };

}

//名詞句解析
function parseNounPhrase(words) {
    return {
        type: "NounPhrase",
        tree: parseModifier(words)
    };
}

//主語分割
function parseSubjectList(words) {

    const subjects = [];

    let start = 0;

    for (let i = 0; i <= words.length; i++) {

        if (i === words.length || words[i].text === "on") {

            subjects.push(
                parseNounPhrase(
                    words.slice(start, i)
                )
            );

            start = i + 1;
        }

    }

    return subjects;
}

//目的語分割
function parseObjectList(words) {

    const objects = [];

    let start = 0;

    for (let i = 0; i <= words.length; i++) {

        if (i === words.length || words[i].text === "sha") {

            objects.push(
                parseNounPhrase(
                    words.slice(start, i)
                )
            );

            start = i + 1;
        }

    }

    return objects;
}

function parseModifier(words) {

    if (words.length === 0) {
        return null;
    }

    // su の数を確認
    const suCount = words.filter(word => word.text === "su").length;

    if (suCount > 1) {
        throw new Error("su は1つの名詞句に2回以上使えません。");
    }

    // su がある場合
    const suIndex = words.findIndex(word => word.text === "su");

    if (suIndex !== -1) {
        return {
            type: "Modify",
            target: parseModifier(words.slice(0, suIndex)),
            modifier: parseModifier(words.slice(suIndex + 1))
        };
    }

    // 左結合
    let tree = words[0];

    for (let i = 1; i < words.length; i++) {

        if (words[i].text === "la") {

            tree = {
                type: "Negate",
                target: tree
            };

        } else {

            tree = {
                type: "Modify",
                target: tree,
                modifier: words[i]
            };

        }
    }

    return tree;
}