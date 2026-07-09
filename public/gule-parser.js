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

const prepositions = [
    "kak",
    "rosha",
    "wik",
    "yus",
    "siha"
];

function parsePredicateList(words) {

    const list = [];

    let start = 0;


    for (let i = 0; i <= words.length; i++) {


        if (
            i === words.length ||
            words[i].text === "gu" ||
            words[i].text === "shea"
        ) {

            const part =
                words.slice(start, i);


            list.push(
                parsePredicatePart(part)
            );


            start = i + 1;

        }

    }


    return list;
}
function parsePredicatePart(words) {

    const shaIndex =
        words.findIndex(
            t => t.text === "sha"
        );


    // shaなし
    if (shaIndex === -1) {

        return {

            predicate:
                parsePredicate(words)

        };

    }


    // shaあり
    const predicateWords =
        words.slice(0, shaIndex);


    const objectWords =
        words.slice(shaIndex + 1);



    return {

        predicate:
            parsePredicateWithObject(
                predicateWords
            ),

        objects:
            parseObjectList(
                objectWords
            )

    };

}
function parsePredicateWithObject(words) {

    if (words.length === 0) {
        throw new Error("目的語付き述語がありません。");
    }


    return {
        type: "Predicate",

        possibilities:
            parsePredicateCore(
                words,
                {
                    allowNonVerb: false
                }
            )
    };

}

/**
 * グレイシア語 簡易構文解析器
 * 対応文法:
 * A gu B
 * A gu B sha C提
 */

function parse(sentence){

    const tokens = processLa(tokenize(sentence));


    const markerIndex =
        tokens.findIndex(
            t =>
            t.text === "gu" ||
            t.text === "shea"
        );


    if(markerIndex === -1){
        throw new Error("gu または shea がありません");
    }


    const subjects =
        parseSubjectList(
            tokens.slice(0, markerIndex)
        );


    const predicateTokens =
        tokens.slice(markerIndex + 1);


    const predicates =
        parsePredicateList(
            predicateTokens
        );


    return {

        type:
            tokens[markerIndex].text === "shea"
            ? "Command"
            : "Sentence",

        subjects,

        predicates

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

// 述語全体の解析
function parsePredicate(words) {

    if (words.length === 0) {
        throw new Error("述語がありません。");
    }

    return {
        type: "Predicate",
        possibilities: parsePredicateCore(words)
    };
}


// 述語候補生成
function parsePredicateCore(words,options = {}) {

    const possibilities = [];


    if (words.length === 0) {
        return possibilities;
    }


    const first = words[0];


    // --------------------
    // 前置詞として解釈
    // --------------------

    if (prepositions.includes(first.text)) {

        possibilities.push({

            role: "PrepositionPredicate",

            phrase:
                parsePrepositionPhrase(words)

        });

    }


    // --------------------
    // 助動詞として解釈
    // --------------------

    if (auxiliaries.includes(first.text)) {

        const rest = words.slice(1);


        if (rest.length > 0) {

            const nextCandidates =
                parsePredicateCore(
                    rest,
                    options
                );


            for (const candidate of nextCandidates) {

                possibilities.push({

                    role:
                        "AuxiliaryPredicate",

                    auxiliary:
                        first,

                    predicate:
                        candidate

                });

            }

        }

    }


    // --------------------
    // 前置詞句を後ろに持つ場合
    // --------------------

    const split =
        splitPrepositionPhrase(words);


    if (split) {

        possibilities.push({

            role: "Verb",

            tree:
                parseModifier(
                    split.main
                ),

            adjunct:
                parsePrepositionPhrase(
                    split.preposition
                )

        });


    } else {


        // --------------------
        // 動詞解釈
        // --------------------

        possibilities.push({

            role: "Verb",

            tree:
                parseModifier(words)

        });

    }



    // --------------------
    // 非動詞解釈
    // shaがある時は禁止
    // --------------------

    if (options.allowNonVerb !== false) {

        possibilities.push({

            role:
                "NonVerbPredicate",

            tree:
                parseModifier(words)

        });

    }


    return possibilities;

}



// 前置詞句
function parsePrepositionPhrase(words) {

    const prep = words[0];

    const object =
        parseNounPhrase(
            words.slice(1)
        );


    return {

        type: "PrepositionalPhrase",

        preposition: prep,

        object: object

    };

}

// 前置詞分割
function splitPrepositionPhrase(words) {

    for (let i = 1; i < words.length; i++) {

        if (prepositions.includes(words[i].text)) {

            return {
                main: words.slice(0, i),

                preposition:
                    words.slice(i)
            };

        }

    }

    return null;
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