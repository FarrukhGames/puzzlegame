app = {};

app.conf_card_w = 52;
app.conf_card_h = 52 * 300 / 271;
app.conf_card_offset_top = 130;
app.conf_card_offset_left = 7;
app.conf_card_incard_top_offset = 2.5;

app.puzz = [];
app.card_ids_list = [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
app.board = [];
app.board_limit = 8;

$(document).ready(function() {
    app.generateSampleLevel();
    app.cardStatus.recalculate();
    app.render.renderCards();
});

app.render = {};
app.render.renderCards = function() {
    $(".wr-cards .cards").html("");
    for(let level in app.puzz) {
        for(let y in app.puzz[level]) {
            for(let x in app.puzz[level][y]) {
                let elem = app.puzz[level][y][x];
                app.render.drawCardByData(level, y, x, elem.card_id, elem.status);
            }
        } 
    }
    return;
}

app.render.drawCardByData = function(level, y, x, card_id, status) {
    let top = y * app.conf_card_h / 2 - app.conf_card_incard_top_offset * y + app.conf_card_offset_top;
    let left = x * app.conf_card_w / 2 - app.conf_card_offset_left;
    level = parseInt(level);
    $(".wr-cards .cards").append(
        $("<div class='card'></div>")
        .css("top", top + "px")
        .css("left", left + "px")
        .css("z-index", 10 + level)
        .addClass("card-" + level + "-" + y + "-" + x)
        .addClass("c" + String(card_id).padStart(2, "0"))
        .attr("onclick", "app.clickCard(" + level + ", " + y + ", " + x + ")")
        .addClass((status == 1) ? "" : "disabled")
    );
    return;
}

app.render.redrawDisabledForAllCards = function() {
    for(let level in app.puzz) {
        for(let y in app.puzz[level]) {
            for(let x in app.puzz[level][y]) {
                let elem = app.puzz[level][y][x];
                let $card = $(".wr-cards .cards .card-" + level + "-" + y + "-" + x);
                $card.removeClass("disabled").addClass((elem.status == 1) ? "" : "disabled");
            }
        }
    }
}

app.clickCard = function(level, y, x) {
    level = parseInt(level);
    y = parseInt(y);
    x = parseInt(x);

    if (!(app.puzz && app.puzz[level] && app.puzz[level][y] && app.puzz[level][y][x] && app.puzz[level][y][x].status == 1)) {
        return false;
    }
    let $card = $(".wr-cards .cards .card-" + level + "-" + y + "-" + x);
    let result = app.boardAddCard(app.puzz[level][y][x].card_id, $card);
    if (result == false) {
        return false;
    }
    delete app.puzz[level][y][x];
    $card.removeClass(".card-" + level + "-" + y + "-" + x);
    app.cardStatus.recalculate();
    app.render.redrawDisabledForAllCards();
    return;
}

app.boardAddCard = function(card_id, $card) {
    if(app.board.length + 1 > app.board_limit) {
        app.gameOver();
        return false;
    }
    let slot_num = app.boardGetSlotForNewCard(card_id);
    if (slot_num == -1) {
        slot_num = app.board.length;
    } else {
        app.boardMoveAllCardsRightAfterNum(slot_num);
        slot_num++;
    }
    let in_slot_id = makeId(10);
    app.board[slot_num] = {
        card_id: card_id,
        "in_slot_id": in_slot_id
    }
    $card.addClass("inslot-" + in_slot_id);
    let $slot = $(".wr-cards .cards-board .slot" + slot_num);
    let offset = $slot.offset();
    $card.css("z-index", 1000 + slot_num);
    $card.animate({
        width: $slot.width(),
        height: $slot.height(),
        top: offset.top,
        left: offset.left
    }, 500, function() {
        app.boardCheckAndUpdate();
        $(this).addClass("completeInPanel");
    }); 
    return true;
}

app.getRandomCardId = function() {
    return app.card_ids_list[randomInteger(0, app.card_ids_list.length - 1)];
}

app.boardGetSlotForNewCard = function(card_id) {
    let slot_num = -1;
    for (let key in app.board) {
        if (!app.board[key]) {
            app.boardDeleteSpaceAndMoveLeft();
            return;
        }
        let current_card_id = app.board[key].card_id;
        if (card_id == current_card_id) {
            slot_num = key;
        }
    }
    return slot_num;
}

app.boardMoveAllCardsRightAfterNum = function(slot_num) {
    let board_len = app.board.length;
    for (let i = board_len - 1; i >= 0; i--) {
        let card = app.board[i];
        if (i > slot_num) {
            app.board[i + 1] = app.board[i];
            app.board[i] = false;
            let $card = $(".inslot-" + card.in_slot_id);
            app.boardMoveCardInBoard($card, i, i + 1);
        }
    }
}

app.boardMoveCardInBoard = function($card, from_slot, to_slot) {
    let $slot = $(".wr-cards .cards-board .slot" + to_slot); 
    let offset = $slot.offset();
    $card.css("z-index", 1000 + to_slot);
    $card.animate({
        width: $slot.width(),
        height: $slot.height(),
        top: offset.top,
        left: offset.left
    }, 300, function() {});
}

app.boardCheckAndUpdate = function() {
    let last_card_id = 0;
    let last_card_count = 0;
    for(let key in app.board) {
        let current_card_id = app.board[key].card_id;
        if (last_card_id == current_card_id) {
            last_card_count++;
        } else {
            last_card_id = current_card_id;
            last_card_count = 1;
        }
        if (last_card_count == 3) {
            app.boardDeleteCardsById(current_card_id);
            return;
        }
    }
}

app.boardDeleteCardsById = function(card_id) {
    let classes = [];
    for (let key in app.board) {
        let card = app.board[key];
        if (card.card_id == card_id && classes.length < 3) {
            classes.push(".inslot-" + card.in_slot_id + ".completeInPanel");
            delete app.board[key];
        }
    }
    classes = classes.join(", ");
    app.boardAnimateDeleteCardsByClasses(classes, 0);
}

app.boardAnimateDeleteCardsByClasses = function(classes, iteration_count) {
    iteration_count++;
    if (iteration_count > 20) {
        console.log("Error");
        return;
    }
    let len = $(classes).length;
    console.log("megalen: " + len);
    if (len != 3) {
        setTimeout(function() {
            app.boardAnimateDeleteCardsByClasses(classes, iteration_count);
        }, 200);
        return;
    }
    $(classes).css("background-size", "100%");
    $(classes).animate({
        backgroundSize: "20%"
    }, 400, function() {
        $(this).remove();
        setTimeout(function() {
            app.boardDeleteSpaceAndMoveLeft();
        }, 100);
    });
}

app.boardDeleteSpaceAndMoveLeft = function() {
    if (app.board[NaN]) {
        delete app.board[NaN];
    }
    let board_hes_empty = true;
    while (board_hes_empty) {
        board_hes_empty = false;
        let len = app.board.length;
        let hole_slot = -1;
        let puzz_slot = -1;
        for (let i = 0; i < len; i++) {
            let card = app.board[i];
            if (!card && hole_slot == -1) {
                board_hes_empty = true;
                hole_slot = i;
            } 
            if (card && hole_slot != -1) {
                puzz_slot = i;
                let $card = $(".inslot-" + card.in_slot_id);
                app.boardMoveCardInBoard($card, puzz_slot, hole_slot);
                app.board[hole_slot] = app.board[puzz_slot];
                delete app.board[puzz_slot];
                break;
            }
        }
        if (hole_slot != -1 && puzz_slot == -1) {
            app.board.splice(hole_slot, 1);
        }
    }
}

app.gameOver = function() {
    alert("Game Over, refresh for new game :)");
}