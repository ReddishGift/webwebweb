const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const script = require('./script.js');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'sunrin',
    port: 3306
});
db.connect();

app.use(bodyParser.urlencoded({ extended: false }));

// 홈 페이지 - 일기 목록 표시
app.get('/', (req, res) => {
    let calendar = '<div class="grid-container">';
    for (let i = 1; i <= 30; i++) {
        calendar += `<div class="grid-item"><a href="/diary/${i}">${i}</a></div>`;
    }
    calendar += '</div>';

    res.send(script.HTML('일기장', '', calendar, ''));
});

// 날짜 페이지 - 일기 내용 표시 및 CRUD 기능
app.get('/diary/:id', (req, res) => {
    const diaryId = req.params.id;
    // 해당 날짜의 일기 정보를 데이터베이스에서 조회
    db.query('SELECT * FROM diaries WHERE id = ?', [diaryId], (error, results) => {
        if (error) throw error;
        const diary = results[0];
        if (diary) {
            // 일기 내용이 존재하는 경우
            const diaryPage = `
                <p><strong>${diaryId}일</strong></p>
                <p><strong>제목:</strong> ${diary.name}</p>
                <p><strong>내용:</strong> ${diary.content}</p>
                <a href="/diary/${diaryId}/edit">수정</a>
                <a href="/diary/${diaryId}/delete">삭제</a>
            `;
            res.send(script.HTML('일기장임미다', '', diaryPage, ''));
        } else {
            // 일기 내용이 존재하지 않는 경우
            const createForm = `
                <h2>일기 추가</h2>
                <form action="/diary/${diaryId}/create" method="POST">
                    <label for="name">제목:</label>
                    <input type="text" id="name" name="name" required><br>
                    <label for="content">내용:</label>
                    <textarea id="content" name="content" required></textarea><br>
                    <button type="submit">추가</button>
                </form>
            `;
            res.send(script.HTML('일기장', '', createForm, ''));
        }
    });
});

// 일기 추가 기능
app.post('/diary/:id/create', (req, res) => {
    const diaryId = req.params.id;
    const name = req.body.name;
    const content = req.body.content;
    // 데이터베이스에 일기 정보 추가
    db.query('INSERT INTO diaries (id, name, content) VALUES (?, ?, ?)', [diaryId, name, content], (error, results) => {
        if (error) throw error;
        res.redirect(`/diary/${diaryId}`);
    });
});






// 일기 수정 페이지 라우팅
app.get('/diary/:id/edit', (req, res) => {
    const diaryId = req.params.id;
    // 해당 날짜의 일기 정보를 데이터베이스에서 조회
    db.query('SELECT * FROM diaries WHERE id = ?', [diaryId], (error, results) => {
        if (error) throw error;
        const diary = results[0];
        if (diary) {
            // 일기 내용이 존재하는 경우
            const editForm = `
                <h2>일기 수정</h2>
                <form action="/diary/${diaryId}/edit" method="POST">
                    <label for="name">이름:</label>
                    <input type="text" id="name" name="name" value="${diary.name}" required><br>
                    <label for="content">내용:</label>
                    <textarea id="content" name="content" required>${diary.content}</textarea><br>
                    <button type="submit">수정</button>
                </form>
            `;
            res.send(script.HTML('일기장', '', editForm, ''));
        } else {
            // 일기 내용이 존재하지 않는 경우
            res.send('일기 내용이 없습니다.');
        }
    });
});

// 일기 수정 기능
app.post('/diary/:id/edit', (req, res) => {
    const diaryId = req.params.id;
    const name = req.body.name;
    const content = req.body.content;
    // 데이터베이스에서 해당 일기 정보 수정
    db.query('UPDATE diaries SET name = ?, content = ? WHERE id = ?', [name, content, diaryId], (error, results) => {
        if (error) throw error;
        res.redirect(`/diary/${diaryId}`);
    });
});

// 일기 삭제 기능
app.get('/diary/:id/delete', (req, res) => {
    const diaryId = req.params.id;
    // 데이터베이스에서 해당 일기 정보 삭제
    db.query('DELETE FROM diaries WHERE id = ?', [diaryId], (error, results) => {
        if (error) throw error;
        res.redirect(`/diary/${diaryId}`);
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
