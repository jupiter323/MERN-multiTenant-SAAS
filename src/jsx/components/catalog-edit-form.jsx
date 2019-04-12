import React, { Component } from 'react';
import PropTypes from 'prop-types';
import async from 'async';
import Utils from '../common/utils';
import FormValidationErrors from './form-validation-errors';
import FormSubmitErrors from './form-submit-errors';
import CompanyService from '../services/company-service';
import Roles from '../../shared/roles';
class CatalogEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {        
      companies: [],
      validation: {
        sku: {
          valid: false,
          touched: false,
          message: 'SKU is required'
        },
        subdomain: {
          valid: false,
          touched: false,
          message: 'Sub Domain is required'
        },
        formValid: false
      },
      isFetching: true
    };

    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    const self = this;
    async.parallel({
      companies: (callback) => {
        if (self.props.role === Roles.siteAdmin) {
          CompanyService.getCompanies(null, callback);
        } else { // Role: 'Admin'
          callback(null, null);
        }
      }
    }, (err, results) => {
      if (err) {
        const result = results.user || results.companies;
        if (result && result.errors) {
          self.setState({ errors: result.errors });
        } else {
          self.setState({ errors: [err.message] });
        }
      } else if (results) {
        if (results.user && results.user.success) {
          const u = results.user.data;
          if (u.company) u.company = u.company._id;
          else u.company = '';
          self.setState({ user: u });

          // Validate form after inputs are loaded
          Object.keys(self.state.user).forEach((key) => {
            self.validate(key, self.state.user[key]);
          });
        }

        if (results.companies && results.companies.success) {
          self.setState({ companies: results.companies.docs });
        }

        self.setState({ isFetching: false });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isFetching !== this.state.isFetching) {
      Object.keys(this.props.company).forEach((key) => {
        this.validate(key, this.props.company[key]);
      });

      Utils.focusFirstInput();
    }
  }

  componentDidMount() {
    Utils.focusFirstInput();
  }

  changeInput(evt) {
    const field = evt.target.name;
    const value = evt.target.value;
    const company = this.props.company;
    company[field] = value;

    this.setState({
      errors: []
    });
    this.validate(field, value);
  }

  validate(field, value) {
    const validation = this.state.validation;
    if (validation[field]) validation[field].touched = true;

    switch (field) {
      case 'name':
        validation.name.valid = value.length > 0;
        break;
      case 'subdomain':
        validation.subdomain.valid = value.length > 0;
        break;
    }

    validation.formValid = true;
    Object.keys(validation).forEach((key) => {
      if (typeof validation[key].valid === 'boolean' && !validation[key].valid) {
        validation.formValid = false;
      }
    });

    this.setState({ validation: validation }); // eslint-disable-line object-shorthand
  }

  cancel() {
    this.props.history.goBack();
  }

  render() {
    const validation = this.state.validation;
    const companyOptions = [<option key="" value="" />];
    this.state.companies.forEach((company) => {
      companyOptions.push(<option key={company.id} value={company.id}>{company.name}</option>);
    });
    return (
      <div>
        <div className="col-sm-4 col-md-4 col-lg-4">
          <fieldset disabled={this.props.isFetching || this.state.isFetching ? 'disabled' : ''}>
            <form className="form-horizontal" action="/" onSubmit={this.props.submit}>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="sku">SKU</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="sku" name="sku" value={this.props.company.sku} placeholder="SKU Name" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="skulink">SKU Link</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="skulink" name="skulink" value={this.props.company.skulink} placeholder="SKU Link" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="title">Title</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="title" name="title" value={this.props.company.title} placeholder="Title" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="condition">Condition</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="condition" name="condition" value={this.props.company.condition} placeholder="Condition" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="instock">In Stock</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="instock" name="instock" value={this.props.company.instock} placeholder="In Stock" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="unitcost">Unit Cost</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="unitcost" name="unitcost" value={this.props.company.unitcost} placeholder="Unit Cost" onChange={this.changeInput} />
                </div>
              </div>
              {this.props.role === Roles.siteAdmin &&
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="company">Company</label>
                  <div className="col-sm-9">
                    <select className="form-control" id="company" name="company" value={this.props.company.id} onChange={this.changeInput} >
                      {companyOptions}
                    </select>
                  </div>
                </div>
              }

              {/* 
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="name">Name</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="name" name="name" value={this.props.company.name} placeholder="Company Name" onChange={this.changeInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="subdomain">Sub&nbsp;Domain</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="subdomain" name="subdomain" value={this.props.company.subdomain} placeholder="Sub Domain" onChange={this.changeInput} />
                </div>
              </div> */}
              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                  <button disabled={!validation.formValid} type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-default m-l-sm" onClick={this.cancel}>Cancel</button>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-4">
          <FormValidationErrors validation={validation} />
          <FormSubmitErrors errors={this.props.errors} />
        </div>
      </div>
    );
  }
}
CatalogEditForm.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subdomain: PropTypes.string.isRequired
  }).isRequired,
  submit: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CatalogEditForm;
