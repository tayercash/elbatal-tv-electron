/**
 * Extracts eval(...) occurrences from an HTML string.
 * Returns an array of objects: {scriptIndex, scriptText, evalIndex, evalCall, evalArg}
 */
function extractEvalCallsFromHTML(html) {
    // parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const scripts = Array.from(doc.querySelectorAll('script'));
    const out = [];

    for (let i = 0; i < scripts.length; i++) {
        const text = scripts[i].textContent || '';
        let pos = 0;
        while (true) {
            const evalPos = text.indexOf('eval', pos);
            if (evalPos === -1) break;

            // find '(' after 'eval'
            const parenPos = text.indexOf('(', evalPos + 4);
            if (parenPos === -1) break;

            const arg = _extractBalancedParentheses(text, parenPos);
            if (arg == null) break;

            const evalCall = 'eval(' + arg + ')';
            out.push({
                scriptIndex: i,
                scriptText: text,
                evalIndex: evalPos,
                evalCall,
                evalArg: arg
            });

            pos = parenPos + arg.length + 1; // continue after this eval
        }
    }
    return out;
}

/**
 * Return substring between matching parentheses starting at index of '(' (i.e. returns content *inside* the parens)
 * Handles quotes, escapes, backticks, nested parentheses, and basic comments.
 */
function _extractBalancedParentheses(str, openParenIndex) {
    if (str[openParenIndex] !== '(') return null;
    let depth = 0;
    let inString = null; // quote char if inside string
    let escaped = false;
    for (let i = openParenIndex; i < str.length; i++) {
        const ch = str[i];

        if (escaped) { escaped = false; continue; }

        // enter/exit string
        if (inString) {
            if (ch === '\\') { escaped = true; continue; }
            if (ch === inString) { inString = null; continue; }
            continue;
        } else {
            if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue; }
        }

        // skip comments (simple)
        if (ch === '/' && str[i + 1] === '/') {
            i += 2;
            while (i < str.length && str[i] !== '\n') i++;
            i--; // loop will increment
            continue;
        }
        if (ch === '/' && str[i + 1] === '*') {
            i += 2;
            while (i + 1 < str.length && !(str[i] === '*' && str[i + 1] === '/')) i++;
            i++; // move to '/'
            continue;
        }

        if (ch === '(') depth++;
        else if (ch === ')') {
            depth--;
            if (depth === 0) {
                // return internal content (without outer parens)
                return str.slice(openParenIndex + 1, i);
            }
        }
    }
    return null; // not balanced
}