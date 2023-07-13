import {insertCompletionText} from "@codemirror/autocomplete";

const apply = (text) => (view, completion, from, to) => {
    view.dispatch(insertCompletionText(view.state, text.value, from, to));
    console.log("From: ", from, "To: ", to);
    console.log(completion);
    view.dispatch({
        selection: {
          anchor: text.from,
          head: text.to,
        },
    });
}

const generateCompletionText = (key, functionInfo, pyatchVM) => {
    const { parameters, exampleParameters } = functionInfo;
    const args = parameters.map((param) => {
        const paramterOptions = exampleParameters[param];
        // Check if options is a list of strings
        if (Array.isArray(paramterOptions)) {
            return `'${paramterOptions[0]}'`;
        } else {
            return paramterOptions;
        }
    });
    const value = `${key}(${args.join(", ")})`;
    return {
        value,
        from: value.indexOf("(") + 1,
        to: value.indexOf(","),
    };
}


const completions = (patchPythonApiInfo, pyatchVM) => (context) => {
    let word = context.matchBefore(/\w*/);
    if (word.length>0)
        return {options:[{autoCloseBrackets: true}]};
    if (word.from == word.to)
        return null;
    return {
        from: word.from,
        options: Object.keys(patchPythonApiInfo).map((key) => {
            const functionInfo = patchPythonApiInfo[key];
            return {
                label: key,
                detail: `${key}(${functionInfo.parameters.join(", ")})`,
                apply: apply(generateCompletionText(key, functionInfo, pyatchVM)),
            };
        })
    };
}

export default completions;