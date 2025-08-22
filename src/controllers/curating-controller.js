<<<<<<< HEAD
<<<<<<< HEAD
import { CurationService } from "../services/curating-service.js";
=======
>>>>>>> 5f659fc (Feature/khy (#9))
import { CurationService } from "../services/curating-service.js";
import { CurationService } from "../services/curating-service.js";

<<<<<<< HEAD
<<<<<<< HEAD
//객체 지향으로 만들어라는 요구사항 때문에 만들
=======
//객체 지향으로 만들어라는 요구사항 때문에 만들었는데 일단 . 만들었다 
>>>>>>> 8e816fa (first commit)
=======
//객체 지향으로 만들어라는 요구사항 때문에 만들
>>>>>>> fa487cd (Feature/khy (#9))
export class CurationController {
  constructor() {
    this.curationService = new CurationService();
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 58987fe (first commit)
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
<<<<<<< HEAD
<<<<<<< HEAD
        // 패스워드 암호화 부분 
=======
        // 패스워드 암호화 부분 (bcrypt 라이브러리 사용)
>>>>>>> 5f659fc (Feature/khy (#9))
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
        if(!passwordRegex.test(password)) {
            return res.json({ message: "*영문, 숫자 조합 8~16자리로 입력해주세요"});
=======
        // 패스워드 암호화 부분 (bcrypt 라이브러리 사용)
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
        if(!passwordRegex.test(password)) {
            return res.json({ message: "*영문, 숫자 조합 8~16자리로 입력해주세요"});
<<<<<<< HEAD
            // console.log('조건에 맞춰서 작성하라');
>>>>>>> 58987fe (first commit)
=======
>>>>>>> b41f66e (1)
        }
        
        const newCuration = await this.curationService.createCuration({
            styleId: parseStyleId,
            nickname,
            password,
            content,
            ...rating
        });
<<<<<<< HEAD
<<<<<<< HEAD
        const { password: _, ...curationResponse } = newCuration; // 클라이언트로 응답 시에 패스워드 필드는 제외하기 위해서 구조 분해 씀
=======
        const { password: _, ...curationResponse } = newCuration; // 클라이언트로 응답 시에 패스워드 필드는 제외하기 위해서 구조 분해 썻ㄷ.
>>>>>>> 58987fe (first commit)
=======
        const { password: _, ...curationResponse } = newCuration; // 클라이언트로 응답 시에 패스워드 필드는 제외하기 위해서 구조 분해 씀
>>>>>>> f5acbc3 (Feature/khy (#9))
        res.status(201).json(newCuration);
    } catch (error) {
        next(error);
    }
};

<<<<<<< HEAD
=======
>>>>>>> 50eaefa (edit controller (#10))
=======
>>>>>>> 8e816fa (first commit)
>>>>>>> 58987fe (first commit)
  // 큐레이션 목록 조회 (GET)
  getCurations = async (req, res, next) => {
<<<<<<< HEAD
<<<<<<< HEAD
  // 큐레이션 목록 조회 (GET)
  getCurations = async (req, res, next) => {
=======
>>>>>>> 5f659fc (Feature/khy (#9))
=======
  // 큐레이션 목록 조회 (GET)
  getCurations = async (req, res, next) => {
>>>>>>> f5acbc3 (Feature/khy (#9))
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

<<<<<<< HEAD
<<<<<<< HEAD
       // 결과가 없을 때도 통일된 구조로 응답
      res.status(200).json({
        status: 200,
        message: "큐레이션 조회 성공",
        data: results || {
=======
       if (!results) {
        return res.status(200).json({
>>>>>>> 6b1b4de (1)
          currentPage: parseInt(page) || 1,
          totalPages: 0,
          totalItemCount: 0,
          data: [],
<<<<<<< HEAD
        }
      });
    } catch (error) {
      next(error); 
    }
<<<<<<< HEAD
  };
}
=======
import { getCuration, postCuration, putCuration, deleteCuration, searchCurationsByKeyword } from "../services/curating-service.js";
=======
  }
<<<<<<< HEAD
<<<<<<< HEAD
}
>>>>>>> 5f659fc (Feature/khy (#9))
=======
>>>>>>> 50eaefa (edit controller (#10))
=======
>>>>>>> f5acbc3 (Feature/khy (#9))

  // 큐레이션 등록 (POST)
  postCurations = async (req, res, next) => {
    try { 
        const { styleId } = req.params;
        const { nickname, content, password, ...rating } = req.body;

        // 등록시 입력 오류 부분 
        if (!nickname || !content || !password) { //! 이 부분은 느낌표 뒤에 오는 값이 falsy이면 true로 실행이 되면서 falsy값을 모두 잡아줌. 그래서 null할당 x
            return res.status(400).json({ message: "필수 입력사항입니다" });
        }
        // 닉네임 수 20자 설정
        if (nickname.length > 20 ) {
            return res.json({ message: "20자 이내로 입력해 주세요"});
        }
        // 패스워드 암호화 부분 (bcrypt 라이브러리 사용)
        const passwordRegex = /^(?=.[a-zA-Z])(?=.[0-9]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.json({ message: "*영문, 숫자 조합 8~16자리로 입력해주세요"});
        } 

        const newCuration = await this.curationService.createCuration({
            styleId: parseInt(styleId, 10),
            nickname,
            password,
            content,
            ...rating
        });
        
        // password는 응답에서 제외
        const { password: _, ...curationResponse } = newCuration; // 클라이언트로 응답 시에 패스워드 필드는 제외하기 위해서 구조 분해 씀
      
        res.status(201).json({
          status: 201,
          message: "큐레이션 등록 성공",
          data: curationResponse
        });
      } catch (error) {
        next(error);
    }
};

  // 큐레이션 수정 (PUT)
  putCurations = async (req, res, next) => {
=======
}

export class CurationController {

  async putCurations(req, res, next) {
>>>>>>> fa487cd (Feature/khy (#9))
    try {
      const curationId = parseInt(req.params.curationId,10);
      const { password, nickname, content, trendy, personality, practicality, costEffectiveness } = req.body;

<<<<<<< HEAD
      // 등록시 입력 오류 부분 
      if (!nickname || !content || !password) { //! 이 부분은 느낌표 뒤에 오는 값이 falsy이면 true로 실행이 되면서 falsy값을 모두 잡아줌. 그래서 null할당 x
        return res.status(400).json({ message: "필수 입력사항입니다" });
        }
        // 닉네임 수 20자 설정
      if (nickname.length > 20 ) {
        return res.json({ message: "20자 이내로 입력해 주세요"});
        }
        // 패스워드 암호화 부분 (bcrypt 라이브러리 사용)
      const passwordRegex = /^(?=.[a-zA-Z])(?=.[0-9]).{8,16}$/;
      if (!passwordRegex.test(password)) {
        return res.json({ message: "*영문, 숫자 조합 8~16자리로 입력해주세요"});
        } 

      const updatedCuration = await this.curationService.updateCuration(curationId, {
        password,
        nickname,
        content,
        trendy,
        personality,
        practicality,
        costEffectiveness
    });

    const { password: _, ...curationResponse } = updatedCuration;

    res.status(200).json({
      status: 200,
      message: "큐레이션 수정 성공",
      data: curationResponse
    })
=======
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

>>>>>>> fa487cd (Feature/khy (#9))
  }  catch (error) {
      next (error);
  }
};

<<<<<<< HEAD
  // 큐레이션 삭제 (DELETE)
  deleteCurations = async (req, res, next) => {
    try {
      const curationId = parseInt(req.params.curationId, 10);
      const { password } = req.body;

      // 패스워드 암호화 부분 (bcrypt 라이브러리 사용)
      const passwordRegex = /^(?=.[a-zA-Z])(?=.[0-9]).{8,16}$/;
      if (!passwordRegex.test(password)) {
        return res.json({ message: "*영문, 숫자 조합 8~16자리로 입력해주세요"});
        } 

      const deletedCuration = await this.curationService.deleteCuration(curationId, password);

      res.status(200).json({
         status: 200,
         message: "큐레이션 삭제 성공",
         data: deletedCuration
     });

    } catch (error) {
      next (error)
  };
<<<<<<< HEAD
<<<<<<< HEAD
}
<<<<<<< HEAD

  async searchCurations(req, res, next) {
   try {
      const { keyword } = req.query; 
      const results = await searchCurationsByKeyword(keyword);

      res.status(200).json({
        message: "검색 성공!",
        data: results,
    });
  } catch (error) {
    next (error);
  }
}
};
>>>>>>> 81da860 (first (#8))
=======
}
>>>>>>> 5f659fc (Feature/khy (#9))
=======
}
}
>>>>>>> 50eaefa (edit controller (#10))
=======
=======
=======
        });
      }

>>>>>>> 6b1b4de (1)
      res.status(200).json(results);
    } catch (error) {
      next(error); 
    }
<<<<<<< HEAD
  };
>>>>>>> 8e816fa (first commit)
<<<<<<< HEAD
}
>>>>>>> 58987fe (first commit)
=======
=======
  }
>>>>>>> 6b1b4de (1)
<<<<<<< HEAD
}
>>>>>>> b41f66e (1)
=======
=======
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
>>>>>>> fa487cd (Feature/khy (#9))
}
>>>>>>> f5acbc3 (Feature/khy (#9))
