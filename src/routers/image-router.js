import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 업로드 폴더 경로 설정
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// uploads 폴더가 없으면 자동 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// 허용 파일 형식 필터
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('지원하지 않는 파일 형식입니다. 다른 파일을 넣어주세요'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// 이미지 업로드 라우트
router.post('/images', upload.single('image'), (req, res) => {
  console.log ('경로 진입');
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    }

    // 서버 주소 기반 URL 생성
    const imageUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    console.log ('업로드 성공:', imageUrl);
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error('이미지 업로드 오류:', error.message);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
