import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리 import

const router = express.Router();

// ES 모듈(`import/export` 구문) 환경에서 __dirname을 사용하기 위한 설정
// CommonJS(`require`)에서는 __dirname이 기본적으로 제공되지만, ES 모듈에서는 직접 정의해야 합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Multer 설정: 파일이 서버에 어떻게 저장될지 정의합니다.
const storage = multer.diskStorage({
  // destination: 파일을 저장할 디렉터리 경로를 설정합니다.
  destination: function (req, file, cb) {
    // 현재 라우터 파일의 상위 폴더(src)의 상위 폴더(프로젝트 루트)에 있는 'uploads' 폴더를 지정합니다.
    const uploadPath = path.join(__dirname, '..', 'uploads');
    
    // fs.existsSync: uploads 폴더가 이미 존재하는지 확인합니다.
    if (!fs.existsSync(uploadPath)) {
      // fs.mkdirSync: 폴더가 없으면 새로 생성합니다.
      fs.mkdirSync(uploadPath);
    }
    // cb(에러, 경로): 에러가 없으면 지정된 경로에 파일을 저장하도록 Multer에게 알립니다.
    cb(null, uploadPath);
  },
  
  // filename: 저장될 파일의 이름을 정의합니다.
  filename: function (req, file, cb) {
    // uuidv4()를 사용하여 고유한 파일명 생성 후 확장자 추가
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

// 2. multer 인스턴스 생성: 위에서 정의한 저장소 설정을 적용합니다.
const upload = multer({ storage: storage });

// 3. POST 요청 핸들러: '/images' 경로로 들어오는 POST 요청을 처리합니다.
// Multer 설정: 'images' 필드 대신 'image' 필드로 단일 파일만 처리하도록 변경합니다.
// 프론트엔드에서도 FormData.append('image', file) 형태로 보내야 합니다.
router.post('/images', upload.single('image'), (req, res) => {
  try {
    // req.file: 단일 파일 업로드 시 파일의 정보가 담겨있는 객체입니다. (req.files가 아님)
    if (!req.file) {
      // 파일이 하나도 업로드되지 않았을 경우 400 에러를 반환합니다.
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    // 업로드된 파일의 URL을 생성합니다.
    const imageUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    
    // imageUrl이라는 키로 단일 URL을 응답합니다.
    res.status(200).json({ imageUrl });
  } catch (error) {
    // 오류 발생 시 서버 오류를 응답합니다.
    console.error('이미지 업로드 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;