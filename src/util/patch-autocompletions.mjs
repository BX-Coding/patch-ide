import { insertCompletionText } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";

const apply = (key, functionInfo, pyatchVM) => (view, completion, from, to) => {
    const text = generateCompletionText(key, functionInfo, pyatchVM);
    view.dispatch(insertCompletionText(view.state, text.value, from, to));
    view.dispatch({
        selection: {
          anchor: from + text.from,
          head: from + text.to,
        },
    });
}

const generateCompletionText = (key, functionInfo, pyatchVM) => {
    const { parameters, exampleParameters } = functionInfo;
    const args = parameters.map((param) => {
        const paramterOptions = exampleParameters[param];
        let validParameter = paramterOptions;
        // Check if options is a list of strings
        if (Array.isArray(paramterOptions)) {
            validParameter = `'${paramterOptions[0]}'`;
        } else {
            const dynamicValues = getDynamicOptions(paramterOptions, pyatchVM);
            if (dynamicValues.length > 0) {
                validParameter = `'${dynamicValues[0]}'`;
            }
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

/** 
 * Reorders the provided options list based on a fuzzy match of the word
*/
const reorderOptions = (options, word) => {
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

const getDynamicOptions = (paramterOption, pyatchVM) => {
    let dynamicOptions = [];
    if (paramterOption === "TARGET_NAMES") {
        dynamicOptions = pyatchVM.getAllRenderedTargets().filter((target) => !target.isStage);
        dynamicOptions = dynamicOptions.map((target) => target.getName());
    } else if (paramterOption === "BACKDROP_NAMES") {
        dynamicOptions = pyatchVM.runtime.getTargetForStage().sprite.costumes.map((costume) => costume.name);
    } else if (paramterOption === "COSTUME_NAMES") {
        dynamicOptions = pyatchVM.editingTarget.sprite.costumes.map((costume) => costume.name);
    } else if (paramterOption === "SOUND_NAMES") {
        dynamicOptions = pyatchVM.editingTarget.getSounds().map((sound) => sound.name);
    } else if (paramterOption === "MESSAGE_NAMES") {
        dynamicOptions = pyatchVM.getAllBroadcastMessages();
    }
    return dynamicOptions;
}

const handleArgListCompletion = (word, argPosition, functionName, patchPythonApiInfo, inQuotes, pyatchVM) => {
    const functionInfo = patchPythonApiInfo[functionName];
    if (!functionInfo) {
        return null;
    }
    const { parameters, exampleParameters } = functionInfo;
    const arg = parameters[argPosition];
    if (!arg) {
        return null;
    }
    let paramterOptions = exampleParameters[arg];
    // Check if the parameters are dynamic
    if (!Array.isArray(paramterOptions)) {
        const dynamicOptions = getDynamicOptions(paramterOptions, pyatchVM);
        paramterOptions = dynamicOptions;
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

const getArgPosition = (argListNode, context) => {
    const pos = context.pos;
    const argListStart = argListNode.from;
    const argListText = context.state.sliceDoc(argListNode.from, argListNode.to);
    const argListTextBeforePos = argListText.slice(0, pos - argListStart);
    const argListTextBeforePosCommaCount = argListTextBeforePos.split(",").length - 1;
    const argPosition = argListTextBeforePosCommaCount;
    return argPosition;
}

const completions = (patchPythonApiInfo, pyatchVM) => (context) => {
    let currentNode = syntaxTree(context.state).resolveInner(context.pos, 0)
    let word = context.matchBefore(/\w*/);
    if (word.length>0)
        return {options:[{autoCloseBrackets: true}]};
    if (word.from == word.to)
        return null;
    if (currentNode?.name == "ArgList" || currentNode?.parent?.name == "ArgList") {
        const inQuotes = currentNode?.parent?.name == "ArgList";
        const argListNode = !inQuotes ? currentNode : currentNode?.parent;
        const variableNameNode = argListNode.prevSibling
        const functionName = context.state.sliceDoc(variableNameNode.from, variableNameNode.to);
        const argPosition = getArgPosition(argListNode, context);
        return handleArgListCompletion(word, argPosition, functionName, patchPythonApiInfo, inQuotes, pyatchVM);
    }
    return {
        from: word.from,
        options: Object.keys(patchPythonApiInfo).map((key) => {
            const functionInfo = patchPythonApiInfo[key];
            return {
                label: key,
                detail: `${key}(${functionInfo.parameters.join(", ")})`,
                apply: apply(key, functionInfo, pyatchVM),
            };
        })
    };
}

export default completions;