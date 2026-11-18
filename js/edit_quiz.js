/* 퀴즈 유형 */
const QuizType = Object.freeze({
    OBJ: "Obj",  // 객관식
    SUBJ: "Subj",  // 주관식
    NONE: "None"  // 선택 없음
});

window.QUIZ_TYPE = QuizType.NONE;

const QuizDataType = Object.freeze({
    QUESTION: "question",  // 문제
    SOLUTION: "solution"  // 풀이
})

$(document).ready(function() {
    // 수정 유형: 퀴즈 선택
    // $(`input[name=edit_data_type][value='${EditDataType.QUIZ.NAME}']`).on('click', function() {
    //     // let cur_edit_data_type = $(this).val();

    //     // if (cur_edit_data_type === EditDataType.QUIZ.NAME) {
    //     window.EDIT_DATA_TYPE = EditDataType.QUIZ;
    //     $("#type_category").hide();
    //     $("#type_code").hide();
    //     $("#type_quiz").show();
    //     // }
    // });
    
    /* 랜더링 */
    appendQuizDiv();  // 퀴즈 내용 영역 추가
    // appendImgDiv();  // 이미지 경로 입력용 파일 태그 추가
    // appendAnsInput();  // 객관식 정답 선택지 추가

    // 퀴즈 유형 선택
    $("input[name=quiz_type]").on("click", function() {
        let quiz_type = $(this).val();
        clickQuizType(quiz_type);
    });

    // 퀴즈 이미지 추가
    $(`input[name="q_img_src"], input[name="sol_img_src"]`).change(function(event) {
        let file = event.target.files[0];
        // console.log(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    let w_h_ratio = img.width / img.height;
                    // console.log(w_h_ratio);
                    let imgHeight = 250;
                    let imgWidth = w_h_ratio * imgHeight;
                    let imgElement = $(event.target).parent('.img_input').next("img");
                    imgElement.attr("src", e.target.result).css({'display': '',
                                                                "height": `${imgHeight}px`,
                                                                "width": `${imgWidth}px`})
                                                            .show();
                    let img_length_input = $(event.target).siblings(".img_length");
                    img_length_input.find(".height").val(imgHeight);
                    img_length_input.find(".img_length_input.width").val(imgWidth);
                    img_length_input.find(`.img_ratio`).val(w_h_ratio);
                    img_length_input.show();
                };
                img.onerror = function() {
                    alert("이미지를 불러오는 중 오류가 발생했습니다.");
                };
                img.src = e.target.result;
            };

            reader.onerror = function() {
                alert("파일을 읽는 중 오류가 발생했습니다.");
            };

            reader.readAsDataURL(file);  // 파일 데이터를 읽어 base64로 변환
        }
    });

    // 이미지 크기 수정
    $(".img_length_input").on('propertychange change keyup paste input', function(e) {
        let imgRatio = Number($(this).siblings(".img_ratio").val());
        let settedLength = $(this).val();

        if ($(this).hasClass("width")) {
            let newHeight = settedLength / imgRatio;
            $(this).siblings(".height").val(newHeight);
        } else {
            let newWidth = settedLength * imgRatio;
            $(this).siblings(".width").val(newWidth);
        }
    })

    // 퀴즈 선택지 추가
    $("input[name=add_option]").change(function() {
        let checkStatus = $(this).is(":checked")
        addOption5(checkStatus);
    });

    
    
    
    $("#solution #obj_answer span").on("click", function() {
        let checkedIdx = $("#solution #obj_answer span").index(this);
        let preIdx = $("#solution #obj_answer input[type=radio]:checked").val() - 1;
        selectObjOption(preIdx, checkedIdx);
    });
});

// 선택지 추가 이벤트
function addOption5(checkStatus) {
    let lastOptionInput = $(".last_option_input");
    if (checkStatus) {
        lastOptionInput.show();
        $(`#obj_options input[name="obj_op5"]`).focus();
        lastOptionInput.prev('span').hide();
    } else {
        lastOptionInput.children('input[type=text]').val("");
        lastOptionInput.hide();
        lastOptionInput.prev('span').show();
    }
}


let unCheckedNums = ["①", "②", "③", "④", "⑤"];
let checkedNums = ["❶", "❷", "❸", "❹", "❺"];
// 퀴즈 정답 선택지 선택 이벤트
function selectObjOption(preIdx, checkedIdx=5) {
    console.log(preIdx, checkedIdx);
    let preElement = $("#solution #obj_answer span").eq(preIdx);
    let checkedElement = $("#solution #obj_answer span").eq(checkedIdx);

    if (checkedIdx != preIdx) {
        preElement.text(unCheckedNums[preIdx]);
        preElement.css("color", "#000");

        if (checkedIdx < 5) {
            checkedElement.prev("input[type=radio]").prop("checked", true);
            checkedElement.text(checkedNums[checkedIdx]);
            checkedElement.css("color", "#468aff");
        }
    }
}


