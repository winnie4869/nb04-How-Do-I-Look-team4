import { CurationService } from "../services/curating-service.js";

export class CurationController {
  constructor() {
    this.curationService = new CurationService();
  }

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
      res.status(200).json({
        status: 200,
        message: "큐레이션 조회 성공",
        data: results.data, 
          currentPage: results.currentPage,
          totalPages: results.totalPages,   
          totalItemCount: results.totalItemCount,
      });
    } catch (error) {
      next(error);
    }
  }

  postCurations = async (req, res, next) => {
    try {
      const { styleId } = req.params;
      const { nickname, content, password, ...rating } = req.body;

      if (!styleId || !nickname || !content || !password) {
        return res.status(400).json({ message: "필수 입력사항이 누락되었습니다." });
      }
      const newCuration = await this.curationService.postCuration({
        styleId: parseInt(styleId, 10),
        nickname,
        password,
        content,
        ...rating
      });

      const { password: _, ...curationResponse } = newCuration;

      res.status(201).json({
        status: 201,
        message: "큐레이션 등록 성공",
        data: curationResponse
      });
    } catch (error) {
      next(error);
    }
  };

  putCurations = async (req, res, next) => {
    try {
      const curationId = parseInt(req.params.curationId, 10);
      const { password, ...updateData } = req.body;

      if (!password || !updateData.content) {
        return res.status(400).json({ message: "비밀번호와 내용은 필수 입력사항입니다." });
      }

      const updatedCuration = await this.curationService.putCuration(curationId, password, updateData);

      const { password: _, ...curationResponse } = updatedCuration;

      res.status(200).json({
        status: 200,
        message: "큐레이션 수정 성공",
        data: curationResponse
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCurations = async (req, res, next) => {
    try {
      const curationId = parseInt(req.params.curationId, 10);
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "비밀번호는 필수 입력사항입니다." });
      }

      const deletedCuration = await this.curationService.deleteCuration(curationId, password);

      res.status(200).json({
        status: 200,
        message: deletedCuration.message,
      });

    } catch (error) {
      next(error);
    }
  }
}