$(document).ready(function() {
    // 버튼 클릭 효과
    let bgColor;
    let bottomColor;
    let bottomWidth;

    $("button").mousedown(function() {
        console.log("btn mousedown");
        bgColor = $(this).css("background-color");
        bottomColor = $(this).css("border-bottom");
        bottomWidth = $(this).css('border-bottom-width');
        // console.log("borderBottomWidth:",bottomWidth);
        // console.log("bgcolor:", bgColor, "bottomColor:", bottomColor, "bottomWidth:", bottomWidth);
        $(this).css("border-bottom", "none");
        $(this).css("margin-top", bottomWidth-1);
    }).mouseup(function() {
        $(this).css("border-bottom", bottomColor);   
        $(this).css("margin-top", "0");
    });


    // 수정 유형 선택
    $("input[name=edit_type]").on('click', function() {
        let selectedType = $(this).val();

        if (selectedType === "category") {
            getContent();
            $("#type_category").show();
            $("#type_code").hide();
            $("#type_quiz").hide();
        } else if (selectedType === "code") {
            $("#type_category").hide();
            $("#type_code").show();
            $("#type_quiz").hide();
        } else if (selectedType === "quiz") {
            $("#type_category").hide();
            $("#type_code").hide();
            $("#type_quiz").show();
        }
    });

    $(".check_input, .checkInput_info").on("click", function() {
        if ($(this).is(".checkInput_info")) {
            let checkInput;
            if ($(this).is(".left")) {
                checkInput = $(this).prev(".check_input");
            } else {
                checkInput = $(this).next(".check_input");
            }

            $(checkInput).trigger("click");
        }
    })
});



/** 데이터 관련 */

let jsonData = {}; // JSON 데이터 저장 변수

// JSON 데이터로 변환
function convertToJSON() {
    setChapterId();
    let thisType = $("input[name=edit_type]:checked").val();
    let idMap = {};
    if (thisType === "category") {
        let data = [];
        let idCounter = 0; // 고유 ID를 위한 카운터
        $("#type_category").find("ul").each(function() {  // type_category 하위의 모든 ul 태그 찾기
            // let parentId = parseInt($(this).attr("id").split("_")[1]);
            let parentId = idCounter++;
            idMap[$(this).attr("id").split("_")[1]] = parentId;

            $(this).children("li").each(function() {
                // let thisId = parseInt($(this).attr("id").split("_")[1]) - 1;
                let thisParentId = $(this).parent("ul").attr("id").split("_")[1];
                if (idMap.hasOwnProperty(thisParentId)) {
                    thisParentId = idMap[thisParentId];
                }
                let thisId = idCounter++;
                let thisNth = $(this).index();
                let thisTitle = $(this).children("div").children(".chapter_title").val();
                let thisPage = $(this).children("div").children(".chapter_page").val();
                let thisJson = {"id":thisId, "parentId": thisParentId, "nthChild": thisNth, "name": thisTitle, "page": thisPage};
                data.push(thisJson);
            });
            
            // 단원 제목과 페이지 정보 저장 로직 작성
        });
        return JSON.stringify(data);
        // 목차 데이터 변환 로직 작성
    } else if (thisType === "code") {
        // 예제 코드 데이터 변환 로직 작성
    } else if (thisType === "quiz") {
        // 퀴즈 데이터 변환 로직 작성
    }
};

// GITHUB 관련 변수
let username = 'MinjuKang727';
let repo = 'PracticeHTML5';
let branch = 'EDIT_CATEGORY';
let path = `data/data.json`;
let GITHUB_URL = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
let GITHUB_GET_URL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path}`;
let GITHUB_GET_SHA_URL = `https://github.com/repos/${username}/${repo}/commits/${branch}`;
let SHA = '';

// JSON 데이터 저장 (GitHub API 사용)
function saveContent() {
    // 최신 커밋 SHA 가져오기
    $.ajax({
        url: GITHUB_URL,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            SHA = response.sha;
            let ACCESS_TOKEN = prompt("ACCESS_TOKEN 값을 입력하세요.", "");
            jsonData = convertToJSON();  // JSON 데이터 저장 변수
            let payload = {
                message: "UPDATE 'practiceHTML5' JSON 데이터",
                content: window.btoa(unescape(encodeURIComponent( jsonData ))), // 데이터는 Base64로 인코딩
                branch: branch, // 저장할 브랜치
                sha: SHA // 업데이트할 파일의 SHA (파일이 이미 존재하는 경우 필요)
            };

            $.ajax({
                url: GITHUB_URL,
                method: 'PUT',
                contentType: 'application/json',
                headers: {
                    'Authorization': `token ${ACCESS_TOKEN}`
                },
                data: JSON.stringify(payload),
                success: function(response) {
                    console.log('Saved!', response);
                    alert("저장 완료!");
                },
                error: function(e) {
                    console.log("error:", e);
                    alert("저장 실패!");
                }
            });
        },
        error: function(xhr, status, error) {
            console.log("error:", error);
        }
    });
}

function getContent() {
    $.ajax({
        url: GITHUB_GET_URL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data && data.length > 0) {
                chapterNum = data.length + 1;
                // 단원 목록 리스트 정리 쿼리 작성하기
                data.sort((a, b) => a.id - b.id); // ID 기준으로 정렬
                data.forEach(item => {
                    // console.log("item:", item.id, item.parentId, item.name, item.page);
                    if (item.parentId != 0 && $(`#chapterList_${item.parentId}`).length === 0) {
                            item.parentId--;
                            // console.log("parentId: ", item.parentId);
                        }

                    // if ($(`#chapterUL_${item.parentId}`).length === 0) {
                        
                    //     $(`#chapterList_${item.parentId}`).append(`<ul id="chapterUL_${item.parentId}"></ul>`);
                    //     // console.log($(`#chapterList_${item.parentId}`).html());
                    // }
                    item.id++;
                    let chapter = 
                    `<li id="chapterList_${item.id}">
                        <div class="chapter_group">
                            <input type="text" class="chapter_title" name="chapter" value="${item.name}" placeholder="제목" disabled>
                            <input type="text" class="chapter_page" name="chapter_page" value="${item.page}" placeholder="페이지" disabled>
                            <button class="btn blue small square" title="소제목 추가" onclick="addChapter(${item.id})">+</button>
                            <button class="btn red small square" title="단원 제거" onclick="deleteChapter(${item.id})">-</button>
                            <button class="btn orange small lectangle" title="수정" onclick="editChapter(${item.id})">수정</button>
                        </div>
                        <ul id="chapterUL_${item.id}"></ul>
                    </li>`
                    $(`#chapterUL_${item.parentId}`).append(chapter);
                    // console.log($(`#chapterList_${item.parentId}`).html());
                });
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 404) {
                // console.log("404 오류: json 파일이 존재하지 않습니다. 새 파일을 생성합니다.");
            } else {
                // console.error("기타 오류 발생:", status, error);
            }
        }
    });
}