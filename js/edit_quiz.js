$(document).ready(function() {
    // 퀴즈 유형 선택
    $("input[name=quiz_type]").change(function() {
        let parent = $("#type_quiz");
        clearFileInput("quiz_img_dir");
        clearFileInput("answer_img_dir");
        parent.find('input[type=text], textarea').val("");

        if ($(this).val() === "objective") {
            $("#options").show();
            $("#answer_options").show();
        } else {
            parent.find('input[name=answer], input[name=add_option]').prop("checked", false);
            let lastOptionInput = $(".last_option_input");
            lastOptionInput.hide();
            lastOptionInput.prev('span').show();
            $("#options").hide();
            $("#answer_options").hide();
        }

        $(".type_quiz").children('textarea').each(function() {
            $(this).val("");

        });
    });

    // 퀴즈 이미지 추가
    $("input[type='file']").change(function(event) {
        let file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                let imgElement = $(event.target).parent('.img_input').next("img");
                imgElement.attr("src", e.target.result).show();
                $(event.target).parent('.img_input').parent('.image').css("height", "250px");
            }
            reader.readAsDataURL(file);  // 파일 데이터를 읽어 base64로 변환
        }
    });

    // 업로드된 이미지 크기 정보 가져오기
    $("img").on("load", function() {
        let imgLengthElement = $(this).siblings('.img_input').children(".img_length");
        let imgWidth = $(this).width();
        let imgHeight = $(this).height();

        imgLengthElement.find(".width").val(imgWidth);
        imgLengthElement.find(".height").val(imgHeight);
        imgLengthElement.find("#img_ratio").val(imgWidth / imgHeight);
        imgLengthElement.show();
    });

    // 이미지 크기 수정
    $(".img_length_input").on('propertychange change keyup paste input', function(e) {
        let imgRatio = $(this).siblings("#img_ratio").val();
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
        let lastOptionInput = $(".last_option_input");
        if ($(this).is(":checked")) {
            lastOptionInput.css("display", "flex");
            lastOptionInput.css("flex-direction", "row");
            lastOptionInput.prev('span').hide();
        } else {
            lastOptionInput.children('input[type=text]').val("");
            lastOptionInput.hide();
            lastOptionInput.prev('span').show();
        }
    });
});

// 이미지 파일 제거
function clearFileInput(inputName) {
    let fileInput = $(`input[name=${inputName}]`);
    fileInput.val("");
    fileInput.parent().next("img").attr("src", "").hide();
    fileInput.parent().parent().css("height", "35px");
    fileInput.siblings('.img_length').hide();
}

// 이미지 크기 변경
function resizeImage(id, width, height) {
    console.log("resizeImage called with width:", width, "height:", height);
    let imgElement = $(`${id}`).parent().parent().next("img");
    imgElement.css({
        width: width + "px",
        height: height + "px"
    });
}