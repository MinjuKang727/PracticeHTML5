# HTML5 실습 사이트 개발
> 방송대 전공 강의 HTML5의 개념 학습 및 코드 실습, 문제 풀이를 할 수 있는 페이지를 개발합니다.


---

## 개발 동기
```
방송대 컴퓨터과학과 전공 강의를 들으며 실습을 할 때,
강의를 들으며 따로 Visual Studio Code에서 코드를 따라 쓰며 실습을 했는데 실습 코드만 따로 모아서 한번에 연습할 수 있는 사이트가 있으면 좋겠다는 생각이 들었습니다.
그래서 올해 수강 중인 HTML5 교재의 코드를 실습할 수 있는 사이트를 만들어 보게 되었습니다.
```

---

## 개발 하고 싶은 기능
1. 교재의 예제 실습   
    1) 실습 예제 관련 개념 설명
    2) 실습 예제 코드 제시  
    3) 실습 예제 코드 따라 쓰기  
    4) 실습 예제 코드 실행  
        i) 작성한 코드 실행 결과 보기  
        ii) 작성한 코드 오류 잡기  
2. 교재의 연습 문제 풀이

---

## 개발 내용

### 실습 페이지 구성
<table>
    <tr>
        <td><img src="https://github.com/MinjuKang727/PracticeHTML5/blob/af090c4234b53a9c78083ffb92dbc0ec295ef55f/images/practice_page_design1.png" alt="실습 페이지 디자인" width="300px"></td>
        <td width="350px;">
            <ul>
                <li>구성
                    <ul>
                        <li>개념 설명</li>
                        <li>예제 코드</li>
                        <li>코드 작성 창</li>
                        <li>실행 결과 창</li>
                    </ul></li>
                <li>조건
                    <ol>
                        <li>가독성</li>
                    </ol>
                </li>
            </ul>
        </td>
    </tr>
</table>

---

#### 실습 페이지 1차 완성
<img src="https://github.com/MinjuKang727/PracticeHTML5/blob/af090c4234b53a9c78083ffb92dbc0ec295ef55f/images/20260330_practicePage_ver1.png" alt="실습페이지 1차 완성" width="800px">

- **트러블 슈팅**💥
    - [예제 코드에 raw code가 아닌 실행 결과가 보임](https://sequoia-carpet-385.notion.site/raw-code-396d82ce4856801fa0c0e75f7da939b8?source=copy_link)
    - [코드 입력창을 단순한 Textarea가 아니라 선도 그어져 있고 줄 번호도 보이게 해서 Code editor처럼 만들고 싶었음.](https://sequoia-carpet-385.notion.site/Textarea-Code-editor-396d82ce485680b2bd36f34e026cff35?source=copy_link)
    - [코드 입력창 자동 들여쓰기 구현하기](https://sequoia-carpet-385.notion.site/396d82ce485680aea6abc1d490ab1efd?source=copy_link)

---

#### [데이터 저장 구조 선택](https://sequoia-carpet-385.notion.site/396d82ce485680179580f31b61af68b5?source=copy_link)

---

#### [데이터 업로드 및 수정 페이지 1차 구성](https://sequoia-carpet-385.notion.site/1-396d82ce485680d19be8dabe05cc5a8a?source=copy_link)

