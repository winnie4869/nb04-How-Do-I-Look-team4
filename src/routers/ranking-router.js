import express from 'express';
import * as rankingController from '../controllers/ranking-controller.js';

// - 랭킹
//     - 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회할 수 있습니다.
//     - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수가 표시됩니다.
//     - 페이지네이션이 가능합니다.

// **Parameters**
// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `rankBy` : total | trendy | personality | practicality, costEffectiveness (랭킹 기준)


const router = express.Router();
router.get('/', rankingController.getRanking);


// {
//   "currentPage": 1,
//   "totalPages": 5,
//   "totalItemCount": 50,
//   "data": [
//     {
//       "id": 1,
//       "thumbnail": "string",
//       "nickname": "string",
//       "title": "string",
//       "tags": ["string", "string"],
//       "categories": {
// 				"top": {
// 					"name": "string",
// 					"brand": "string",
// 					"price": 0
// 				}
// 			},
//       "viewCount": 100,
//       "curationCount": 20,
// 			"createdAt": "2024-02-22T07:47:49.803Z",
// 			"ranking": 1,
// 			"rating": 3.7
//     },
//     {
//       "id": 2,
//       "thumbnail": "string",
//       "nickname": "string",
//       "title": "string",
//       "tags": ["string", "string"],
//       "categories": {
// 				"top": {
// 					"name": "string",
// 					"brand": "string",
// 					"price": 0
// 				}
// 			},
//       "viewCount": 100,
//       "curationCount": 20,
// 			"createdAt": "2024-02-22T07:47:49.803Z",
// 			"ranking": 2,
// 			"rating": 3.6
//     }
//   ]
// }

export default router;