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
            renderChapter2Code();
            $("#type_category").hide();
            $("#type_code").show();
            $("#type_quiz").hide();
        }
    });

    $("#chapter_title").on("change", function() {
        let textbox = $("input[type='text'][name='chapter_title']");
        if ($(this).val() === "TypeIn") {
            $(textbox).show();
        } else {
            $(textbox).hide();
            $("#chapter_title").css("width", "fit-content");
        }
    })
});

/* 목차 데이터 렌더링 */
function renderChapter2Code(idx=0, rootID=0) {

    do {
        let deleteBtn = $("#type_code #delete_input");
        if (idx == 1 && deleteBtn) {

        }
        rootID = setChapterOptions(idx++, rootID);
    } while (rootID != -1);

    // let MainChapters = chapterList.filter(item => item.parentID === rootID);
    // if (MainChapters.length === 0) {
    //     return;
    // }
    // $("input[type='text'][name='chapter_title']").hide();
    // MainChapters.sort((a, b) => b.nthChild - a.nthChild);
    // MainChapters.forEach(function(item) {
    //     $("#type_code #chapter_title").prepend(`<option value="${item.id}" selected>${item.name}</option>`);
    // });
}

function setChapterOptions(i, rootID) {  // i: 현재 subTitle은 i번째 div, rootID: i번째 div에서 선택된 옵션 값
    let subTitles = chapterList.filter(item => item.parentID === rootID) || [];
    // console.log(i, rootID, subTitles.length);

    if (subTitles.length === 0) {
        return -1;
    }

    let titleDiv = $(`#type_code > div.chapter > div:eq(${i})`);
    if ($(titleDiv).length === 0) {
        let subtitle = `
        <div id="subTitle_${subTitleCnt}">&nbsp;/ 
            <select class="subTitle" name="subTitle_${subTitleCnt}" onchange="setInput(${subTitleCnt})">
                <option value="TypeIn" selected>직접 입력</option>
            </select>
            <input type="text" class="subTitle" name="subTitle_${subTitleCnt}" placeholder="소제목${subTitleCnt}" />
        </div>`.trim();
        $("#type_code #delete_input").before(subtitle);
        
        titleDiv = $(`#type_code > div.chapter > div:eq(${i})`);
    }
    $(titleDiv).children("input[type='text']").hide();
    subTitles.sort((a, b) => b.nthChild - a.nthChild);
    subTitles.forEach(function(item) {
        $(titleDiv).children(`select`).prepend(`<option value="${item.id}">${item.name}</option>`);
    });
    $(titleDiv).children("select").val(subTitles[subTitles.length - 1].id);
    subTitleCnt++;

    return parseInt($(titleDiv).children("select").val());
}


let maxSubTitleCnt = 3;

// 소제목 추가
let subTitleCnt = 1;
function addSubTitle() {
    let subtitle = `<div class="subTitle_group" id="subTitle_group${subTitleCnt}">
                        &nbsp;/ <select class="subTitle" name="subTitle${subTitleCnt}" onchange="setInput(${subTitleCnt})">
                            <option value="TypeIn" selected>직접 입력</option>
                        </select>
                        <input type="text" class="subTitle" name="subTitle${subTitleCnt}" placeholder="소제목${subTitleCnt}">
                    </div>`;

    if (subTitleCnt == 1) {
        $("#delete_input").show();
        $("#main_title").after(subtitle);
    } else if(subTitleCnt < maxSubTitleCnt) {
        $("#delete_input").before(subtitle);
    } else if (subTitleCnt == maxSubTitleCnt) {
        $("#add_input").hide();
        $("#delete_input").before(subtitle);
    }

    subTitleCnt++;
}

// 소제목 제거
function deleteSubTitle() {
    subTitleCnt--;

    $(`#subTitle_group${subTitleCnt}`).remove();

    if (subTitleCnt == 1) {
        $("#delete_input").hide();
    } else if (subTitleCnt == maxSubTitleCnt) {
        $("#add_input").show();
    }
}

// 소제목 직접 입력 선택 시
function setInput(i) {
    if ($(`select[name=subTitle${i}]`).val() === "TypeIn") {
        $(`input[name=subTitle${i}]`).hide();
    } else {
        $(`input[name=subTitle${i}]`).show();
    }
}

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
    let convertedCode = code.replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/\n/g, "<br>")
                            .replace(/ /g, "&nbsp;");
    myCodeMirror.setValue(convertedCode);
}

