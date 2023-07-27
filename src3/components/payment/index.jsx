import Paymentlist from 'components/payment/paymentList';
import AddPayment from '../payment/forms/paymentForm';
// import  from 'components/contact/ViewDetails';
import React, { Fragment, PureComponent } from 'react';


class Payment extends PureComponent {


  frameLoad = () => {
    const { match: { params: { pageName } } } = this.props;
    switch (pageName) {
      case 'list':
        return <Paymentlist props={this.props} />
      case 'addform':
        return <AddPayment props={this.props} />
      case 'editform':
        return <AddPayment props={this.props} />
    //   case 'viewform':
    //     return <ViewDetails props={this.props} />
      default:
        return;
    }
  }

  render() {
    return (
      <Fragment>
        {this.frameLoad()}
      </Fragment>
    )
  }

}
export default Payment;