// 퀴즈 유형 선택 이벤트 함수
function clickQuizType(quiz_type=QuizType.OBJ) {
    if (QUIZ_TYPE === quiz_type) {
        return;
    }

    if (quiz_type === QuizType.OBJ) {
        QUIZ_TYPE = QuizType.OBJ;
        $("#obj_quiz_content").show();  // 객관식 컨텐츠 영역 보이기
        $("#subj_quiz_content").hide();  // 주관식 컨텐츠 영역 숨기기
        // $("#obj_options").show();  // 선택지 입력란 보이기
        // $('#solution #obj_answer').show();  // 객관식 정답지 보이기
        // $('#solution #subj_answer').hide();  // 주관식 정답지 숨기기
    } else if (quiz_type === QuizType.SUBJ) {
        QUIZ_TYPE = QuizType.SUBJ;
        $("#obj_quiz_content").hide();  // 객관식 컨텐츠 영역 숨기기
        $("#subj_quiz_content").show();  // 주관식 컨텐츠 영역 보이기
        // $("#obj_options").hide();
        // $('#solution #obj_answer').hide();  // 객관식 정답지 숨기기
        // $('#solution #subj_answer').show();  // 주관식 정답지 보이기
    }
}
// 페이지 input 및 img 비우기
function resetContent() {
    let fixedImg = $("button img, #multiSelectSort img, #chapterUL_0 img");
    let fixedInput = $(`#type_code #chapterUl input[type="text"], #chapterUL_0 li`);
    let fixedChkboxNRadio = $('input[name="edit_data_type"], input[name="quiz_type"]');
    let edit_type = $(`input[name="edit_data_type"]:checked`).val();
    quizTypeDiv = "";

    if (edit_type === EditDataType.QUIZ.NAME) {
        if (QUIZ_TYPE === QuizType.OBJ) {
            quizTypeDiv = "#obj_quiz_content";
            let preSelectedRadio = $(`${EDIT_DATA_TYPE.DIV_ID}  #solution #obj_answer input[type=radio]:checked`);
            if (preSelectedRadio.length > 0) {
                let preIdx = preSelectedRadio.val() - 1;
                selectObjOption(preIdx);
            }

            let addOptionInput = $(`${EDIT_DATA_TYPE.DIV_ID} input[name="add_option"]:checked`);
            if (addOptionInput.length > 0) {
                addOption5(false);
            }
        } else {
            quizTypeDiv = "#subj_quiz_content";
        }
    }
    console.log(quizTypeDiv);
    $(`${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} img`).not(fixedImg).removeAttr("src").hide();
    $(`${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} input[type="text"], ${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} textarea, ${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} input[type="number"]`).not(fixedInput).val("");
    $(`${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} input[type="checkbox"], ${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} input[type="radio"]`).not(fixedChkboxNRadio).prop("checked", false);
    $(`${EDIT_DATA_TYPE.DIV_ID} ${quizTypeDiv} input[type="file"]`).each(function(index, element) {
        let clearBtn = $(element).next("button");
        clearFileInput(clearBtn);
    });
}

// 이미지 파일 제거
function clearFileInput(item) {
    let fileInput = $(item).prev('input[type="file"]');
    fileInput.val("");
    fileInput.parent().next("img").removeAttr("src").removeAttr("style").hide();
    fileInput.siblings('.img_length').hide();
}

// 이미지 크기 변경
function resizeImage(id, width, height) {
    let imgElement = $(`${id}`).parent().parent().next("img");
    imgElement.css({
        width: width + "px",
        height: height + "px"
    });
}

