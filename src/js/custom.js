$(function() {

    var superContainer = $('#sortable'),
        questionHTML, optionHTML, oPl, qPl, json, q, sw,
        startString = 'var init = { "questions": [ ',
        endString = ']};',
        file = 'var init = {"questions":[{"question":"Start here...","answers":["This is editable and draggable too.","Click once to select the right option."],"correctAnswer":0}, {"question":"Try one more time...","answers":["This is editable and draggable too.","Click once to select the right option."],"correctAnswer":1}]};',
        optionTpl = '<li class="yyy"><div class="delete-answer">x</div><span class="jq-editable jqe">zzz</span></li>',
        questionTpl = '<li><div class="question-index"></div><div class="question-text jq-editable-textarea jqe" >zzz</div><a class="toggle" href="#">Toggle</a><a class="delete" href="#">Delete</a><a href="#" class="add-option">Add an option</a><ul class="answers">yyy</ul></li>',
        coreArray = [], finalPl;


    // Init editable plugin
    $(".jq-editable").eip('nonexistent.php', {
        edit_event: 'dblclick',
        select_text: true,
        savebutton_class: 'button green',
        cancelbutton_class: 'button red',
        editfield_class: 'editable-input'
    });
    $(".jq-editable-textarea").eip('nonexistent.php', {
        edit_event: 'dblclick',
        select_text: true,
        form_type: 'textarea',
        savebutton_class: 'button green',
        cancelbutton_class: 'button red',
        editfield_class: 'editable-input-textarea'
    });

    // Grab the nodes
    questionHTML = superContainer.children().clone(true, true);
    optionHTML = superContainer.find('.answers').eq(0).children('li').eq(1).clone(true, true);

    // Show/hide individual questions
    superContainer.on('click', '.toggle', function(e) {
        $(this).parent().find('.answers').slideToggle();
        return false;
    });

    // Delete those tap dancers!
    superContainer.on('click', '.delete', function(e) {
        var r = confirm("Are you sure? There's no undo!");
        if (r == true) {
            var temp = $(this).parent();
            temp.fadeOut(500, function() {
                temp.remove();
            });
            return false;
        }
    });
    superContainer.on('click', '.delete-answer', function(e) {
        var r = confirm("Are you sure? There's no undo!");
        if (r == true) {
            var temp = $(this).parent();
            temp.fadeOut(500, function() {
                temp.remove();
            });
            return false;
        }
    });

    // Show/hide our close button
    superContainer.on('mouseenter', '.answers li', function(e) {
        $(this).find(".delete-answer").stop(true, true).fadeIn();
    });
    superContainer.on('mouseleave', '.answers li', function(e) {
        $(this).find(".delete-answer").stop(true, true).fadeOut();
    });

    // Let's add questions and answers
    $("#add").click(function() {
        superContainer.append(questionHTML.clone(true, true));
        superContainer.find('.answers:last-child').sortable();
    });

    superContainer.on('click', '.add-option', function() {
        $(this).parent().find('.answers').append(optionHTML.clone(true, true));
    });

    // List-only checkbox behavior
    superContainer.on('click', '.answers li', function() {
        var thisLi = $(this);

        if (thisLi.hasClass('selected')) {
            thisLi.removeClass('selected');
        } else {
            thisLi.parents('.answers').children('li').removeClass('selected');
            thisLi.addClass('selected');
        }
    });

    // Init sortable
    superContainer.sortable();
    superContainer.find('.answers').eq(0).sortable();

    // Modals helper

    $(".close-m").click(function(e) {
        $(this).closest(".overlay").fadeOut();
        $("#fade").fadeOut();
    });

    // Import

    $(".trigger").click(function(e) {
        var t = $(this).data("modal-link");
        if (t=="o") {grabPayload(); $("#output-file").val(finalPl);}

        $("#file-"+$(this).data("modal-link")).fadeIn();
        $("#fade").fadeIn();
    });

    $("#imp-btn").click(function(e) {
        json = JSON.parse($("#input-file").val().replace(/var init\s*=\s*/g, "").slice(0, -1));
        q = json["questions"]; qPl = '';
        for (var i = 0; i< q.length; i++){
            oPl = '';
            for (var j = 0; j< q[i]["answers"].length; j++){
                sw = (q[i]["correctAnswer"]==j) ? "selected" : "";
                oPl += optionTpl.replace(/yyy/g, sw).replace(/zzz/g, q[i]["answers"][j]);
            }
            qPl += questionTpl.replace(/zzz/g, q[i]["question"]).replace(/yyy/g, oPl);
        }
        superContainer.html(qPl);
        superContainer.find('.answers').sortable();
        $("#fade, #file-i").fadeOut();
    });

    // Let's boogie

    $("#let-there-be-light").click(function(e) {
        grabPayload();
        $.generateFile({
            filename: 'quiz-' + Math.floor(Math.random() * 100000) + '.js',
            content: finalPl,
            script: 'download.php'
        });

        e.preventDefault();
    });

    function grabPayload () {
        coreArray = [];
        superContainer.children('li').each(function() {
            var tQuestion, tOptionsArray = [],
                tCorrectAnswer, thisInstance = $(this),
                tt;
            tQuestion = thisInstance.find('.question-text').html().replace(/"/g, "&apos;");
            tCorrectAnswer = parseInt(thisInstance.find('.selected').index(), 10);
            thisInstance.find('li .jq-editable').each(function() {
                tOptionsArray.push('"' + $(this).html().replace(/"/g, "&apos;") + '"');
            });
            tt = '{"question":"' + tQuestion + '","answers":[' + tOptionsArray.join() + '],"correctAnswer":"' + tCorrectAnswer + '"}';
            coreArray.push(tt);
        });
        finalPl = startString + coreArray.join() + endString;
    }

    $('#int-toggle').click(function() {
        $('#int').slideToggle();
    });

    guiders.createGuider({
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "We all love jQuizzy. Let's face it -- it's a beautifully engineered solution. The initialization process though has been reported to be clunky. This is where this tool steps in. <br /><br />Using this tool you can get set up very quickly. You don't need to muck around with code anymore. Every function is just a few clicks away.",
        id: "intro",
        next: "question",
        overlay: true,
        title: "Welcome to jQuizzy's Code Generator tool!"
    }).show();


    guiders.createGuider({
        attachTo: ".question-text",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "This is where you start. Just double click and start editing the question. You can choose to save the edit or discard it at the end.",
        id: "question",
        next: "options",
        overlay: true,
        position: 7,
        title: "Editing the Content"
    });

    guiders.createGuider({
        attachTo: ".answers ",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "These here are your answers. Notice that one of them is lit up? This is the correct answer. Click on an option to mark it as the correct answer.<br /><br >Like the question above, you can double click each option to edit its content.",
        id: "options",
        next: "optionsdd",
        position: 6,
        overlay: true,
        title: "Working with the Options"
    });

    guiders.createGuider({
        attachTo: ".answers ",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "You can also drag and drop each of these options to rearrange their order.",
        id: "optionsdd",
        next: "addopt",
        position: 5,
        overlay: true,
        title: "Reordering"
    });

    guiders.createGuider({
        attachTo: ".add-option",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "Click here to add an option to the current question. The option will be added to the bottom of the pile.",
        id: "addopt",
        next: "toggl",
        position: 5,
        overlay: true,
        title: "Adding an Option"
    });

    guiders.createGuider({
        attachTo: ".toggle",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "Managing a quiz with a large number of questions can be tough. Click here to 'minimize' the current question. Don't worry, you'll still be able to see the question itself.",
        id: "toggl",
        next: "del",
        position: 5,
        overlay: true,
        title: "Toggling a Question"
    });

    guiders.createGuider({
        attachTo: ".delete",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "As expected, this here deletes the current question. There is no undo so be careful!",
        id: "del",
        next: "delopt",
        position: 5,
        overlay: true,
        title: "Deleting the Current Question"
    });

    guiders.createGuider({
        attachTo: ".answers ",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "I almost forgot! You can delete each individual option by hovering over it and clicking on the tiny 'x' button that appears. Nifty, right?",
        id: "delopt",
        next: "questions",
        position: 6,
        overlay: true,
        title: "Deleting an Option"
    });

    guiders.createGuider({
        attachTo: "#add",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "You can add a question to the quiz by clicking this button here.",
        id: "questions",
        next: "qdd",
        position: 3,
        overlay: true,
        title: "Adding a Question"
    });

    guiders.createGuider({
        attachTo: ".answers",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "Once a question has been added, you can merely drag and drog to change the order in which the questions are presented.",
        id: "qdd",
        next: "ltbl",
        position: 6,
        overlay: true,
        title: "Drag and Drop. For Great Justice!"
    });

    guiders.createGuider({
        attachTo: "#let-there-be-light",
        buttons: [{
            name: "Close"
        }, {
            name: "Next"
        }],
        description: "When you're happy with the quiz set up, click this shiny little button to get your generated JS file. A window should pop up asking you to save the file. Don't be a hipster -- save it.",
        id: "ltbl",
        next: "viewer",
        position: 3,
        overlay: true,
        title: "End of the Road"
    });

     guiders.createGuider({
         attachTo: "#view-code",
         buttons: [{
         name: "Close"
         }, {
         name: "Next"
         }],
         description: "Or use this button to get a modal window with your JavaScript code. Simply copy and paste it into a new JavaScript file. Voila!",
         id: "viewer",
         next: "importe",
         position: 3,
         overlay: true,
         title: "End of the Road"
     });

     guiders.createGuider({
     attachTo: "#importer",
     buttons: [{
     name: "Close"
     }, {
     name: "Next"
     }],
     description: "If you have a previous quiz that you'd like to import, click this button and paste the entire file into the popup that appears.",
     id: "importe",
     next: "last",
     position: 3,
     overlay: true,
     title: "Quiz importing"
     });

    guiders.createGuider({
        buttons: [{
            name: "Close"
        }],
        description: "So that's about all there is to it. Let me know if you see any issues. <br /><br /><strong>Known issues:</strong><br />Try to have one element open to edit at a time. The plugin is wonky that way. ",
        id: "last",
        overlay: true,
        next: "question",
        title: "That's a Wrap, Gentlemen. And Lady. "
    });
});