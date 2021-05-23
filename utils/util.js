
uniqueNameGenerator = (name, data, count) => {
    const suggestedNames = [ ];
    return new Promise((res, rej) => {
        while (suggestedNames.length !== count) {
            suggestedNames.push(generateUniqueName(data, suggestedNames, name));
        }
        res(suggestedNames)
    })
}

generateRandomCharacter = () => {
    return Math.floor(Math.random() * 100);
}

generateUniqueName = (data, suggestedNames, name) => {
    while (data.some(existedName => existedName.name === name) || suggestedNames.some(sugName => sugName === name)) {
        const randomChar = generateRandomCharacter();
        name = name + randomChar;
    }
    return name;
}

module.exports = uniqueNameGenerator

