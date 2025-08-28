import {
  createStyleService,
  getStylesService,
  getStyleByIdService,
  updateStyleService,
  deleteStyleService
} from '../services/style-service.js';

class StyleController {
  async createStyle(req, res, next) {
    try {
      const newStyle = await createStyleService(req.body);
      res.status(201).json(newStyle);
    } catch (error) {
      next(error);
    }
  }

  async getStyles(req, res, next) {
    try {
      const { page, pageSize, sortBy, searchBy, keyword, tag } = req.query;
      const styles = await getStylesService(page, pageSize, sortBy, searchBy, keyword, tag);
      res.status(200).json(styles);
    } catch (error) {
      next(error);  
    }
  }

  async getStyleById(req, res, next) {
    try {
      const style = await getStyleByIdService(req.params.styleId);
      res.status(200).json(style);
    } catch (error) {
      next(error);
    }
  }

  async updateStyle(req, res, next) {
    try {
      const updatedStyle = await updateStyleService(req.params.styleId, req.body);
      res.status(200).json(updatedStyle);
    } catch (error) {
      next(error);
    }
  }

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
