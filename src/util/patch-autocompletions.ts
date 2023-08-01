import { insertCompletionText, CompletionContext, Completion } from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";

type Word = {
    from: number;
    to: number;
    text: string;
}

const generateCompletionText = (key: string, patchVM: any) => {
    const { parameters, exampleParameters } = patchVM.getDynamicFunctionInfo(key);
    const args = parameters.map((param: string) => {
        const paramterOptions = exampleParameters[param];
        let validParameter = paramterOptions;
        // Check if options is a list of strings
        if (Array.isArray(paramterOptions)) {
            validParameter = `'${paramterOptions[0]}'`;
        }
        return validParameter;
    });
    const value = `${key}(${args.join(", ")})`;
    let from = value.length;
    let to = value.length;
    if (args.length > 0) {
        from = value.indexOf("(") + 1;
        to = String(args[0]).length + from;
    }
    return {
        value,
        from,
        to,
    };
}

type PatchVM = any; // Replace with the actual type of your patchVM object

type ApplyFunction = (
    key: string,
    patchVM: PatchVM
) => (
    view: EditorView,
    completion: Completion,
    from: number,
    to: number
) => void;

const apply: ApplyFunction = (key, patchVM) => (view, completion, from, to) => {
    const text = generateCompletionText(key, patchVM);
    view.dispatch(insertCompletionText(view.state, text.value, from, to));
    view.dispatch({
        selection: {
            anchor: from + text.from,
            head: from + text.to,
        },
    });
};

/** 
 * Reorders the provided options list based on a fuzzy match of the word
*/
const reorderOptions = (options: { label: string }[], word: Word) => {
    const text = word.text;
    const wordLower = text.toLowerCase();
    const optionsWithScore = options.map((option) => {
        const labelLower = option.label.toLowerCase();
        const score = labelLower.indexOf(wordLower);
        return {
            ...option,
            score,
        };
    });
    optionsWithScore.sort((a, b) => {
        return b.score - a.score;
    });
    return optionsWithScore;
};

const handleArgListCompletion = (word: Word, argPosition: number, functionName: string, inQuotes: boolean, patchVM: any) => {
    const functionInfo = patchVM.getDynamicFunctionInfo(functionName);
    if (!functionInfo) {
        return null;
    }
    const { parameters, exampleParameters } = functionInfo;
    const arg = parameters[argPosition];
    if (!arg) {
        return null;
    }
    let paramterOptions = exampleParameters[arg];
    if (!Array.isArray(paramterOptions)) {
        return null;
    }
    return {
        from: word.from,
        filter: false,
        options: reorderOptions(paramterOptions.map((paramterOption) => {
            let value = paramterOption;
            if (!inQuotes) {
                value = `'${paramterOption}'`;
            }
            return {
                label: paramterOption,
                detail: value,
                apply: value,
            };
        }), word),
    };
}

const getArgPosition = (argListNode: SyntaxNode, context: CompletionContext) => {
    const pos = context.pos;
    const argListStart = argListNode.from;
    const argListText = context.state.sliceDoc(argListNode.from, argListNode.to);
    const argListTextBeforePos = argListText.slice(0, pos - argListStart);
    const argListTextBeforePosCommaCount = argListTextBeforePos.split(",").length - 1;
    const argPosition = argListTextBeforePosCommaCount;
    return argPosition;
}

const completions = (patchVM: any) => (context: CompletionContext) => {
    const apiInfo = patchVM.getApiInfo();
    let currentNode = syntaxTree(context.state).resolveInner(context.pos, 0)
    let word = context.matchBefore(/\w*/);
    if (!word) {
        return null;
    }
    if (word.from == word.to) {
        return null;
    }
    if (!currentNode) {
        return null;
    }
    if (currentNode.name == "ArgList" || currentNode.parent?.name == "ArgList") {
        const inQuotes = currentNode.parent?.name == "ArgList";
        const argListNode = !inQuotes ? currentNode : currentNode.parent;
        
        if (!argListNode) {
            return null;
        }

        const variableNameNode = argListNode?.prevSibling
        const functionName = context.state.sliceDoc(variableNameNode?.from, variableNameNode?.to);
        const argPosition = getArgPosition(argListNode, context);
        return handleArgListCompletion(word, argPosition, functionName, inQuotes, patchVM);
    }
    return {
        from: word.from,
        options: Object.keys(apiInfo).map((key) => {
            const functionInfo = apiInfo[key];
            return {
                label: key,
                detail: `${key}(${functionInfo.parameters.join(", ")})`,
                apply: apply(key, patchVM),
            };
        })
    };
}

export default completions;