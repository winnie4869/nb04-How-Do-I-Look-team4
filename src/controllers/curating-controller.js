import { CurationService } from "../services/curating-service.js";

//객체 지향으로 만들어라는 요구사항 때문에 만들
export class CurationController {
  constructor() {
    this.curationService = new CurationService();
  }

  // 큐레이션 등록 (POST) + 등록시 입력 오류 + 비번 암호화 포함
createCuration = async (req, res, next) => {
    try { 
        const { styleId } = req.params;
        const { nickname, content, password, ...rating } = req.body;
        const parseStyleId = parseInt(styleId);

        // 등록시 입력 오류 부분 
        if (!nickname || !content || !password) { //! 이 부분은 느낌표 뒤에 오는 값이 falsy이면 true로 실행이 되면서 falsy값을 모두 잡아줌. 그래서 null할당 x
            return res.status(400).json({ message: "*필수 입력사항입니다" });
        }
        // 닉네임 수 20자 설정
        if(nickname.length > 20 ) {
            return res.json({ message: "*20자 이내로 입력해 주세요"});
        }
        // 패스워드 암호화 부분 (bcrypt 라이브러리 사용)
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
        if(!passwordRegex.test(password)) {
            return res.json({ message: "*영문, 숫자 조합 8~16자리로 입력해주세요"});
        }
        
        const newCuration = await this.curationService.createCuration({
            styleId: parseStyleId,
            nickname,
            password,
            content,
            ...rating
        });
        const { password: _, ...curationResponse } = newCuration; // 클라이언트로 응답 시에 패스워드 필드는 제외하기 위해서 구조 분해 씀
        res.status(201).json(newCuration);
    } catch (error) {
        next(error);
    }
};

  // 큐레이션 목록 조회 (GET)
  getCurations = async (req, res, next) => {
    try {
      const { styleId } = req.params;
      const { page, pageSize, searchBy, keyword } = req.query;

      const results = await this.curationService.getCurations(
        parseInt(styleId),
        parseInt(page) || 1,
        parseInt(pageSize) || 10,
        searchBy,
        keyword
      );

       if (!results) {
        return res.status(200).json({
          currentPage: parseInt(page) || 1,
          totalPages: 0,
          totalItemCount: 0,
          data: [],
        });
      }

      res.status(200).json(results);
    } catch (error) {
      next(error); 
    }
  }
}

export class CurationController {

  async putCurations(req, res, next) {
    try {
      const curationId = parseInt(req.params.curationId,10);
      const { password, nickname, content, trendy, personality, practicality, costEffectiveness } = req.body;

     const updatedCuration = await putCuration(curationId, {
      password,
      nickname,
      content,
      trendy,
      personality,
      practicality,
      costEffectiveness
    });

    res.status(200).json({
      data: {
        id: updatedCuration.id,
        nickname: updatedCuration.nickname,
        content: updatedCuration.content,
        trendy: updatedCuration.trendy,
        personality: updatedCuration.personality,
        practicality: updatedCuration.practicality,
        costEffectiveness: updatedCuration.costEffectiveness,
        createdAt: updatedCuration.createdAt,
        comment: updatedCuration.comment || null  
      }
    });

  }  catch (error) {
      next (error);
  }
};

  async deleteCurations(req, res, next) {
    try {
     const curationId = parseInt(req.params.curationId, 10);
     const { password } = req.body;

      const deletedCuration = await deleteCuration(curationId, password);

     res.status(200).json({
       message: "큐레이팅 삭제 성공",
       data: deletedCuration
    });

  }  catch (error) {
      next (error)
  };
}