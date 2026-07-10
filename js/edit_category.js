$(document).ready(function() {
    

    // 수정 유형: 목차 선택
    $("input[name=edit_type][value='category']").on('click', function() {
        let selectedType = $(this).val();

        if (selectedType === "category") {
            renderChapter2Category();
            $("#type_category").show();
            $("#type_code").hide();
            $("#type_quiz").hide();
        }
    });

    // 단원 정렬
    let sortableList = [];

    $("input[name='multiSelectSort']").on("change", function() {
        // 체크했을 때
        if ($(this).is(":checked")) {
            let sortFlag = true;
            // 수정 중이던 단원 완료 상태로 변경
            $("#type_category .chapter_group").each(function() {
                if (!sortFlag) {
                    return;
                }
                let btn = $(this).children("button").last()
                let inputs = $(this).children("input[type='text']");
                sortFlag = endEditChapter(btn, inputs)
            });

            if (!sortFlag) {
                $(this).prop("checked", false);
                return;
            }

            // 버튼 비활성화
            $("#type_category #chapterUL_0 button").prop("disabled", true);
            $("#type_category #chapterUL_0 button").hide();
            $(".sortable").css("cursor", "pointer");
            
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
                $(this).show()
                $(".sortable").css("cursor", "default");
            });
            $("#multiSelectSort > span > span").hide();  // 단원 재정렬 설명 숨기기
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

    // 단원 재정렬 아이콘 
    // title 설정(설명글)
    $("#type_category #multiSelectSort span, #type_category #multiSelectSort img").attr("title", "단원의 위치를 옮기고 싶을 때, 체크하세요.\n(옮길 단원을 드래그 앤 드롭하여 원하는 위치로 옮기세요.)\n\n[다양한 기능]\n-상위 목차를 옮기면 하위 항목도 함께 이동됩니다.\n-여러 행을 선택하여 한번에 옮길 수 있습니다.\n\n※주의\n반드시 선택한 행을 잡고 드래그 앤 드롭해 주세요.\n만약 선택한 행과 다른 행을 잡고 드래그 앤 드롭하면\n마지막에 잡은 행을 옮깁니다.\n\n상위 항목과 하위 항목을 동시에 선택하여 옮기면,\n상위 항목이 먼저 이동하고\n선택한 하위 항목은 상위 항목의 다음 항목으로 옮겨집니다.");
    // 정보 아이콘 클릭 시, alert 창으로 안내글 띄우기
    $("#type_category .info_icon").on("click", function() {
        let message = $(this).attr("title");
        alert(message);
    });

});


/* 단원 데이터 데이터 렌더링 */
let chapterList = window.chapterList || [];

function appendChapterHTML(item, type) {
    let listIcon_src = "/images/icon/right-arrow";
        let lockIcon_src = "/images/icon/lock";
        if (item.parentID === 0) {
            listIcon_src += "1.png";
        } else if ($(`#chapterUL_${item.parentID}`).parent("li").parent("ul").attr("id") === ("chapterUL_0")) {
            listIcon_src += "2.png";
        } else {
            listIcon_src += "3.png";
        }

        let lockState = "unlock"
        if (item.protected) {
            lockIcon_src += "0.png"
            lockState = "lock"
        } else {
            lockIcon_src += "2.png"

        }

    let chapterHTML = 
        `<li id="chapterList_${item.id}">
            <div class="chapter_group">
                <img src="${listIcon_src}" style="width: 13px; height: 13px; margin-right: 5px;" class="listIcon" alt="리스트 아이콘-오른쪽 삼각형" />
                <input type="text" class="chapter_title" name="chapter" value="${item.name}" placeholder="제목" disabled>
                <input type="text" class="chapter_page" name="chapter_page" value="${item.page}" placeholder="페이지" disabled>
                <input type="checkbox" class="deleteProtected"  name="lock" hidden>
                <img src="${lockIcon_src}" style="width: 15px; height: 15px; margin:0 20px 0 5px;" class="lockIcon ${lockState} cursor-pointer" title="현재 상태: 삭제 잠금 해제" onclick="changeProtected(${item.id})" alt="해당 리스트 잠금 설정 아이콘"/>
                <button class="btn blue small square" title="소제목 추가" onclick="addChapter(${item.id})">+</button>
                <button class="btn red small square" title="단원 제거" onclick="deleteChapter(${item.id})">-</button>
                <button class="btn orange small lectangle" title="수정" onclick="editChapter(${item.id})">${type}</button>
            </div>
            <ul id="chapterUL_${item.id}"></ul>
        </li>`

    $(`#chapterUL_${(item.parentID === undefined) ? 0 : item.parentID}`).append(chapterHTML);
    if (item.parentID != undefined) {
        let parentListIcon = $(`#chapterUL_${item.parentID}`).siblings(".chapter_group").children(".listIcon");
        if (!parentListIcon.hasClass("cursor-pointer")) {
            parentListIcon.addClass("cursor-pointer");
            parentListIcon.addClass("open");
            parentListIcon.attr("onclick", "toggleSubChapter(this)");
        }
    }
}

function changeProtected(id) {
    let imgTag = $(`#chapterList_${id}>.chapter_group>.lockIcon`);
    let inputTag = $(`#chapterList_${id}>.chapter_group>.deleteProtected`);
    
    if (imgTag.hasClass("unlock")) {
        inputTag.prop("checked", true)
        imgTag.attr("src", "/images/icon/lock0.png");
        imgTag.attr("title", "현재 상태: 삭제 잠금");
        imgTag.removeClass("unlock");
        imgTag.addClass("lock");
    } else {
        inputTag.prop("checked", false)
        imgTag.attr("src", "/images/icon/lock2.png");
        imgTag.attr("title", "현재 상태: 삭제 잠금 해제");
        imgTag.removeClass("lock");
        imgTag.addClass("unlock");
        
    }
}

function renderChapter2Category() {
    // 단원 목록 리스트 정리 쿼리 작성하기
    chapterNum = chapterList.length + 1;

    chapterList.forEach(function(item) {
        appendChapterHTML(item, "수정");
    });
}


/* 단원 추가 */
let chapterNum;
function addChapter(i) {
    if (i !== undefined) {
        let btn = $(`#chapterList_${i}>div>button`).last();
        let inputs = $(`#chapterList_${i}>div>input[type='text']`);
        if (btn.text() === "완료") {
            if (!endEditChapter(btn, inputs)) {
                return;
            }
        }          
    }
    
    let item = {"id": chapterNum, "parentID": i, "name":"", "page":"", "protected":false};
    appendChapterHTML(item, "완료");
    chapterNum++;
}

/* 단원 수정 버튼 클릭 시 실행
: 단원명, 페이지 input박스 활성, 비활성 */
function editChapter(i) {
    let btn = $(`#chapterList_${i}>div>button`).last();
    let inputs = $(`#chapterList_${i}>div>input[type='text']`);

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

/* 단원 수정 완료 버튼 클릭 시 실행 */
function endEditChapter(btn, inputs) {
    if ($(btn).text() === "수정" && $(inputs).is(":disabled")) {
        return true;
    } else if (btn.text() === "완료" && $(inputs).first().val() === "") {
        alert("단원명을 입력하세요.");
        return false;
    }

    $(inputs).each(function(idx, element) {
        $(this).prop("disabled", true); 
    });
    btn.text("수정");
    btn.attr("title", "수정");

    return true;
}

/* 단원 삭제 */
function deleteChapter(i) {
    let liElement = $(`#chapterList_${i}`);
    let parentUL = liElement.parent("ul");
    if ($(`#chapterUL_${i}`).children("li").length > 1) {
        if(!confirm("하위 리스트도 함께 제거됩니다.\n삭제하시겠습니까?")){
            return;
        }
    }

    liElement.remove();
    chapterNum--;

    if (parentUL.children("li").length === 0) {
        let parentListIcon = parentUL.siblings(".chapter_group").children("img");
        parentListIcon.removeClass("cursor-pointer").removeClass("open").removeClass("close");
        parentListIcon.removeAttr("onclick");
        parentListIcon.css("transform", "rotate(0deg)");
        parentListIcon.css("cursor", "default");
    }
}

// 토글 하위 단원
function toggleSubChapter(imgElement) {
    if ($(imgElement).hasClass("open")) {
        $(imgElement).prop("transform", "rotate(0deg)");
        $(imgElement).parent(".chapter_group").siblings("ul").hide();
        $(imgElement).removeClass("open").addClass("close");
    } else {
        $(imgElement).prop("transform", "rotate(90deg)");
        $(imgElement).parent(".chapter_group").siblings("ul").show();
        $(imgElement).removeClass("close").addClass("open");
    }
}