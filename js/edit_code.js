$(document).ready(function() {
    /* 코드 에디터 구현 */
    $('#code_editor textarea[name="input_code"]').on("input", function(e) {
        let value = $(this).val();
        let lines = value.split('\n').length;

        // 줄번호 입력
        $('#code_editor #line_numbers').html(Array(lines).fill(0).map((_, i) => `<span>${i + 1}</span>`).join('<br>'));

        
        let start = $(this).get(0).selectionStart;
        let end = $(this).get(0).selectionEnd;

        // 자동 들여쓰기
        if (value.charAt(start - 1) === "\n") {
            let prevLineStart = value.lastIndexOf('\n', start - 2) + 1;
            let prevLine = value.substring(prevLineStart, start);
                    
            if (prevLine.startsWith(" ")) {
                let indentSize = prevLine.match(/^\s*/)[0].length;
                let indent = " ".repeat(indentSize);
                $(this).val(value.substring(0, start) + indent + value.substring(end));
                $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + indent.length;
            }
        }
    });

    // 스크롤 동기화
    $('#code_editor textarea[name="input_code"]').scroll(function() {
        $('#code_editor #line_numbers').scrollTop($(this).scrollTop());
    });

    // Tab: 들여쓰기/ Shift+Tab: 내어쓰기 로직
    $('#code_editor textarea[name="input_code"]').keydown(function(e) {
        if (e.shiftKey && e.keyCode === 9) {  // keyCode: 13(Shift키), keyCode: 9(Tab키)
            // 내어쓰기
            e.preventDefault();  // 포커스 이동 막기
            let start = $(this).get(0).selectionStart;
            let end = $(this).get(0).selectionEnd;
            let value = $(this).val();
            let lineStart = value.lastIndexOf('\n', start - 1) + 1;

            // 내어쓰기 로직
            for (let i = 4; i > 0; i--) {
                if (value.substring(lineStart, lineStart + i) === ' '.repeat(i)) {
                    $(this).val(value.substring(0, lineStart) + value.substring(lineStart + i));
                    $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start - i;
                    break;
                }
            }
        } else if (e.keyCode === 9) {  // keyCode: 9(Tab키)
            // 들여쓰기
            e.preventDefault();  // 포커스 이동 막기
            let value = $(this).val();
            let start = $(this).get(0).selectionStart;
            let end = $(this).get(0).selectionEnd;
            let indent = " ".repeat(4);  // 들여쓰기: 공백 4칸
            
            $(this).val(value.substring(0, start) + indent + value.substring(end));
            $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + indent.length;
        }
    });

    // 코드 에디터 줄 번호 div 클릭 이벤트
    $('#code_editor #line_numbers').on("click", function() {
        $('#code_editor textarea[name="input_code"]').focus();
    });


    // focus 이벤트 처리
    $('#code_editor textarea[name="input_code"]').on("focus", function() {
        let div_lineNumbers = $("#code_editor #line_numbers");
        div_lineNumbers.css("background-color", "#d1e4ff");
        div_lineNumbers.css("color", "#0022b9");
        let code_result = $("#code_editor #code_result");
        code_result.css("border", "1px solid #7293ff");
    });
    // 포커스 해제 이벤트 처리
    $('#code_editor textarea[name="input_code"]').on("blur", function() {
        let div_lineNumbers = $("#code_editor #line_numbers");
        div_lineNumbers.css("background-color", "#f1f1f1");
        div_lineNumbers.css("color", "#848484")
        let code_result = $("#code_editor #code_result");
        code_result.css("border", "1px solid #868686");
    });
});

/* 목차 선택 변경 시 실행 함수 */
function selectChanged(idx) {
    $(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${idx}`).nextAll().remove();
    let parentID = Number($(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${idx} select option:selected`).val());
    renderChapterList(idx + 1, parentID);
}

