
import {
  createStyleService,
  getStylesService,
  getStyleByIdService,
  updateStyleService,
  deleteStyleService
} from '../services/style-service.js';

class StyleController {
  /**
   * 새로운 스타일 게시글을 생성합니다.
   * POST /styles
   */
  async createStyle(req, res, next) {
    try {
      const newStyle = await createStyleService(req.body);
      res.status(201).json(newStyle);
    } catch (error) {
      // ZodError와 같은 에러는 next()를 통해 에러 핸들러로 전달
      next(error);
    }
  }

  /**
   * 스타일 목록을 조회합니다.
   * GET /styles
   */
  async getStyles(req, res, next) {
    try {
      const { page, pageSize, sortBy, searchBy, keyword, tag } = req.query;
      const styles = await getStylesService(page, pageSize, sortBy, searchBy, keyword, tag);
      res.status(200).json(styles);
    } catch (error) {
      next(error);  
    }
  }

  /**
   * 특정 스타일 게시글의 상세 정보를 조회합니다.
   * GET /styles/:styleId
   */
  async getStyleById(req, res, next) {
    try {
      const style = await getStyleByIdService(req.params.styleId);
      res.status(200).json(style);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 특정 스타일 게시글을 수정합니다.
   * PUT /styles/:styleId
   */
  async updateStyle(req, res, next) {
    try {
      const updatedStyle = await updateStyleService(req.params.styleId, req.body);
      res.status(200).json(updatedStyle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 특정 스타일 게시글을 삭제합니다.
   * DELETE /styles/:styleId
   */
  async deleteStyle(req, res, next) {
    try {
      const message = await deleteStyleService(req.params.styleId, req.body.password);
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  }
}

export default StyleController;
