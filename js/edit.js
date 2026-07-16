/* 편집 유형 */
window.EditDataType = Object.freeze({
    CATEGORY: {
        NAME: "CATEGORY",
        PATH: "Data/Category.json", 
        DIV_ID: "#type_category",
        MESSAGE: "수정 페이지 - 목차 데이터",
        DATA: []
    },
    CODE: {
        NAME: "CODE",
        PATH: "Data/Code.json", 
        DIV_ID: "#type_code",
        MESSAGE: "수정 페이지 - 예제 코드 데이터",
        DATA: []
    },
    QUIZ: {
        NAME: "QUIZ",
        PATH: "Data/Quiz.json", 
        DIV_ID: "#type_quiz",
        MESSAGE: "수정 페이지 - 퀴즈 데이터",
        DATA: []
    }
});

window.EDIT_DATA_TYPE = EditDataType.CODE;

// /* 깃허브 AJAX 유형 */
// EditType = Object.freeze({
//     GET: {
//         METHOD: "GET"
//     },
//     POST: {
//         METHOD: "POST"
//     },
//     PUSH: {
//         METHOD: "PUSH"
//     }
// })

// GITHUB 관련 변수
let username = 'MinjuKang727';
let repo = 'PracticeHTML5';
let branch = 'EDIT_CATEGORY';
// let path = `data/data.json`;
// let GITHUB_URL = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
// let GITHUB_GET_URL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path}`;
// let GITHUB_GET_SHA_URL = `https://github.com/repos/${username}/${repo}/commits/${branch}`;
let SHA = '';

const URLType = Object.freeze({
    GITHUB_URL: `https://api.github.com/repos/${username}/${repo}/contents/`,
    GITHUB_GET_URL: `https://raw.githubusercontent.com/${username}/${repo}/${branch}/`,
    GITHUB_GET_SHA_URL: `https://github.com/repos/${username}/${repo}/commits/${branch}`,
    GITHUB_POST_URL: `https://api.github.com/repos/${username}/${repo}/`

});

function getURL(URL_TYPE, SAVE_PATH=EDIT_DATA_TYPE.PATH) {
    if (URL_TYPE === URLType.GITHUB_URL) {
        return `${URLType.GITHUB_URL}${SAVE_PATH}`;
    } else if (URL_TYPE === URLType.GITHUB_GET_URL) {
        return `${URLType.GITHUB_GET_URL}${SAVE_PATH}`;
    } else if (URL_TYPE === URLType.GITHUB_GET_SHA_URL) {
        return URLType.GITHUB_URL;
    } else if (URL_TYPE === URLType.GITHUB_POST_URL) {
        return `${URLType.GITHUB_POST_URL}${SAVE_PATH}`;
    }
}


$(document).ready(function() {
    /* 깃허브에서 데이터 가져오기 - 단원 목록, 예제 코드, 퀴즈*/
    $.each(EditDataType, function(key, value) {
        if (value.DATA.length === 0) {
            $.ajax({
                url: getURL(URLType.GITHUB_GET_URL, value.PATH),
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data && data.length > 0) {
                        // if (data.pushed_at) {
                        //     let pushedDate = new Date(data.pushed_at);
                        //     let timeStamp = pushedDate.getTime();
                        //     value.DATA.PUSHED_AT = timeStamp;
                        // }
                        
                        data.sort((a, b) => a.id - b.id); // ID 기준으로 정렬
                        value.DATA = data;
                        appendChapterDiv();
                        renderChapterList();// 페이지 로드 시 초기 렌더링
                    }
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 404) {
                        console.log("404 오류: json 파일이 존재하지 않습니다. 새 파일을 생성합니다.");
                        let json_data = JSON.stringify(value.DATA);
                        postJSON(json_data, EditDataType[key]);
                    } else if(xhr.status === 403) {
                        console.log("403 오류: 요청한 웹 리소스에 접근 권한이 없습니다.");
                    } else {
                        console.error("기타 오류 발생:", status, error);
                    }
                }
            });
        }
    });


    /* 버튼 클릭 효과 */
    let bgColor;
    let bottomColor;
    let bottomWidth;

    $("button").mousedown(function() {
        bgColor = $(this).css("background-color");
        bottomColor = $(this).css("border-bottom");
        bottomWidth = $(this).css('border-bottom-width');
        $(this).css("border-bottom", "none");
        $(this).css("margin-top", bottomWidth-1);
    }).mouseup(function() {
        $(this).css("border-bottom", bottomColor);   
        $(this).css("margin-top", "0");
    });

    /* 체크박스/라디오 버튼 옆 글자 선택 시, 체크 버튼 선택 */
    $(".checkInput_info").on("click", function() {
        let checkInput= $(this).prev(".check_input");
        $(checkInput).trigger("click");
    })


    /* 편집 유형 변경 이벤트 */
    $('input[name="edit_data_type"]').on("change", function() {
        let edit_data_type = $(this).val();
        let pre_edit_data_type = EDIT_DATA_TYPE.NAME;
        $.each(EditDataType, function(key, value) {
            if (value.NAME === edit_data_type) {
                EDIT_DATA_TYPE = EditDataType[key];
                resetContent();
                $(`${EDIT_DATA_TYPE.DIV_ID} li`).remove();
                renderChapterList();
                $(`${EDIT_DATA_TYPE.DIV_ID}`).show();
            } else if (value.NAME === pre_edit_data_type){
                $(`${value.DIV_ID}`).hide();
            }
        });
        if (EDIT_DATA_TYPE === EditDataType.CATEGORY) {
            $("#resetContent").hide();
            return;
        } else if (EDIT_DATA_TYPE === EditDataType.QUIZ) {
            $(`${EDIT_DATA_TYPE.DIV_ID} input[name="quiz_type"]`).eq(0).prop("checked", true);
            clickQuizType();
        }
        
        $("#resetContent").show();
        
    });
});

