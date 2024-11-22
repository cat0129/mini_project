// 필요한 모듈 로드
const express = require('express');
const cors = require('cors');
const path = require('path');
const oracledb = require('oracledb');
const session = require('express-session');

// Express 애플리케이션 생성
const app = express();
app.use(cors());
app.use(express.json());
// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.'));
// 세션 설정


// Oracle 데이터베이스 연결 설정
const config = {
  user: 'SYSTEM',
  password: 'test1234',
  connectString: 'localhost:1521/xe'
};

let connection;

// 데이터베이스 연결 설정
async function initializeDatabase() {
  try {
    connection = await oracledb.getConnection(config);
    console.log('Successfully connected to Oracle database');
  } catch (err) {
    console.error('Error connecting to Oracle database', err);
  }
}

initializeDatabase();

//회원가입
app.post('/signin', async(req, res)=>{
  var {id,pwd,name,birth,email,phone,gender} = req.body;
  var query = `insert into userInfo (id, pwd, name, birth, email, phone, gender) values ('${id}', '${pwd}', '${name}', '${birth}', '${email}', '${phone}', '${gender}')`;
  console.log(query);
  await connection.execute(query, [], {autoCommit:true});
  res.json({message:"저장되었습니다"});
});

//로그인
app.post('/login', async (req, res) => {
  var { id, pwd} = req.body;
  var query = `SELECT id, authority FROM userInfo WHERE id = '${id}' AND pwd = '${pwd}'`;
  var result = await connection.execute(query);
  const columnNames = result.metaData.map(column => column.name);
  // 쿼리 결과를 JSON 형태로 변환
  const rows = result.rows.map(row => {
    // 각 행의 데이터를 컬럼명에 맞게 매핑하여 JSON 객체로 변환
    const obj = {};
    columnNames.forEach((columnName, index) => {
      obj[columnName] = row[index];
    });
    return obj;
  });
  console.log(rows);
  res.json(rows);
});


// 게시판 조회 엔드포인트 
app.get('/list', async (req, res) => {
      const result = await connection.execute(`SELECT boardno, title, id, viewno FROM board order by boardno asc`);
      const columnNames = result.metaData.map(column => column.name);
    // 쿼리 결과를 JSON 형태로 변환
    const rows = result.rows.map(row => {
      // 각 행의 데이터를 컬럼명에 맞게 매핑하여 JSON 객체로 변환
      const obj = {};
      columnNames.forEach((columnName, index) => {
        obj[columnName] = row[index];
      });
      return obj;
    });
    res.json(rows);
  });
//게시판 내용 상세조회
app.get('/boarddetail', async (req, res) => {
    var {boardno} = req.query;
    var query = `select boardno, title, contents, id, viewno from board where BOARDNO=${boardno}`;
    const result = await connection.execute(query);
    const columnNames = result.metaData.map(column => column.name);

    const rows = result.rows.map(row=>{
      const obj = {};
      columnNames.forEach((columnName, index) => {
        obj[columnName] = row[index];
      });
      return obj;
    });
    console.log(rows);
    res.json(rows);
  });
//회원정보 조회
app.post('/userlist', async (req, res) => {
  var {id,pwd,name,birth,email,phone,gender, authority} = req.body;
 
      var query = `SELECT id, pwd, name, birth, email, phone, gender, authority FROM userInfo`;
      const result = await connection.execute(query, [], {autoCommit:true});
      console.log(query)
      res.json(result.rows.map(row => ({
          id: row[0],
          pwd: row[1],
          name: row[2],
          birth: row[3],
          email: row[4],
          phone: row[5],
          gender: row[6],
          authority: row[7]
      })))});  

//개인 (마이페이지) 정보 조회
app.post('/mypage', async(req,res)=>{

  var {id} = req.body;
  console.log("serverId: "+id);

  var query = `SELECT id, pwd, name, birth, email, phone, gender, authority FROM userInfo where id='${id}'`;
  console.log(query)
  var result = await connection.execute(query, [], {autoCommit:true});
  
  res.json(result.rows.map(row => ({
    id: row[0],
    pwd: row[1],
    name: row[2],
    birth: row[3],
    email: row[4],
    phone: row[5],
    gender: row[6],
    authority: row[7]
})))});

//회원정보 검색
app.post('/searchuser', async(req,res)=>{
  var {name} = req.body;
  var query = `SELECT id, pwd, name, birth, email, phone, gender, authority FROM userInfo WHERE name like '%${name}%'`;
  console.log(query);
  var result = await connection.execute(query,[],{autoCommit:true});

  res.json(result.rows.map(row => ({
    id: row[0],
    pwd: row[1],
    name: row[2],
    birth: row[3],
    email: row[4],
    phone: row[5],
    gender: row[6],
    authority: row[7]
})))});

//id 중복확인
app.get('/idcheck', async(req, res)=>{
  var {id} = req.query;
  var query = `select count(id) as CNT from userInfo where id= '${id}'`;
  var result = await connection.execute(query);
  const columnNames = result.metaData.map(column => column.name);
  const rows = result.rows.map(row => {
    const obj = {};
    columnNames.forEach((columnName, index) => {
      obj[columnName] = row[index];
    });
    return obj;
  });
  res.json(rows);
});

  
  //게시글 삭제
  app.get('/board-delete', async(req,res)=>{
    var {boardno} = req.query;
    var query = `delete from BOARD where BOARDNO=${boardno}`;
    console.log(query);
    await connection.execute(query, [], { autoCommit: true });
    res.json({message : "삭제되었습니다"});
});

//게시글 수정
app.post('/board-edit', async(req,res)=>{
  var {BOARDNO, TITLE, CONTENTS} = req.body;
  var query = `update board set title='${TITLE}', contents='${CONTENTS}' where boardno=${BOARDNO}`;
  console.log(query);
  await connection.execute(query, [], {autoCommit:true});
  res.json({message:"수정되었습니다"});
})

//게시글 작성
app.post('/write', async(req,res)=>{
  var { boardno, title, contents, id, viewno } = req.body;
  var query = `INSERT INTO board (boardno, title, contents, id, viewno) VALUES (board_seq.NEXTVAL, '${title}', '${contents}', '${id}', '${viewno}')`;
  console.log(query);
  await connection.execute(query, {}, { autoCommit: true });
  res.status(200).json({ message: '게시글이 작성되었습니다' });
})

//회원 삭제
app.post('/deleteuser', async(req,res)=>{
  var {id} = req.body;
  console.log(id)
  var query = `delete from userInfo where id='${id}'`;
  console.log(query);
  await connection.execute(query,[],{autoCommit:true});
  res.json({message:"삭제되었습니다"});
})

//회원정보수정
app.post('/updateuser', async(req,res)=>{
  var { id, pwd, name, birth, email, phone, gender, authority } = req.body;
  var query = `update userInfo set pwd='${pwd}', name = '${name}', birth = '${birth}', email = '${email}', phone = '${phone}', gender='${gender}', authority='${authority}' where id = '${id}'`;
  console.log(query);
  await connection.execute(query,{
  },{autoCommit:true});
  res.json({message:"수정되었습니다"});
})

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


