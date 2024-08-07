app.cardStatus = {};
app.cardStatus.recalculate = function() {
    app.cardStatus.setAllAllow();
    let level_keys = Object.keys(app.puzz);
    let lavel_keys = level_keys.reverse();
    for (let key in lavel_keys) {
        let level_key = lavel_keys[key];
        for (let y in app.puzz[level_key]) {
            for (let x in app.puzz[level_key][y]) {
                app.cardStatus.setDisabledByFilter(level_key, y, x);
            }
        }
    }
    return;
}

app.cardStatus.setAllAllow = function() {
    for (let level in app.puzz) {
        for (let y in app.puzz[level]) {
            for (let x in app.puzz[level][y]) {
                let past = (app.puzz[level][y][x].status) ?? 1;
                app.puzz[level][y][x].status = 1;
                app.puzz[level][y][x].past_status = past;
            }
        }
    }
    return;
}

app.cardStatus.setDisabledByFilter = function(level_below_this, input_y, input_x) {
    for (let level in app.puzz) {
        if (level < level_below_this) {      
            for (let y in app.puzz[level]) {
                for (let x in app.puzz[level][y]) {
                    y = parseInt(y);
                    x = parseInt(x);
                    input_y = parseInt(input_y);
                    input_x = parseInt(input_x);
                    if (
                        (x == input_x && y == input_y)
                        || (x == input_x - 1 && y == input_y)
                        || (x == input_x && y == input_y - 1)
                        || (x == input_x - 1 && y == input_y - 1)
                        || (x == input_x + 1 && y == input_y - 1)
                        || (x == input_x - 1 && y == input_y + 1)
                        || (x == input_x + 1 && y == input_y + 1)
                        || (x == input_x + 1 && y == input_y)
                        || (x == input_x && y == input_y + 1)
                    ) {
                        app.puzz[level][y][x].status = 0;
                    }
                }
            }
        }
    }
    return;
}