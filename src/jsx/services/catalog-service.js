import Request from './request';

const CatalogService = {

  /**
   * Get Catalog
   *
   * @param {string}   query query string with paging options
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getCatalog: (query, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    query = query || '';
    Request.get(`/api/catalog${query}`, callback);
  },

  /**
   * Get Product by id
   *
   * @param {string}   id Product id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getProduct: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/catalog/${id}`, callback);
  },

  /**
   * Get Product by id
   *
   * @param {string}   subdomain Product subdomain
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getProductBySubdomain: (subdomain, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/catalog/subdomain/${subdomain}`, callback);
  },

  /**
   * Add new Product
   *
   * @param {object}   Product Product object to add
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  newProduct: (product, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.post('/api/catalog', JSON.stringify({ product /* :product */ }), callback);
  },

  /**
   * Update a product
   *
   * @param {object}   product product object to update
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  updateProduct: (product, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.put('/api/catalog', JSON.stringify({ product /* :product */ }), callback);
  },

  /**
   * Delete a product
   *
   * @param {string}   id product id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  deleteProduct: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.delete(`/api/catalog/${id}`, callback);
  }
};

export default CatalogService;
