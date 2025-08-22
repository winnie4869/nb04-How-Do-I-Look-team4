import { getCuration, postCuration, putCuration, deleteCuration, searchCurationsByKeyword } from "../services/curating-service.js";

export class CurationController {
  async getCurations(req, res, next) {
    try {
      const styleId = parseInt(req.params.styleId, 10);
      const page = parseInt(req.query.page) || 1;
      const pageSize = 10;
      const curationsData = await getCuration(styleId);
      const totalItemCount = curationsData.curations.length;
      const totalPages = Math.ceil(totalItemCount / pageSize);
      const curations = curationsData.curations.slice((page-1)*pageSize, page*pageSize);

    
      res.status(200).json({
        currentPage: page,
        totalPages,
        totalItemCount,
        data: curations.map((c) => ({
          id: c.id,
          nickname: c.nickname,
          content: c.content,
          trendy: c.trendy,
          personality: c.personality,
          practicality: c.practicality,
          costEffectiveness: c.costEffectiveness,
          createdAt: c.createdAt,
          comment: c.comment
            ? {
              id: c.comment.id,
              nickname: c.comment.nickname,
              content: c.comment.content,
              createdAt: c.comment.createdAt,
            }
          : {}, 
      })),
    });
  }   catch (error) {
      next(error);
  }
};

  async postCurations(req, res , next) {
    try {
      console.log("POST 요청 받음");
  
      const styleId = parseInt(req.params.styleId, 10);
      const postedCuration = await postCuration(styleId, req.body);

      console.log("DB 저장 성공:", postedCuration);

      res.status(200).json({
        	data: [ 
    {
      id: postedCuration.id,
      nickname: postedCuration.nickname,
      content: postedCuration.content,
      trendy: postedCuration.trendy,
      personality: postedCuration.personality,
      practicality: postedCuration.practicality,
      costEffectiveness: postedCuration.costEffectiveness,
      createdAt: postedCuration.createdAt,
      comment: postedCuration.comment
        ? {
            id: postedCuration.comment.id,
            nickname: postedCuration.comment.nickname,
            content: postedCuration.comment.content,
            createdAt: postedCuration.comment.createdAt
          }
        : {}
    }
  ].map(c => ({ ...c })) 
  });

}   catch (error) {
    next (error);
};
};


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