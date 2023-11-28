module.exports = {
    HTML: function (name, list, body, control) {
        return `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${name}</title>
                <style>
                    .grid-container {
                        display: grid;
                        grid-template-columns: repeat(7, 1fr);
                        grid-gap: 10px;
                        text-align: center;
                        height: 100vh; /* 컨테이너의 높이를 화면 높이로 설정 */
                        align-items: center; /* 수직 가운데 정렬 */
                        justify-items: center; /* 수평 가운데 정렬 */
                    }
                    
                    .grid-item {
                        border: 1px solid #ccc;
                        padding: 0;
                        width: 100px; /* 칸의 너비 */
                        height: 100px; /* 칸의 높이 */
                        box-sizing: border-box; /* 너비와 높이에 padding과 border를 포함 */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }                
                    
                                
                </style>
            </head>
            <body>
                <h1><a href="/">일기장입니다</a></h1>
                <!-- 메뉴 -->
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `;
    },
};
