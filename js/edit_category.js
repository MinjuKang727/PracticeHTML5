$(document).ready(function() {
    // 리스트 드래그 앤 드롭으로 옮기기
    // $("#type_category ul").sortable({
    //     connectWith: "ul",
    //     items: "li",          // 하위 자손 li까지 모두 선택
    //     placeholder: "ui-state-highlight", // 자리 표시자
    //     tolerance: "pointer", // 마우스 포인터 기반으로 드래그
    //     cursor: "move"
    // }).disableSelection();

    let sortableList = [];

    // 단원 정렬
    $("input[name='multi_select']").on("change", function() {
        // 체크했을 때
        if ($(this).is(":checked")) {
            // 수정 중이던 단원 완료 상태로 변경
            $("#type_category .chapter_group").each(function() {
                let btn = $(this).children("button").last()
                let inputs = $(this).children("input[type='text']");
                endEditChapter(btn, inputs);
            });

            // 버튼 비활성화
            $("#type_category #chapterUL_0 button").prop("disabled", true);

            $("#multi_select > span > span").show();  // 정렬 설명 보이기
            
            // SortableJS 객체 생성
            $("#type_category ul").each(function() {
                let el = document.getElementById($(this).attr("id"));
                let thisSortable = Sortable.create(el, {
                    group: 'chapter',
                    multiDrag: true,
                    selectedCalss: 'sortable-selected',
                    avoidImplicitDeselect: false,  // 외부 클릭으로 선택 해제

                    onSelect: function(evt) {
                        evt.item
                    },
                    onDeselect: function(evt) {
                        evt.item
                    },
                    fallbackTolerance: 3,
                    animation: 150,
                    fallbackOnBody: true,
                    swapThreshold: 0.65
                });
                sortableList.push(thisSortable);
            });
        } else {  // 체크 해제 했을 때
            // 버튼 활성화
            $("#type_category #chapterUL_0 button").each(function() {
                $(this).prop("disabled", false);
            });
            $("#multi_select > span > span").hide();  // 단원 재정렬 설명 숨기기
            $(".sortable-selected").each(function(){
                $(this).removeClass("sortable-selected");
            })
            // SortableJS 객체 삭제
            sortableList.forEach(function(item) {
                item.destroy();
                sortableList = [];
            });
        }
    })
});

// function selectMoving(i) {
//     let checked = $("input[name='select_moving']:checked");
//     let ckCnt = $(checked).length;
//     let checkbox = $(`#chapterList_${i} > div > input[name='select_moving']`);
//     let items = "li";

//     if (ckCnt >= 3) {
//         alert("체크는 2개까지 할 수 있습니다.\n묶음으로 이동할 리스트의 '처음'과 '마지막' 리스트만 체크해 주세요.");
//         $(checkbox).prop("checked", false);
//     } else if (!$(checkbox).is(":checked")){
//         $("input[name='select_moving']").parent("div").css('background-color', '');
//         $(checked).parent("div").css('background-color', 'pink');
//     } else if (ckCnt === 2) {
//         let li = $("#type_category").find("li");
//         let start = $(checked).first().parent("div").parent("li");
//         let end = $(checked).last().parent("div").parent("li");
//         let startIndex = $(li).index($(start));
//         let endIndex = $(li).index($(end));
//         let range = $(li).slice(startIndex, endIndex + 1);
//         let rangeID = $(range).map(function() {
//             return this.id;
//         }).get();
//         items = `#${rangeID.join(", #")}`;
//         console.log(items);

//         $(range).children("div").css('background-color', 'pink');
//     } else {
//         $(checked).parent("div").css('background-color', 'pink');
//     }

//     // $(".sortable").sortable("option", "items", items);
// }


// 단원 추가
let chapterNum;
function addChapter(i) {
    let chapter = 
    `<li class="sortable" id="chapterList_${chapterNum}">
        <div class="chapter_group">
            <input type="text" class="chapter_title" name="chapter" placeholder="제목">
            <input type="text" class="chapter_page" name="chapter_page" placeholder="페이지">
            <button class="btn blue small square" title="소제목 추가" onclick="addChapter(${chapterNum})">+</button>
            <button class="btn red small square" title="단원 제거" onclick="deleteChapter(${chapterNum})">-</button>
            <button class="btn orange small lectangle" title="수정 완료" onclick="editChapter(${chapterNum})">완료</button>
        </div>
        <ul id="chapterUL_${chapterNum}"></ul>
    </li>`;

    if (i === undefined) {
        $("#chapterUL_0").append(chapter);
    } else {
        $(`#chapterUL_${i}`).append(chapter);
    }

    chapterNum++;
}

// 단원명, 페이지 input박스 활성, 비활성
function editChapter(i) {
    let btn = $(`#chapterList_${i}>div>button`).last();
    let inputs = $(`#chapterList_${i}`).children("div").children("input[type='text']");

    if ($(btn).text() === "수정") {
        $(inputs).each(function() {
            $(this).prop("disabled", false); 
        });
        btn.text("완료");
        btn.attr("title", "수정 완료");
    } else {
        endEditChapter(btn, inputs);
    }
}

function endEditChapter(btn, inputs) {
    if ($(btn).text() === "수정" && $(inputs).is(":disabled")) {
        return;
    }

    $(inputs).each(function(idx, element) {
        $(this).prop("disabled", true); 
    });
    btn.text("수정");
    btn.attr("title", "수정");
}

// 단원 삭제
function deleteChapter(i) {
    let liElement = $(`#chapterList_${i}`);
    if ($(`#chapterUL_${i}`).children("li").length > 1) {
        if(!confirm("하위 리스트도 함께 제거됩니다.\n삭제하시겠습니까?")){
            return;
        }
    }
    liElement.remove();
    chapterNum--;
}


/* 데이터 관련 */
// id 재할당
function setChapterId(){
    let idCounter = 0;
    $("#type_category").children("ul").each(function() {
        // 아직 더 입력해야함!!!!!!!
    });
};