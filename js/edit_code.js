let jsonData = {}; // JSON 데이터 저장 변수
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
});

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