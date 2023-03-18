const db = require("../models");

class ApiFeatures {
  constructor({ Model, queryString, objFilter }) {
    this.Model = Model;
    this.queryString = queryString;
    this.objFilter = objFilter || {};
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(" ");

      this.objFilter = {
        ...this.objFilter,
        order: [sortBy],
      };

      this.sequelizeQuery = this.Model.findAll(this.objFilter);
    } else {
      this.objFilter = {
        ...this.objFilter,
        order: [["createdAt", "DESC"]],
      };

      this.sequelizeQuery = this.Model.findAll(this.objFilter);
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.objFilter = {
      ...this.objFilter,
      where: JSON.parse(queryStr),
    };

    this.sequelizeQuery = this.Model.findAll(this.objFilter);

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields
        .split(",")
        .map((el) => el.trim());

      this.objFilter = {
        ...this.objFilter,
        attributes: selectedFields,
      };
    }

    if (this.queryString.exclude) {
      const excluededFiedls = this.queryString.exclude
        .split(",")
        .map((el) => el.trim());

      if (this.objFilter.attributes) {
        excluededFiedls.push(...this.objFilter.attributes.exclude);
      }

      this.objFilter = {
        ...this.objFilter,
        attributes: {
          exclude: excluededFiedls,
        },
      };
    }

    this.sequelizeQuery = this.Model.findAll(this.objFilter);

    return this;
  }

  search(keys) {
    if (this.queryString.keyword) {
      let q = {};
      q = {
        [db.Sequelize.Op.or]: keys.map((key) => ({
          [key]: {
            [db.Sequelize.Op.like]: [`%${this.queryString.keyword}%`],
          },
        })),
      };

      if (this.objFilter.where) q = db.Sequelize.and(this.objFilter.where, q);

      this.objFilter = {
        ...this.objFilter,
        where: q,
      };

      this.sequelizeQuery = this.Model.findAll(this.objFilter);
    }
    return this;
  }

  pagination(total) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagonation Result
    const pagination = {};
    pagination.current_page = page;
    pagination.per_page = limit;
    pagination.total_pages = Math.ceil(total / limit);

    if (endIndex < total) {
      pagination.next_page = page + 1;
    }
    if (skip > 0) {
      pagination.prev_page = page - 1;
    }

    this.objFilter = {
      ...this.objFilter,
      limit,
      offset: skip,
    };

    this.sequelizeQuery = this.Model.findAll(this.objFilter);

    this.pagination = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