function appendListHTML(idx) {
    let listHTML = `<li id="chapterList${idx}">
                        <select id="selecttitle${idx}" name="selecttitle${idx}" onchange="selectChanged(${idx})">
                            <option value="-1">직접 입력</option>
                        </select>
                        <input type="text" name="textboxTitle${idx}" class="focus-event" placeholder="단원 제목">
                    </li>`;
    $(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl`).append(listHTML);
}

function getOption(val, title) {
    let curOption = `<option value="${val}">${title}</option>`;
    return curOption
}


function displayDeleteBtn() {
    let lastSelectTag = $(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl li`).last().children("select");
    let lastSelectedVal = Number(lastSelectTag.val());
    let lastSelectedItem = EditDataType.CATEGORY.DATA.filter(item => item.id === lastSelectedVal)[0];
    let protected = false;
    
    if (lastSelectedItem != undefined && lastSelectedItem.hasOwnProperty("protected")) {
        protected = lastSelectedItem.protected;
    }

    if (protected || ($(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl li`).length === 1 && lastSelectTag.children("option").length === 1)) {
        $(`${EDIT_DATA_TYPE.DIV_ID} #delete_input`).hide();
    } else {
        $(`${EDIT_DATA_TYPE.DIV_ID} #delete_input`).show();
    }
}

// 소제목 추가
function addSubTitle() {
    let preChapterList = $(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl li`).last();
    let selectedVal = Number(preChapterList.children("select").val());
    if (selectedVal === -1 && preChapterList.children("input").val().length === 0) {
        alert("상위 단원의 제목을 먼저 입력해 주세요.");
        return;
    }

    let idx = $(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl`).children("li").length;
    appendListHTML(idx);
    $(`${EDIT_DATA_TYPE.DIV_ID} #delete_input`).show();
}

// 소제목 제거
function deleteSubTitle() {
    let listTag = $(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl li`).last();
    let selectTag = listTag.children("select");
    let selectedId = Number(selectTag.val());
    let optionTag = selectTag.children("option:selected");

    let deleteItem = EditDataType.CATEGORY.DATA.filter(item => item.id === selectedId)[0];
    if (deleteItem != undefined && deleteItem.protected) {
        alert("해당 단원은 삭제할 수 없습니다.");
        return;
    }

    let removeFlag = confirm(`'${optionTag.text()}'를 정말로 단원 목록에서 삭제하시겠습니까?`);
    if (removeFlag) {
        if (selectTag.children("option").length === 1) {
            listTag.remove();
        } else if (selectedId != -1) {
            optionTag.remove();
        }
    }

    displayDeleteBtn()
}

// // 코드 변환
// function convertCode() {
//     let code = $('#code_editor textarea[name="input_code"]');
//     let convertedCode;
//     let codeInputArea = $('#code_editor textarea[name="input_code"]');
//     if (codeInputArea.hasClass("html")) {
//         // 문자 치환 순서 중요!
//         convertedCode = code.val().replaceAll(/</g, "&lt;")
//                             .replaceAll(/>/g, "&gt;")
//                             .replaceAll(/(?:\r\n|\r|\n)/g, '<br>')
//                             .replaceAll(/ /g, "&nbsp;")
//         codeInputArea.removeClass("html");
//     } else {
//         // 문자 치환 순서 중요!
//         convertedCode = code.val().replace(/<br>/g, "\n")
//                             .replace(/&lt;/g, "<")
//                             .replace(/&gt;/g, ">")
//                             .replace(/&nbsp;/g, " ");
//         codeInputArea.addClass("html");
//     }
// }

// 코드 실행
function runCode() {
    let code = $('#code_editor textarea[name="input_code"]').val();
    // 사용자의 코드를 Blob으로 변환
    const blob = new Blob([code], { type: 'text/html' });
    const iframeUrl = URL.createObjectURL(blob);

    // iframe의 src로 설정
    $("#code_result").attr("src", iframeUrl);
    $('#code_editor textarea[name="input_code"]').focus();
}

function resetCode() {
    $('#code_editor textarea[name="input_code"]').val("");
    $("#code_result").attr("src", "");
    $('#code_editor #line_numbers').html("<span>1</span>")
    $('#code_editor textarea[name="input_code"]').focus();
}