/* 목차 데이터 Div HTML에 추가 */
function appendChapterDiv() {
    if ($(`#chapterUl`).length === 2) {
        return;
    }

    let chapterDiv = `<ul id="chapterUl" class="flex-row">
                        </ul>
                        <button class="btn red small square" id="delete_input" onclick="deleteSubTitle()" title="최하위 부제목 제거">-</button>
                        <button class="btn blue small square" id="add_input" onclick="addSubTitle()" title="소제목 추가">+</button>`;

    let parentDivList = ['#type_code', '#type_quiz'];

    parentDivList.forEach(function(item) {
        let parentDiv = $(item).children(".chapter");
        parentDiv.append(chapterDiv);
    })
}


/* 목차 데이터 렌더링(화면에 뿌리기) */
function renderChapterList(idx=0, parentID=0) {
    if (EDIT_DATA_TYPE === EditDataType.CATEGORY && EDIT_DATA_TYPE.DATA.length != $(`${EDIT_DATA_TYPE.DIV_ID} #chapterUL_0 li`).length) {
        // 단원 목록 리스트 정리 쿼리 작성하기
        chapterNum = EditDataType.CATEGORY.DATA.length + 1;

        EditDataType.CATEGORY.DATA.forEach(function(item) {
            appendChapterHTML(item, "수정");
        });

        return;
    }
    
    let preIdx = idx - 1;
    // 직접 입력 선택시 input박스만 보이게 하고 렌더링 종료
    if (parentID === -1) {
        $(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${preIdx} input[name="textboxTitle${preIdx}"]`).show();
        return;
    } else {
        $(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${preIdx} input[name="textboxTitle${preIdx}"]`).hide();
    }

    // 앞 단원의 하위 단원만 필터링해서 정렬
    let curTitleList  = EditDataType.CATEGORY.DATA.filter(item => item.parentID === parentID)
                                .sort((a, b) => b.nthChild - a.nthChild);

    // 하위 단원이 없는 경우 종료
    if (curTitleList.length === 0) {
        // 다음 하위 단원 및 현재 단원 삭제
        if (parentID === 0) {
            appendListHTML(idx);
            $(`${EDIT_DATA_TYPE.DIV_ID} #chapterList0 input[name="textboxTitle0"]`).show();
        }

        displayDeleteBtn();
        return;
    }

    appendListHTML(idx);
    curTitleList.forEach(function(item) {
        let curOption = getOption(item.id, item.name);
        $(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${idx} select`).prepend(curOption)
    });

    $(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${idx} > select > option`).eq(0).prop("selected", true); // 첫번째 옵션 선택
    parentID = Number($(`${EDIT_DATA_TYPE.DIV_ID} #chapterList${idx} select option:selected`).val());  // 선택 옵션의 값

    renderChapterList(idx + 1, parentID);
}


// 데이터 저장
function saveContent() { 
    let pushDataList = checkData();

    pushDataList.forEach(function(data) {
        let edit_data_type = data.edit_data_type
        let json_data = JSON.stringify(data.data);
        putJSON(json_data, edit_data_type);
    });
};


/* 예제 코드 데이터 전처리 */
// 예제 코드가 속한 단원의 아이디 찾기
function findParentID(curChapter=$(`${EDIT_DATA_TYPE.DIV_ID} #chapterUl li`).last(), data=[]) {
    let thisID = Number(curChapter.children("select").val());

    if (thisID === -1) {
        thisID = EditDataType.CATEGORY.DATA[-1].id + data.length + 1;
        thisName = curChapter.children('input[type="text"]').val();

        let parentID = 0;
        let parentChapter = curChapter.prev("li");

        if (parentChapter.length > 0) {
            parentID = parentChapter.children("select").val();

            if (parentID === -1) {
                data = findParentID(parentChapter);
                parentID = data[-1].id;
            }
        }
        
        let thisNth = curChapter.children("select").children("option").length - 1;
        let thisPage = "";
        let thisProtected = false;
        let ChapterJSON = getJSON([thisID, parentID, thisNth, thisTitle, thisPage, thisProtected]);
        data.push(ChapterJSON);
        
        return data;  // Object 타입
    }

    return thisID;    // number 타입
}

// 입력값 유효성 검사
function checkData() {
    let continueFlag = true;
    let pushData = [];

    if (EDIT_DATA_TYPE === EditDataType.CATEGORY) {  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------- 수정 유형: 목차
        let sortCheckBox = $(`${EDIT_DATA_TYPE.DIV_ID} input[name="multiSelectSort"]`);
        if (sortCheckBox.is(":checked")) {
            alert("단원 재정렬 상태를 해제하고 저장 버튼을 클릭해 주세요.");
            sortCheckBox.focus();
            return !continueFlag;
        }

        let idMap = {};
        let dataList = [];
        let idCounter = 0; // 고유 ID를 위한 카운터

        $(`${EDIT_DATA_TYPE.DIV_ID} ul`).each(function() {
            let ori_ULID = $(this).attr("id").split("_")[1];  // 원래 아이디
            let parentID;
            if (idMap.hasOwnProperty(ori_ULID)) {
                parentID = idMap[ori_ULID];
            } else {
                idMap[ori_ULID] = idCounter++;
                parentID = idMap[ori_ULID]
            }

            $(this).children("li").each(function() {
                let ori_ListID = $(this).attr("id").split("_")[1];
                idMap[ori_ListID] = idCounter++;
                let thisID = idMap[ori_ListID];
                let thisNth = $(this).index();
                let thisTitle = $(this).children("div").children(".chapter_title").val();
                if (thisTitle.length === 0) {
                    alert("단원 제목은 필수 입력값 입니다.");
                    $(this).focus();
                    return !continueFlag;
                }
                let thisPage = $(this).children("div").children(".chapter_page").val();
                let thisProtected = $(this).children("div").children(".deleteProtected").is(":checked");
                let thisCategoryJSON = getJSON([thisID, parentID, thisNth, thisTitle, thisPage, thisProtected]);
                dataList.push(thisCategoryJSON);
            });
        });

        let data = {edit_data_type: EditDataType.CATEGORY, data: dataList};
        pushData.push(data);

    } else if (EDIT_DATA_TYPE === EditDataType.CODE) {  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------- 수정 유형: 예제 코드
        let pushData = [];
        let thisID = EditDataType.CODE.DATA.length;

        let parentData;
        let parentID = findParentID();
        console.log(typeof parentData, parentData);
        if (typeof parentData != "number") {
            parentData = parentID;
            parentID = parentData[-1].id;
            let data = {edit_data_type: EditDataType.CATEGORY, data: parentData};
            pushData.push(data);
        }

        let concept = $('#type_code textarea[name="ex_concept"]');
        let thisConcept = concept.val().trim();
        if (thisConcept.length === 0) {
            continueFlag = confirm("개념 설명란이 비어있습니다.\n이대로 계속 진행하시겠습니까?");
            if (!continueFlag) {
                concept.focus()
                return !continueFlag;
            }
        }

        let ex_num = $(`input[name="ex_num"]`);
        let thisNum = ex_num.val().trim();
        if (thisNum.length === 0) {
            alert("예제 번호를 입력해 주십시오.");
            ex_num.focus();
            return !continueFlag;
        }

        let ex_title = $(`input[name="ex_title"]`);
        let thisTitle = ex_title.val().trim();
        if (thisTitle.length === 0) {
            alert("예제 제목을 입력해 주십시오.");
            ex_title.focus();
            return !continueFlag;
        }

        let ex_code = $('#code_editor #input_code');
        let thisCode = ex_code.val().trim();
        if (thisCode.length === 0) {
            alert("예제 코드를 입력해 주십시오.");
            ex_code.focus();
            return !continueFlag;
        }
        let thisCodeJSON = getJSON([thisID, parentID, thisConcept, thisNum, thisTitle, thisCode]);
        let data = {edit_data_type: EditDataType.CODE, data: thisCodeJSON};
        pushData.push(data);

    } else if (EDIT_DATA_TYPE === EditDataType.QUIZ) {  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------- 수정 유형: 퀴즈
        let thisID = EditDataType.QUIZ.DATA.length;

        let parentData;
        let parentID = findParentID();
        if (typeof parentData != "number") {
            parentData = parentID;
            parentID = parentData[-1].id;
            let data = {edit_data_type: EditDataType.CATEGORY, data: parentData};
            pushData.push(data);
        }

        let quiz_type = $(`${EditDataType.QUIZ.DIV_ID} input[name="quiz_type"]`).val();
        let q_img_src = $(`${EditDataType.QUIZ.DIV_ID} #question .image #q_img`).attr("src");
        let q_text = $(`${EditDataType.QUIZ.DIV_ID} #question textarea[name="q_text"]`).val().trim();

        if (q_img_src.length === 0 && q_text.length === 0) {
            alert("퀴즈 문제를 입력해 주세요.");
            $(`${EditDataType.QUIZ.DIV_ID} #question textarea`).focus();
            return !continueFlag;
        }
        
        let solution_img = $(`${EditDataType.QUIZ.DIV_ID} #solution .image #sol_img`).attr("src");
        let solution_text = $(`${EditDataType.QUIZ.DIV_ID} #solution textarea[name="sol_text"]`).val().trim();

        if (quiz_type === QuizType.OBJ) {  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------- 퀴즈 유형: 객관식
            let obj_options = [];
            for (let i = 1; i <= 5; i++) {                
                if (i === 5 && !$(`${EditDataType.QUIZ.DIV_ID} input[name="add_option]`).is(":checked")) {
                    break;
                }
                
                let op_input = $(`${EditDataType.QUIZ.DIV_ID} input[name="obj_op${i}]`);
                let op_val = op_input.val();
                if (op_val.length === 0) {
                    let message = `선택지 ${i}번을 입력해 주세요.`;
                    if (i === 5) {
                        message = `선택지 ${i}번을 입력하시거나\n'선택지 추가' 체크박스를 해제해 주세요.`;
                    }
                    alert(message);
                    op_input.focus();
                    return !continueFlag;
                }

                obj_options.push(op_val);
            }

            let obj_answer = $(`${EditDataType.QUIZ.DIV_ID} input[name="obj_answer"]:checked`);
            let obj_answer_val = obj_answer.val();
            if (obj_answer === undefined) {
                alert("정답 번호를 선택해 주세요.");
                return !continueFlag;
            }
            
            let objQuizJSON = getJSON([thisID, parentID, quiz_type, q_img_src, q_text, obj_options, obj_answer_val, solution_img, solutions_text]);
            let data = {edit_data_type: EditDataType.CODE, data: objQuizJSON};
            pushData.push(data);
        } else if (quiz_type === QuizType.SUBJ) {  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------- 퀴즈 유형: 주관식
            let subj_answer = $(`${EditDataType.QUIZ.DIV_ID} textarea[name="q_text"]`);
            let subj_answer_val = subj_answer.val().trim();

            if (subj_answer_val.length === 0 && solution_img.length === 0) {
                alert("정답을 텍스트 혹은 이미지로 입력해 주세요.");
                subj_answer.focus();
                return !continueFlag;
            }

            let subjQuizJSON = getJSON([thisID, parentID, quiz_type, quiz_img_src, quiz_text, subj_answer_val, solution_img, solutions_text]);
            let data = {edit_data_type: EditDataType.CODE, data: subjQuizJSON};
            pushData.push(data);
        }     
    }

    return pushData;
}

/* 코드 변환 */
// HTML -> Text
function convertHTML2Text(html) {
    // 문자 치환 순서 중요!
    let resultText = code.val().replaceAll(/</g, "&lt;")
                            .replaceAll(/>/g, "&gt;")
                            .replaceAll(/(?:\r\n|\r|\n)/g, '<br>')
                            .replaceAll(/ /g, "&nbsp;")
    return resultText;
}

// Text -> HTML
function convertText2HTML(text) {
    // 문자 치환 순서 중요!
    let resultHTML = text.replace(/<br>/g, "\n")
                            .replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")
                            .replace(/&nbsp;/g, " ");
    return resultHTML;
}

/* JSON 데이터 반환 */
function getJSON(list_data) {
    let resultJSON = {};
    if (EDIT_DATA_TYPE === EditDataType.CATEGORY) {
        let [id, parentID, nthChild, name, page, protected] = list_data;
        resultJSON = {"id":id,"parentID":parentID,"nthChild":nthChild,"name":name,"page":page,"protected":protected};
    } else if (EDIT_DATA_TYPE === EditDataType.CODE) {
        let [id, parentID, concept, num, name, code] = list_data;
        resultJSON = {"id":id, "parentID":parentID, "concept": concept, "num":num, "name":name, "code":code};
    } else if (EDIT_DATA_TYPE === EditDataType.QUIZ) {
        if (QUIZ_TYPE === QuizType.OBJ) {
            let [id, parentID, quizType, q_img_src, q_text, q_options, answer, sol_img, sol_text] = list_data;
            resultJSON = {"id":id, "parentID":parentID, "quizType": quizType, "question": {"img": q_img_src, "text": q_text, "options": q_options}, "solution":{"answer": answer, "img": sol_img, "text": sol_text}};
        } else if (QUIZ_TYPE === QuizType.SUBJ) {
            let [id, parentID, quizType, q_img_src, q_text, answer, sol_img, sol_text] = list_data;
            resultJSON = {"id":id, "parentID":parentID, "quizType": quizType, "question": {"img": q_img_src, "text": q_text}, "solution":{"answer": answer, "img": sol_img, "text": sol_text}};
        }
    }

    return resultJSON;
}


function postJSON(json_data, edit_data_type=EDIT_DATA_TYPE) {
    let GITHUB_POST_URL = getURL(URLType.GITHUB_POST_URL, edit_data_type.PATH);
    let ACCESS_TOKEN = prompt("ACCESS_TOKEN 값을 입력하세요.", "");
    $.ajax({
    url: GITHUB_POST_URL,
    type: "POST",
    data: JSON.stringify(json_data), // JSON 문자열로 변환
    contentType: "application/json",
    headers: {
        "Authorization": `token ${ACCESS_TOKEN}`, // 인증 헤더
        "Accept": "application/vnd.github.v3+json"
    },
    success: function(response) {
        console.log("새 파일 생성 성공:", response);
    },
    error: function(xhr, status, error) {
        console.log("새 파일 생성 실패", status,"에러: ", error);
    }
});
}

// 깃허브에 데이터 push
function putJSON(json_data, edit_data_type=EDIT_DATA_TYPE) {
    let GITHUB_URL = getURL(URLType.GITHUB_URL, edit_data_type.PATH);
    
    // 최신 커밋 SHA 가져오기
    $.ajax({
        url: GITHUB_URL,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            SHA = response.sha;
            let ACCESS_TOKEN = prompt("ACCESS_TOKEN 값을 입력하세요.", "");
            let payload = {
                message: `[UPDATE] ${edit_data_type.MESSAGE}`,
                content: window.btoa(unescape(encodeURIComponent( json_data ))), // 데이터는 Base64로 인코딩
                branch: branch, // 저장할 브랜치
                sha: SHA // 업데이트할 파일의 SHA (파일이 이미 존재하는 경우 필요)
            };

            // 깃허브에 PUT 요청(저장)
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
            if (xhr.status === 404) {
                console.log("404 에러: 요청한 페이지를 찾을 수 없습니다. POST를 시도합니다.");
                postJSON(json_data, edit_data_type);
            }
        }
    });
}