/* 렌더링 */
// 이미지 파일
function appendQuizDiv() {
    let quiz_types = ['obj', 'subj'];
    let answer_types = [['question', 'q', '퀴즈'], ['solution', 'sol', '풀이']];

    let ans_span = '<span>정답: </span>';

    quiz_types.forEach(function(q_type) {
        let quizDivHTML = `<div id='question'>
        </div>
        
        <hr>
        <div class='flex-column' id='solution'>
        </div>`;
        let answerDivHTML = "";

        $(`#${q_type}_quiz_content`).append(quizDivHTML);

        answer_types.forEach(function(ans_type) {
            let name = ans_type[0], short_name = ans_type[1], kor_name = ans_type[2];
            let qDivHTML = `<div class="image flex-column"><!-- 이미지 파일 추가 태그 입력할 부분 --></div>
            <textarea class="focus-event" name="${short_name}_text" placeholder="${kor_name} 내용을 입력해주세요."></textarea>`;
  
            $(`#${q_type}_quiz_content #${name}`).append(qDivHTML);

            let ImgDivHTML = `<div class="img_input flex-row">
                                    <span>이미지 삽입: </span>
                                    <input type="file" name="${short_name}_img_src" accept="image/*"/>
                                    <button class="btn red small square" title="이미지 제거" onclick="clearFileInput(this)">X</button>
                                    <div class="img_length flex-row">
                                        <span>이미지 크기: </span>
                                        <input type="number" min="0" class="img_length_input width" name="${short_name}_img_w" placeholder="너비"><span>px</span>
                                        <b>x</b>
                                        <input type="number" min="0" class="img_length_input height" name="${short_name}_img_h" placeholder="높이"><span>px</span>
                                        <input type="number" min="0" class="img_ratio" name="${short_name}_img_ratio" hidden/>
                                        <button class="btn green small square" id="resize_${short_name}_image" title="이미지 크기 변경" onclick="resizeImage('#resize_${short_name}_image', $(this).siblings('.width').val(), $(this).siblings('.height').val())">✔</button>
                                    </div>
                                </div>
                                <img id="${short_name}_img" src="" alt="퀴즈 사진">`;
            $(`${EditDataType.QUIZ.DIV_ID} #${q_type}_quiz_content #${name} .image`).append(ImgDivHTML);
        });

        if (q_type === 'obj') {
            let obj_options = `<div id="obj_options">
                <!-- 선택지 1 ~ 4번 들어갈 부분 -->
                <div class="last_option op_group flex-row">
                    <input type="checkbox" class="check_input" name="add_option" value="add_option"/><span class="checkInput_info left"> 선택지 추가</span> 
                    <!-- 선택지 5번 들어갈 부분 -->
                </div>
            </div>`;
            $(`#obj_quiz_content #question`).append(obj_options);

            answerDivHTML = `<div class="flex-row">
                ${ans_span}
                <div id="obj_answer" class="flex-row"><!-- 정답 선택지 1 ~ 5번 들어갈 부분 --></div>
            </div>`;
        } else {
            answerDivHTML = `${ans_span}
                <textarea id="subj_answer" class="focus-event" name="subj_answer" placeholder="정답을 입력해 주세요."></textarea>`;
        }

        $(`#${q_type}_quiz_content #solution`).prepend(answerDivHTML);

    });

    appendAnsInput();
}

// function appendImgDiv() {
//     quiz_area = (QUIZ_TYPE === QuizType.OBJ) ? "#obj_quiz_content" : "#subj_quiz_content";

//     let quiz_data_type = ["q", "sol"];
//     let quiz_type_id = ['#obj_quiz_content', '#subj_quiz_content'];
//     quiz_data_type.forEach(function(type, idx) {
//         let ImgDivHTML = `<div class="img_input flex-row">
//                                 <span>이미지 삽입: </span>
//                                 <input type="file" name="${type}_img_src" accept="image/*"/>
//                                 <button class="btn red small square" title="이미지 제거" onclick="clearFileInput(this)">X</button>
//                                 <div class="img_length flex-row">
//                                     <span>이미지 크기: </span>
//                                     <input type="number" min="0" class="img_length_input width" name="${type}_img_w" placeholder="너비"><span>px</span>
//                                     <b>x</b>
//                                     <input type="number" min="0" class="img_length_input height" name="${type}_img_h" placeholder="높이"><span>px</span>
//                                     <input type="number" min="0" class="img_ratio" name="${type}_img_ratio" hidden/>
//                                     <button class="btn green small square" id="resize_${type}_image" title="이미지 크기 변경" onclick="resizeImage('#resize_quiz_image', $(this).siblings('.width').val(), $(this).siblings('.height').val())">✔</button>
//                                 </div>
//                             </div>
//                             <img id="${type}_img" src="" alt="퀴즈 사진">`;
//         quiz_type_id.forEach(function(quiz_id) {
//             $(`${EditDataType.QUIZ.DIV_ID} ${quiz_id} .image`).eq(idx).append(ImgDivHTML);
//         });
        
//     });
// }

// 정답 선택지
function appendAnsInput() {
    let unCheckedNums = ["①", "②", "③", "④", "⑤"];

    unCheckedNums.forEach(function(opNum, idx) {
        let objAnsHTML = `<input type="radio" class="check_input" name="obj_answer" value="${idx+1}" hidden/><span class="checkInput_info left">${opNum}</span>`;
        $(`${EditDataType.QUIZ.DIV_ID} #obj_quiz_content #solution #obj_answer`).append(objAnsHTML);
    });

    for (let i=1; i <= 5; i++) {
        let className = (i < 5) ? "op_group" : "last_option_input";
        objOptionHTML = `<div class="${className} flex-row"><span>${i}. </span><input type="text" class="quiz_op focus-event" name="obj_op${i}" placeholder="선택지 ${i}"></div>`;

        if (i == 5) {
            $(`${EditDataType.QUIZ.DIV_ID} #obj_quiz_content #obj_options .last_option`).append(objOptionHTML);
        } else {
            $(`${EditDataType.QUIZ.DIV_ID} #obj_quiz_content #obj_options .last_option`).before(objOptionHTML);
        }
    }
    
    clickQuizType(QuizType.OBJ);  // 퀴즈 유형에 따라 컨텐츠 영역 보이기/숨기기
}