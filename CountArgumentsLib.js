export default fnLenFactory;

function fnLenFactory() {
  const {extractArgs, valueParamsCleanup, cleanupFnStr} = regExps();
  const countArgumentsByBrackets = params => {
    let [commaCount, bracketCount, bOpen, bClose] = [0, 0, [...`([{`], [...`)]}`]];
    [...params].forEach( chr => {
      bracketCount += bOpen.includes(chr) ? 1 : bClose.includes(chr) ? -1 : 0;
      commaCount += chr === ',' && bracketCount === 1 ? 1 : 0; } );
    return commaCount + 1; };
  const extractArgumentsPartFromFunction = fn => {
    let fnStr = `${fn}`.replace(cleanupFnStr(fn.name), ``);
    fnStr = fnStr.match(extractArgs).shift().replace(/[\\]./g, ``).replace(valueParamsCleanup, ``);
    return !fnStr.startsWith(`(`) ? `(${fnStr})` : fnStr; };

  return (func, forTest = false) => {
    const params = extractArgumentsPartFromFunction(func);
    const nParams = params === `()` ? 0 : countArgumentsByBrackets(params);
    return forTest ? [`count from: <code>${params}</code>;`, nParams] : nParams;
  };

  function regExps() {
    return  {
      extractArgs: createRegExp`
          // Retriever arguments from a cleaned stringified function
          // ---
          ( ^[a-z_]( ?=(=>|=>{) ) ) // letter or underscore followed by fat arrow and/or curly opening bracket
          | ( ( (^\([^)].+\) )      // or anything between parenthesis
          | \(\) )                  // or parenthesis open + close
          ( ?=( =>|{ ) ) )          // followed by =>, =>{ or {
          ${'m::i'}                 // case insensitive`,
      valueParamsCleanup: createRegExp`
          // Cleanup arguments /w default string values
          // ---
          ( ?<=[\`"'] )    // everything prefixed with string delimiter
          ( [^\`,'"].+? )  // everything thereafter except starting delimiters *and comma* (non greedy)
          ( ?=[\`"'] )     // followed by starting string delimiter
          ${'m::g'}        // global`,
      cleanupFnStr: name => createRegExp`
          // For cleanup of a stringified [named] Function.
          // matches replaced with empty string will result in a string
          // without spaces and starting with the function parameters
          // ---
          \s          // space
          | function  // 'function'
          | ${name}   // the function name
          ${`m::g`}   // global`, };
  }

  function createRegExp(regexStr, ...args) {
    const strEmpty = new String();
    const flags = (args.length && args.slice(-1).shift() || strEmpty).startsWith(`m::`) ? args.pop().slice(3) : ``;
    const rawStr = regexStr.raw.reduce( (a, v, i ) => a.concat(`${v}`.concat(args[i] && args[i] || strEmpty) || strEmpty), ``);
      
    return new RegExp(
      rawStr
        .split(`\n`)
        .map( line => line.replace(/\s|\/\/.*$/g, ``).trim().replace(/@s/g, ` `) )
        .join(``), flags );
  }
}
