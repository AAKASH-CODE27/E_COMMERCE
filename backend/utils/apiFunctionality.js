class APIFunctionality {
  constructor(query, queryStr) {
    this.query = query;

    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);
    this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page || 1);
    console.log(typeof currentPage);
    // no of skipped product to display on currentPage
    // i.e., pg1 10 , pg2 11-20, pg3 21-30
    const skip = (currentPage - 1) * resultPerPage;
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default APIFunctionality;
