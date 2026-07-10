let myCodeMirror; // CodeMirror 인스턴스를 전역 변수로 선언


$(document).ready(function() {
    // CodeMirror 초기화
    myCodeMirror  =  CodeMirror.fromTextArea ( document.getElementById("example_code"),  {
        lineNumbers :  true , // 줄 번호 표시
        matchBrackets :  true , // 괄호 자동 매칭
        styleActiveLine :  true , // 현재 줄 강조
        lineWrapping :  true, // 긴 줄 자동 줄바꿈
        mode :  "htmlmixed" , // HTML 모드 설정
        theme :  "mdn-like" , // 테마 설정 (원하는 테마로 변경 가능)
        indentUnit :  4 , // 들여쓰기 단위 설정
        tabSize :  4 , // 탭 크기 설정
    } ) ;

    // 수정 유형: 예제 코드 선택
    $("input[name=edit_type][value='code']").on('click', function() {
        let selectedType = $(this).val();

        if (selectedType === "code") {
            renderChapter();// 페이지 로드 시 초기 렌더링
            $("#type_category").hide();
            $("#type_code").show();
            $("#type_quiz").hide();
        }
    });
});

/* 목차 선택 변경 시 실행 함수 */
function selectChanged(idx) {
    $(`#chapterList${idx}`).nextAll().remove();
    let parentID = Number($(`#chapterList${idx} select option:selected`).val());
    renderChapter(idx + 1, parentID);
}

function getListHTML(idx) {
    let listHTML = `<li id="chapterList${idx}">
                            <select id="selecttitle${idx}" name="selecttitle${idx}" onchange="selectChanged(${idx})">
                                <option value="-1">직접 입력</option>
                            </select>
                            <input type="text" name="textboxTitle${idx}" placeholder="단원 제목">
                        </li>`;
    return listHTML;
}

function getOption(val, title) {
    let curOption = `<option value="${val}">${title}</option>`;
    return curOption
}


/* 목차 데이터 렌더링(화면에 뿌리기) */
function renderChapter(idx=0, parentID=0) {
    let preIdx = idx - 1;
    // 직접 입력 선택시 input박스만 보이게 하고 렌더링 종료
    if (parentID === -1) {
        $(`#chapterList${preIdx} input[name="textboxTitle${preIdx}"]`).show();
        return;
    } else {
        $(`#chapterList${preIdx} input[name="textboxTitle${preIdx}"]`).hide();
    }

    // 앞 단원의 하위 단원만 필터링해서 정렬
    let curTitleList  = chapterList.filter(item => item.parentID === parentID)
                                .sort((a, b) => b.nthChild - a.nthChild);

    // 하위 단원이 없는 경우 종료
    if (curTitleList.length === 0) {
        // 다음 하위 단원 및 현재 단원 삭제
        if (parentID === 0) {
            $(`#chapterList0 input[name="textboxTitle0"]`).show();
        }

        displayDeleteBtn();
        return;
    }

    let listHTML = getListHTML(idx);
    $(`#chapterUl`).append(listHTML);
    curTitleList.forEach(function(item) {
        let curOption = getOption(item.id, item.name);
        $(`#chapterList${idx} select`).prepend(curOption)
    });

    $(`#chapterList${idx} > select > option`).eq(0).prop("selected", true); // 첫번째 옵션 선택
    parentID = Number($(`#chapterList${idx} select option:selected`).val());  // 선택 옵션의 값

    renderChapter(idx + 1, parentID);
}

function displayDeleteBtn() {
    let lastSelectTag = $(`#chapterUl li`).last().children("select");
    let lastSelectedVal = Number(lastSelectTag.val());
    let lastSelectedItem = chapterList.filter(item => item.id === lastSelectedVal)[0];
    let protected = false;
    
    if (lastSelectedItem != undefined && lastSelectedItem.hasOwnProperty("protected")) {
        protected = lastSelectedItem.protected;
    }

    if (protected || ($("#chapterUl li").length === 1 && lastSelectTag.children("option").length === 1)) {
        $("#type_code #delete_input").hide();
    } else {
        $("#type_code #delete_input").show();
    }
}

// 소제목 추가
function addSubTitle() {
    let preChapterList = $(`#chapterUl li`).last();
    let selectedVal = Number(preChapterList.children("select").val());
    if (selectedVal === -1 && preChapterList.children("input").val().length === 0) {
        alert("상위 단원의 제목을 먼저 입력해 주세요.");
        return;
    }

    let idx = $("#chapterUl").children("li").length;
    let listHTML = getListHTML(idx);
    $("#chapterUl").append(listHTML);
    $("#type_code #delete_input").show();
}

// 소제목 제거
function deleteSubTitle() {
    let listTag = $(`#chapterUl>li`).last();
    let selectTag = listTag.children("select");
    let selectedId = Number(selectTag.val());
    let optionTag = selectTag.children("option:selected");

    let deleteItem = chapterList.filter(item => item.id === selectedId)[0];
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


/* 코드 입력 창 */
// CodeMirror 테마 변경
function changeTheme() {
    let selectedTheme = $("#theme_selector").val();
    myCodeMirror.setOption("theme", selectedTheme);
};

// 코드 실행
function runCode() {
    let code = myCodeMirror.getValue();
    $("#result").html(code);
    if (code.trim() === "") {
        $("#result").css("border", "none");
    } else {
        $("#result").css("border", "1px solid rgb(1, 11, 22)");
    }
}

// 코드 변환
function convertCode() {
    let code = myCodeMirror.getValue();
    let convertedCode;
    let codeInputArea = $("#type_code #example_code");
    if (codeInputArea.hasClass("html")) {
        // 문자 치환 순서 중요!
        convertedCode = code.replaceAll(/</g, "&lt;")
                            .replaceAll(/>/g, "&gt;")
                            .replaceAll(/(?:\r\n|\r|\n)/g, '<br>')
                            .replaceAll(/ /g, "&nbsp;")
        codeInputArea.removeClass("html");
    } else {
        // 문자 치환 순서 중요!
        convertedCode = code.replace(/<br>/g, "\n")
                            .replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")
                            .replace(/&nbsp;/g, " ");
        codeInputArea.addClass("html");
    }
    
    myCodeMirror.setValue(convertedCode);
}

