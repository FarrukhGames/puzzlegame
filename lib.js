function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    while(currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function makeId(length) {
    let result = "";
    const characthers = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let counter = 0;
    while(counter < length) {
        result += characthers.charAt(Math.floor(Math.random() * characthers.length));
        counter++; 
    }
    return result;
}