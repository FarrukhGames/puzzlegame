app.generateSampleLevel = function() {
    cardsIds = [];
    for (let i = 0; i < 58; i++) {
        let rand_id = app.getRandomCardId();
        cardsIds.push(rand_id);
        cardsIds.push(rand_id);
        cardsIds.push(rand_id);
    }
    shuffle(cardsIds);
    app.puzz = [];
    let level = 0;
    app.puzz[level] = [];
    for (let y = 0; y < 8 * 2; y += 2) {
        if (!app.puzz[level][y]) {
            app.puzz[level][y] = [];
        }
        for (let x = 0; x < 8 * 2; x += 2) {
            app.puzz[level][y][x] = [];
            app.puzz[level][y][x] = {"card_id": cardsIds.pop()};
        }
    }
    level = 1;
    app.puzz[level] = [];
    for (let y = 1; y < 7 * 2 + 1; y += 2) {
        if (!app.puzz[level][y]) {
            app.puzz[level][y] = [];
        }
        for (let x = 1; x < 7 * 2 + 1; x += 2) {
            app.puzz[level][y][x] = [];
            app.puzz[level][y][x] = {"card_id": cardsIds.pop()};
        }
    }
    level = 2;
    app.puzz[level] = [];
    for (let y = 2; y < 6 * 2 + 2; y += 2) {
        if (!app.puzz[level][y]) {
            app.puzz[level][y] = [];
        }
        for (let x = 2; x < 6 * 2 + 2; x += 2) {
            app.puzz[level][y][x] = [];
            app.puzz[level][y][x] = {"card_id": cardsIds.pop()};
        }
    }
    level = 3;
    app.puzz[level] = [];
    for (let y = 3; y < 5 * 2 + 3; y += 2) {
        if (!app.puzz[level][y]) {
            app.puzz[level][y] = [];
        }
        for (let x = 3; x < 5 * 2 + 3; x += 2) {
            app.puzz[level][y][x] = [];
            app.puzz[level][y][x] = {"card_id": cardsIds.pop()};
        }
    }
    return;
}